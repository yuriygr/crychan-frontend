<template>
	<section class="board">
		<div class="warp">
			<div v-if="boardActive" class="board-title">
				<router-link :to="{ name: 'board', params: { boardSlug: boardActive.slug } }">/{{ boardActive.slug }}/ - {{ boardActive.name }}</router-link>
				<span v-if="boardActive.description" class="board-info"> - {{ boardActive.description }}</span>
			</div>
			<template v-if="threadsList">
				<div class="board-content" v-if="threadsList.items.length > 0">
					<thread v-for="thread in threadsList.items" :key="thread.id" :thread="thread" :replyLimit="boardActive.replyLimit" :open="false">
						<post v-for="post in thread.replies" :key="post.id" :post="post"/>
					</thread>
					<pagination name="board" :board="boardActive.slug" :current="threadsList.current" :total="threadsList.total_pages" :before="threadsList.before" :next="threadsList.next" />
				</div>
				<div class="board-content" v-else>
					<h4>There are no threads</h4>
					<p>Surprisingly, but this is possible. You can correct the situation by creating the first thread. Catch the GET 1.</p>
				</div>
				<div class="board-nav">
					<a href="#" class="btn" @click="toggleForm" @click.prevent.stop>{{ formData.show ? 'Close' : 'Open' }} form</a>
					<a href="#" class="btn" @click="scrollUp" @click.prevent.stop>Up</a>
					<a href="#" class="btn" @click="scrollDown" @click.prevent.stop>Down</a>
				</div>
			</template>
			<template v-else-if="threadActive">
				<div class="board-content">
					<thread :thread="threadActive" :open="true">
						<post v-for="post in threadActive.replies" :key="post.id" :post="post" />
					</thread>
				</div>
				<div class="board-nav">
					<router-link class="btn" :to="{ name: 'board', params: { boardSlug: boardActive.slug } }">Back to /{{ boardActive.slug }}/</router-link>
					<a href="#" class="btn" @click="toggleForm" @click.prevent.stop>{{ formData.show ? 'Close' : 'Open' }} form</a>
					<a href="#" class="btn" @click="scrollUp" @click.prevent.stop>Up</a>
					<a href="#" class="btn" @click="scrollDown" @click.prevent.stop>Down</a>
				</div>
			</template>
			<template v-else>
				<h4>Loading threads</h4>
				<p>Please wait</p>
			</template>
		</div>
		<neon-form :formData="formData" />
		<div class="preview"></div>
	</section>
</template>

