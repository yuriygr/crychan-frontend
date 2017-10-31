<template>
	<section class="board">
		<div class="warp">
			<div class="board-title">
				<router-link :to="{ name: 'stream' }">/stream/</router-link>
				<span class="board-info"> - Поток тредов</span>
			</div>
			<template v-if="threadsStream">
				<div class="board-content" v-if="threadsStream.length > 0">
					<thread v-for="thread in threadsStream" :key="thread.id" :thread="thread" :replyLimit="3" :open="false">
						<post v-for="post in thread.replies" :key="post.id" :post="post"/>
					</thread>
				</div>
				<div class="board-content" v-else>
					<h4>There are no threads</h4>
					<p>Surprisingly, but this is possible. You can correct the situation by creating the first threads in board.</p>
				</div>
			</template>
			<template v-else>
				<h4>Loading threads</h4>
				<p>Please wait</p>
			</template>
		</div>
	</section>
</template>

<script>
	import { mapState } from 'vuex'
	import Thread from './common/Thread'
	import Post from './common/Post'

	export default {
		name: 'Stream',
		components: {
			Thread,
			Post
		},
		data() {
			return {
				titlePage: 'Loading...',
			}
		},
		metaInfo() {
			return {
				title: this.titlePage || 'Loading...'
			}
		},
		computed: {
			...mapState([
				'threadsStream'
			])
		},
		methods: {
			fetchStream(boardSlug, currentPage) {
				this.$store.commit('SET_LOADING', true)
				this.$store.dispatch('FETCH_BOARD_THREADS_STREAM')
				.then(() => {
					// Windows title
					this.titlePage = 'Stream'
					// Status
					this.$store.commit('SET_LOADING', false)
				})
				.catch((error) => {
					// Redirect to 404
					this.$router.replace({ name: 'not-found' })
					// Status
					this.$store.commit('SET_LOADING', false)
				})
			}
		},
		watch: {
			async $route(to) {
				await this.fetchStream()
			}
		},
		async mounted() {
			await this.fetchStream()
		},
		beforeDestroy() {
			// Удаляем список тредов
			this.$store.commit('REMOVE_THREADS_STREAM')
		}
	}
</script>