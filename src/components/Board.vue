<template>
	<section class="board">
		<div class="warp">
			<div v-if="boardActive" class="board-title">
				<router-link :to="{ name: 'board', params: { boardSlug: boardActive.slug } }">/{{ boardActive.slug }}/ - {{ boardActive.name }}</router-link>
				<span v-if="boardActive.description" class="board-info"> - {{ boardActive.description }}</span>
			</div>
			<br>
			<template v-if="threadsList">
				<div class="board-content" v-if="threadsList.items.length > 0">
					<thread v-for="thread in threadsList.items" key="thread.id" :thread="thread" :replyLimit="boardActive.replyLimit" :open="false">
						<post v-for="post in thread.replies" key="post.id" :post="post"></post>
					</thread>
					<pagination
						:name="'board'"
						:current="threadsList.current"
						:total="threadsList.total_pages"
						:before="threadsList.before"
						:next="threadsList.next"
					></pagination>
				</div>
				<div class="board-content" v-else>
					<h4>В этом разделе нет тредов</h4>
					<p>Удивительно, но такое возможно. Ты можешь исравить ситуацию создав первый тред. Слови GET 1.</p>
				</div>
				<div class="board-nav">
					<a href="#" class="btn" @click="toggleForm" @click.prevent.stop>Open form</a>
					<a href="#" class="btn" @click="scrollUp" @click.prevent.stop>Scroll up</a>
				</div>
			</template>
			<template v-if="threadActive">
				<div class="board-content">
					<thread key="threadActive.id" :thread="threadActive" :open="true">
						<post v-for="post in threadActive.replies" key="post.id" :post="post"></post>
					</thread>
				</div>
				<div class="board-nav">
					<router-link class="btn" :to="{ name: 'board', params: { boardSlug: boardActive.slug } }">Back</router-link>
					<a href="#" class="btn" @click="refreshThread" @click.prevent.stop>Refresh thread</a>
					<a href="#" class="btn" @click="toggleForm" @click.prevent.stop>Open form</a>
					<a href="#" class="btn" @click="scrollUp" @click.prevent.stop>Scroll up</a>
				</div>
			</template>
		</div>
		<neon-form :board="formData.board" :thread="formData.thread" :show="formData.show"></neon-form>
		<loading :show="loading"></loading>
	</section>
</template>

<script>
	import { mapState } from 'vuex'
	import Loading from './common/Loading'
	import Thread from './common/Thread'
	import Post from './common/Post'
	import NeonForm from './common/NeonForm'
	import Pagination from './common/Pagination'

	export default {
		name: 'board',
		components: {
			Loading,
			Thread,
			Post,
			NeonForm,
			Pagination
		},
		data() {
			return {
				loading: false,
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
			this.$bus.on('form:submit', (created) => {
				if (created.type == 'reply')
					this.refreshThread()

				if (created.type == 'thread')
					this.$router.push('/' + created.board + '/thread/' + created.post)

				this.scrollToPost(created.post)
			})
			this.$bus.on('form:close', () => {
				this.toggleForm()
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
				this.loading = true
				this.$store.dispatch('SET_BOARD_ACTIVE', boardSlug)
				.then(() => {
					// Windows title
					this.titlePage = '/' + this.boardActive.slug + '/ - ' + this.boardActive.name
					// Status
					this.loading = false
				})
				.catch((error) => {
					// Redirect to 404
					this.$router.replace({ name: 'not-found' })
				})
			},
			fetchThreads(boardSlug, currentPage) {
				this.loading = true
				this.$store.dispatch('FETCH_BOARD_THREADS', [boardSlug, currentPage])
				.then(() => {
					// Form
					this.formData.board = this.boardActive.slug
					this.formData.thread = 0
					// Status
					this.loading = false
					// Отчищаем активный тред
					this.$store.commit('REMOVE_THREAD_ACTIVE')
				})
				.catch((error) => {
					// Redirect to 404
					this.$router.replace({ name: 'not-found' })
				})
			},
			fetchThread(boardSlug, threadId) {
				this.loading = true
				this.$store.dispatch('FETCH_BOARD_THREAD', [boardSlug, threadId])
				.then(() => {
					// Form
					this.formData.board = this.boardActive.slug
					this.formData.thread = this.threadActive.id
					// Status
					this.loading = false
					// Отчищаем список тредов
					this.$store.commit('REMOVE_THREADS_LIST')
				})
				.catch((error) => {
					// Redirect to 404
					this.$router.replace({ name: 'not-found' })
				})
			},

			refreshThread() {
				let boardSlug = this.boardActive.slug,
					threadId = this.threadActive.id,
					afterId = this.threadActive.replies.length > 0
							? this.threadActive.replies[this.threadActive.replies.length - 1].id
							: this.threadActive.id

				this.$store.dispatch('REFRESH_BOARD_THREAD', [boardSlug, threadId, afterId])
				.then((replies_data) => {
					if (replies_data.length > 0)
						console.log('Новых постов: ' + replies_data.length)
					else
						console.log('Нет новых постов!')
				})
				.catch((error) => {
					console.log(error)
				})

				this.$ga.trackEvent('Thread', 'Refresh')
			},


			toggleForm() {
				this.formData.show = !this.formData.show
				this.$ga.trackEvent('Form', this.formData.show ? 'Open' : 'Close')
			},

			scrollUp() {
				window.scrollTo(0, 0)
			},

			scrollToPost(post) {
				this.$nextTick(() => {
					setTimeout(() => {
						console.log(post)
					}, 100)
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
		}
	}
</script>