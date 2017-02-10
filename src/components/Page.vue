<template>
	<section class="content">
		<loading :show="!loaded"></loading>
		<div class="warp">
			<h1 v-html="pageTitle"></h1>
			<div v-html="activePage.text"></div>
		</div>
	</section>
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
		metaInfo() {
			return {
				title: this.pageTitle || 'Loading...'
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
				})
				.catch((error) => {
					// Redirect to 404
					this.$router.push({ name: 'not-found' })
				})
			},
			...mapActions([
				'FETCH_PAGE',
			])
		},
		watch: {
			$route() {
				this.loaded = false
				this.fetchPage(this.$route.params.pageSlug)
			}
		},
		beforeMount() {
			this.fetchPage(this.$route.params.pageSlug)
		}
	}
</script>