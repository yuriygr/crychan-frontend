<template>
	<section class="content">
		<div class="warp">
			<template v-if="pageActive">
				<h1 v-html="pageActive.name"></h1>
				<hr>
				<div v-html="pageActive.text"></div>
			</template>
			<template v-else>
				<h4>Loading page</h4>
				<p>Please wait</p>
			</template>
		</div>
	</section>
</template>

<script>
	import { mapState } from 'vuex'

	export default {
		name: 'page',
		data() {
			return {
				titlePage: 'Loading...'
			}
		},
		metaInfo() {
			return {
				title: this.titlePage
			}
		},
		computed: {
			...mapState([
				'pageActive'
			])
		},
		methods: {
			fetchPage(params) {
				this.$store.commit('SET_LOADING', true)
				this.$store.dispatch('FETCH_PAGE', params.pageSlug)
				.then((page_data) => {
					// Title and status
					this.titlePage = this.pageActive.name
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