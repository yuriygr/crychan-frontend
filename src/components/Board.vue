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
					<thread v-for="thread in activeBoard.threads.items" key="thread.id" :thread="thread" :open="false">
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
				<div class="board-content" v-else>
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
				</div>
			</div>
		</div>
	</section>
</template>

<script>
	import { mapActions } from 'vuex'
	import Loading from './common/Loading'
	import Thread from './common/Thread'
	import Post from './common/Post'
	import Pagination from './common/Pagination'

	export default {
		name: 'board',
		components: {
			Loading,
			Thread,
			Post,
			Pagination
		},
		data() {
			return {
				activeBoard: false,
				activeThread: false,
				pageTitle: '',
				loaded: false,
			}
		},
		metaInfo() {
			return {
				title: this.pageTitle || 'Loading...'
			}
		},
		methods: {
			fetchThreadsList(boardSlug, currentPage) {
				this.loaded = false
				this.FETCH_BOARD([boardSlug, currentPage])
				.then(() => {
					// Set content and status
					this.activeBoard = this.$store.state.appBoardActive
					this.activeThread = false
					this.pageTitle = '/' + this.activeBoard.slug + '/ - ' + this.activeBoard.name
				})
				.catch((error, status) => {
					// Redirect to 404
					this.$router.push({ name: 'not-found' })
					// Set content and status
					this.activeBoard = false
				})
				.then(() => {
					this.loaded = true
				})
			},
			fetchThread(boardSlug, threadId) {
				this.loaded = false
				this.FETCH_BOARD_THREAD([boardSlug, threadId])
				.then(() => {
					// Set content and status
					this.activeThread = this.$store.state.appThreadActive
					this.activeBoard = false
					this.pageTitle = '/' + this.activeThread.slug + '/ - ' + this.activeThread.name
				})
				.catch((error, status) => {
					// Redirect to 404
					this.$router.push({ name: 'not-found' })
					// Set content and status
					this.activeThread = false
				})
				.then(() => {
					this.loaded = true
				})
			},
			...mapActions([
				'FETCH_BOARD_THREAD',
				'FETCH_BOARD'
			])
		},
		watch: {
			$route() {
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