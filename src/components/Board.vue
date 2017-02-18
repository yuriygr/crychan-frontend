<template>
	<section class="content">
		<loading :show="!loaded"></loading>
		<div class="warp">
			<div v-if="activeBoard">
				<h4 class="board-name">
					<router-link :to="{ name: 'board', params: { boardSlug: activeBoard.slug } }" :title="activeBoard.description">{{ pageTitle }}</router-link>
				</h4>
				<hr>
				<div class="board-content" v-if="activeBoard.threads.items.length > 0">
					<thread v-for="thread in activeBoard.threads.items" key="thread.id" :thread="thread" :replyLimit="activeBoard.reply_limit" :open="false">
						<post v-for="post in thread.replys" key="post.id" :post="post"></post>
					</thread>
					<pagination
						:name="'board'"
						:current="activeBoard.threads.current"
						:total="activeBoard.threads.total_pages"
						:before="activeBoard.threads.before"
						:next="activeBoard.threads.next"
					></pagination>
				</div>
				<div class="board-empty" v-else>
					<h4>В этом разделе нет тредов</h4>
					<p>Удивительно, но такое возможно. Ты можешь исравить ситуацию создав первый тред. Слови GET 1.</p>
				</div>
			</div>

			<div v-if="activeThread">
				<h4 class="board-name">
					<router-link :to="{ name: 'board', params: { boardSlug: activeThread.slug } }" :title="activeThread.description">{{ pageTitle }}</router-link>
				</h4>
				<hr>
				<div class="board-content">
					<thread key="activeThread.thread.id" :thread="activeThread.thread" :open="true">
						<post v-for="post in activeThread.thread.replys" key="post.id" :post="post"></post>
					</thread>
					<div class="thread-nav">
						<router-link :to="{ name: 'board', params: { boardSlug: activeThread.slug } }" class="btn">Return</router-link>
						<a href="#" class="btn" @click="refreshThread()" @click.prevent.stop>Refresh thread</a>
						<a href="#" class="btn" @click="scrollUp()"  @click.prevent.stop>Scroll up</a>
					</div>
				</div>
			</div>
			<neon-form :board="replyed.board" :thread="replyed.thread"></neon-form>
		</div>
	</section>
</template>

<script>
	import { mapActions } from 'vuex'
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
				activeBoard: false,
				activeThread: false,
				pageTitle: '',
				loaded: false,

				replyed: {
					board: '',
					thread: ''
				}
			}
		},
		ready() {
			this.$on('form:submit', () => {
				console.log('ДА ПОШЛО ТЫ НАХУЙ')
				this.refreshThread()
			})
		},
		metaInfo() {
			return {
				title: this.pageTitle || 'Loading...'
			}
		},
		methods: {
			fetchThreadsList(boardSlug, currentPage) {
				this.FETCH_BOARD_THREADS([boardSlug, currentPage])
				.then(() => {
					// Set content and status
					this.activeBoard = this.$store.state.appBoardActive
					this.activeThread = false
					// Form
					this.replyed.board = this.activeBoard.slug
					this.replyed.thread = 0
					// Windows title
					this.pageTitle = '/' + this.activeBoard.slug + '/ - ' + this.activeBoard.name
					this.loaded = true
				})
				.catch((error, status) => {
					// Redirect to 404
					this.$router.replace({ name: 'not-found' })
				})
			},
			fetchThread(boardSlug, threadId) {
				this.FETCH_BOARD_THREAD([boardSlug, threadId])
				.then(() => {
					// Set content and status
					this.activeThread = this.$store.state.appThreadActive
					this.activeBoard = false
					// Form
					this.replyed.board = this.activeThread.slug
					this.replyed.thread = this.activeThread.thread.id
					// Windows title
					this.pageTitle = '/' + this.activeThread.slug + '/ - ' + this.activeThread.name
					this.loaded = true
				})
				.catch((error) => {
					// Redirect to 404
					this.$router.replace({ name: 'not-found' })
				})
			},

			refreshThread() {
				let boardSlug = this.activeThread.slug,
					threadId = this.activeThread.thread.id,
					postId = this.activeThread.thread.replys.length > 0
							? this.activeThread.thread.replys[this.activeThread.thread.replys.length - 1].id
							: this.activeThread.thread.id

				this.REFRESH_BOARD_THREAD([boardSlug, threadId, postId])
				.then((replys_data) => {
					if (replys_data.length > 0 )
						alert('Новых постов: ' + replys_data.length)
					else
						alert('Нет новых постов! Чан, блядь, без постинга. На что ты сука расчитываешь?')
				})
				.catch((error) => {
					alert('Проблемы со стороны сервера')
				})
			},
			scrollUp() {
				window.scrollTo(0, 0)
			},
			...mapActions([
				'REFRESH_BOARD_THREAD',
				'FETCH_BOARD_THREAD',
				'FETCH_BOARD_THREADS'
			])
		},
		watch: {
			$route() {
				this.loaded = false
				if (this.$route.params.threadId)
					this.fetchThread(this.$route.params.boardSlug, this.$route.params.threadId)
				else
					this.fetchThreadsList(this.$route.params.boardSlug, this.$route.query.page)
			}
		},
		beforeMount() {
			if (this.$route.params.threadId)
				this.fetchThread(this.$route.params.boardSlug, this.$route.params.threadId)
			else
				this.fetchThreadsList(this.$route.params.boardSlug, this.$route.query.page)
		}
	}
</script>