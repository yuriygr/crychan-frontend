<template>
	<section class="content">
		<div class="warp">
			<h1 v-html="pageActive.name"></h1>
			<div v-html="pageActive.text"></div>
		</div>
		<loading :show="loading"></loading>
	</section>
</template>

<script>
	import Loading from './common/Loading'

	export default {
		name: 'page',
		components: {
			Loading
		},
		data() {
			return {
				loading: false,
				pageActive: {},
				titlePage: 'Loading...'
			}
		},
		metaInfo() {
			return {
				title: this.titlePage
			}
		},
		methods: {
			fetchPage(params) {
				this.loading = true
				this.$store.dispatch('FETCH_PAGE', params.pageSlug)
				.then(() => {
					// Set content and status
					this.pageActive = this.$store.state.pageActive
					this.titlePage = this.pageActive.name
					this.loading = false
				})
				.catch((error) => {
					// Redirect to 404
					this.$router.replace({ name: 'not-found' })
					return
				})
			}
		},
		watch: {
			$route(to) {
				this.fetchPage(to.params)
			}
		},
		mounted() {
			this.fetchPage(this.$route.params)
		},
		beforeDestroy() {
			// Удаляем текущую страницу
			this.$store.commit('REMOVE_PAGE_ACTIVE')
		}
	}
</script>