<script>
	import { mapState } from 'vuex'
	import { threads } from 'create-api'
	import Thread from './common/Thread'
	import Post from './common/Post'
	import NeonForm from './common/NeonForm'
	import Pagination from './common/Pagination'

	export default {
		name: 'board',
		components: {
			Thread,
			Post,
			NeonForm,
			Pagination
		},
		data() {
			return {
				titlePage: 'Loading...',

				formData: {
					board: false,
					thread: 0,
					show: false,
					pos_x: 0,
					pos_y: 0
				}
			}
		},
		created() {
			this.$bus.on('form:submit', (data) => {
				if (data.type == 'reply')
					this.$bus.emit('thread:refresh')

				if (data.type == 'thread')
					this.$router.push('/' + data.board + '/thread/' + data.post)

				this.scrollToPost(data.post)
			})
			this.$bus.on('form:open', (thread) => {
				this.toggleForm()
			})
			this.$bus.on('form:close', () => {
				this.toggleForm()
			})
			this.$bus.on('thread:reply', (data) => {
				this.replyToPost(data)
			})
			this.$bus.on('thread:preview', (data) => {
				if (data.type == 'mouseover')
					this.showPost(data)
			})
		},
		metaInfo() {
			return {
				title: this.titlePage
			}
		},
		computed: {
			...mapState([
				'boardActive',
				'threadsList',
				'threadActive'
			])
		},
		methods: {
			setBoard(boardSlug) {
				this.$store.commit('SET_LOADING', true)
				this.$store.dispatch('SET_BOARD_ACTIVE', boardSlug)
				.then(() => {
					// Windows title
					this.titlePage = '/' + this.boardActive.slug + '/ - ' + this.boardActive.name
				})
				.catch((error) => {
					// Redirect to 404
					this.$router.replace({ name: 'not-found' })
					// Status
					this.$store.commit('SET_LOADING', false)
				})
			},
			fetchThreads(boardSlug, currentPage) {
				this.$store.dispatch('FETCH_BOARD_THREADS', [boardSlug, currentPage])
				.then(() => {
					// Form
					this.formData.board = this.boardActive.slug
					this.formData.thread = 0
					// Отчищаем активный тред
					this.$store.commit('REMOVE_THREAD_ACTIVE')
					// Status
					this.$store.commit('SET_LOADING', false)
				})
				.catch((error) => {
					// Redirect to 404
					this.$router.replace({ name: 'not-found' })
					// Status
					this.$store.commit('SET_LOADING', false)
				})
			},
			fetchThread(boardSlug, threadId) {
				this.$store.dispatch('FETCH_BOARD_THREAD', [boardSlug, threadId])
				.then(() => {
					// Form
					this.formData.board = this.boardActive.slug
					this.formData.thread = this.threadActive.id
					// Отчищаем список тредов
					this.$store.commit('REMOVE_THREADS_LIST')
					// Status
					this.$store.commit('SET_LOADING', false)
				})
				.catch((error) => {
					// Redirect to 404
					this.$router.replace({ name: 'not-found' })
					// Status
					this.$store.commit('SET_LOADING', false)
				})
			},

			toggleForm() {
				this.formData.show = !this.formData.show

				this.$ga.event('Form', (this.formData.show) ? 'Open' : 'Close')
			},
			scrollUp() {
				window.scrollTo(0, 0)
			},
			scrollDown() {
				window.scrollTo(0, document.body.scrollHeight)
			},
			scrollToPost(post) {
				this.$nextTick(() => {
					setTimeout(() => {
						console.log(post)
					}, 200)
				})
			},

			replyToPost(post) {
				console.log(post.id)
				return false
			},
			showPost({ e, type, params }) {

				const offset = (el, xy) => {
					let c = 0;
					while(el) {
						c += el[xy];
						el = el.offsetParent;
					}
					return c;
				}

				threads.post(params)
				.then((post_data) => {
					let x, y,
						link = e.target,
						scrW = document.body.clientWidth || document.documentElement.clientWidth,
						scrH = window.innerHeight || document.documentElement.clientHeight

					// Положение элемента в пространстве
					x = offset(link, 'offsetLeft') + link.offsetWidth / 2
					y = offset(link, 'offsetTop')

					if (e.clientY < scrH * 0.75) y += link.offsetHeight

					let post = document.createElement('div')
						post.id = 'preview-' + post_data.id
						post.className = 'post'
						post.style.cssText = ('position:absolute; z-index:300; border:1px solid grey; '
						+ (x < scrW/2 ? 'left:' + x : 'right:' + parseInt(scrW - x + 2)) + 'px; '
						+ (e.clientY < scrH*0.75 ? 'top:' + y : 'bottom:' + parseInt(scrH - y - 4)) + 'px')

					let post_info = document.createElement('div')
						post_info.className = 'post-info'
						post_info.innerHTML = post_data.id + '  ' + post_data.timestamp + '  ' + post_data.subject

					let post_message = document.createElement('div')
						post_message.className = 'post-message'
						post_message.innerHTML = post_data.message

						post.appendChild(post_info)
						post.appendChild(post_message)
					document.querySelector('.preview').appendChild(post)
				})
				.catch((error) => {
					console.log(error)
				})
			}
		},
		watch: {
			async $route(to) {
				// Дожидаемся установки раздела
				await this.setBoard(this.$route.params.boardSlug)
				// А затем уже получаемданные треда
				if (this.$route.params.threadId)
					this.fetchThread(this.$route.params.boardSlug, this.$route.params.threadId)
				else
					this.fetchThreads(this.$route.params.boardSlug, this.$route.query.page)
			}
		},
		async mounted() {
			// Дожидаемся установки раздела
			await this.setBoard(this.$route.params.boardSlug)
			// А затем уже получаемданные треда
			if (this.$route.params.threadId)
				this.fetchThread(this.$route.params.boardSlug, this.$route.params.threadId)
			else
				this.fetchThreads(this.$route.params.boardSlug, this.$route.query.page)
		},
		beforeDestroy() {
			// Удаляем текущую борду
			this.$store.commit('REMOVE_BOARD_ACTIVE')
			// Удаляем текущий тред
			this.$store.commit('REMOVE_THREAD_ACTIVE')
			// Удаляем список тредов
			this.$store.commit('REMOVE_THREADS_LIST')

			// Отписались от эвентов
			this.$bus.off('form:submit')
			this.$bus.off('form:close')
			this.$bus.off('form:open')
			this.$bus.off('thread:reply')
			this.$bus.off('thread:preview')
		}
	}
</script>