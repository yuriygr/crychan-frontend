<template>
	<section class="content" v-if="loaded">
		<div class="warp">
			<div v-if="activeBoard">
				<div class="board-name">
					<router-link :to="{ name: 'board', params: { boardSlug: activeBoard.slug } }">{{ pageTitle }}</router-link>
					<span class="board-desc" v-if="activeBoard.description"> - {{ activeBoard.description }}</span>
				</div>
				<hr>
				<div class="board-content" v-if="activeBoard.threads.items.length > 0">
					<thread v-for="thread in activeBoard.threads.items" key="thread.id" :thread="thread">
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
		</div>
	</section>
	<loading :show="loaded" v-else></loading>
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
		head: {
			title() {
				return {
					inner: this.pageTitle || 'Loading...'
				}
			}
		},
		methods: {
			fetchThreadsList(boardSlug, currentPage) {
				this.FETCH_BOARD([boardSlug, currentPage])
				.then(() => {
					// Set content and status
					this.activeBoard = this.$store.state.appBoardActive
					this.activeThread = false
					this.pageTitle = '/'+ this.activeBoard.slug + '/ - ' + this.activeBoard.name
					this.loaded = true
					// Change header
					this.$emit('updateHead')
				})
				.catch((error, status) => {
					// Redirect to 404
					this.$router.push({ name: 'not-found' })
					// Set content and status
					this.activeBoard = false
					this.loaded = true
				})
			},
			...mapActions([
				'FETCH_BOARD'
			])
		},
		watch: {
			$route() {
				this.fetchThreadsList(this.$route.params.boardSlug, this.$route.query.page)
			}
		},
		beforeMount() {
				this.fetchThreadsList(this.$route.params.boardSlug, this.$route.query.page)
		}
	}
</script>