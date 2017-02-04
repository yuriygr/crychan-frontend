<template>
	<section class="content" v-if="loaded">
		<div class="warp">
			<h1 v-html="pageTitle"></h1>
			<div v-html="activePage.text"></div>
		</div>
	</section>
	<loading :show="loaded" v-else></loading>
</template>

<script>
	import { mapActions } from 'vuex'
	import Loading from './common/Loading'

	export default {
		name: 'page',
		components: {
			Loading
		},
		data() {
			return {
				activePage: false,
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
			fetchPage(pageSlug) {
				this.FETCH_PAGE(pageSlug)
				.then(() => {
					// Set content and status
					this.activePage = this.$store.state.appPageActive
					this.pageTitle = this.activePage.name
					this.loaded = true
					// Change header
					this.$emit('updateHead')
				})
				.catch((error, status) => {
					// Redirect to 404
					this.$router.push({ name: 'not-found' })
					// Set content and status
					this.activePage = false
					this.loaded = true
				})
			},
			...mapActions([
				'FETCH_PAGE',
			])
		},
		watch: {
			$route() {
				this.fetchPage(this.$route.params.pageSlug)
			}
		},
		beforeMount() {
			this.fetchPage(this.$route.params.pageSlug)
		}
	}
</script>