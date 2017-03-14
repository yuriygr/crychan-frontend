<template>
	<section class="content">
		<div class="warp">
			<template v-if="newsList">
				<h1 v-html="titlePage"></h1>
				<article v-for="news in newsList.items" key="news.id">
					<h4>
						<router-link :to="{ name: 'news-item', params: { newsSlug: news.slug } }" :title="news.name" exact>{{ news.name }}</router-link>
					</h4>
					<div v-html="news.description"></div>
					<div v-html="news.created_at"></div>
					<hr>
				</article>

				<pagination
					:name="'news'"
					:current="newsList.current"
					:total="newsList.total_pages"
					:before="newsList.before"
					:next="newsList.next"
				></pagination>
			</template>

			<article v-if="newsActive">
				<h1 v-html="titlePage"></h1>
				<div v-html="newsActive.content"></div>
				<div v-html="newsActive.created_at"></div>
			</article>
		</div>
		<loading :show="loading"></loading>
	</section>
</template>

<script>
	import { mapState } from 'vuex'
	import Loading from './common/Loading'
	import Pagination from './common/Pagination'

	export default {
		name: 'news',
		components: {
			Loading,
			Pagination
		},
		data() {
			return {
				loading: false,
				titlePage: 'Loading...',
			}
		},
		metaInfo() {
			return {
				title: this.titlePage
			}
		},
		computed: {
			...mapState([
				'newsList',
				'newsActive'
			])
		},
		methods: {
			fetchNewsList(query) {
				this.loading = true
				this.$store.dispatch('FETCH_NEWS_LIST', query.currentPage)
				.then(() => {
					// Windows title
					this.titlePage = 'News'
					// Status
					this.loading = false
					// Удаляем текущую новость
					this.$store.commit('REMOVE_NEWS_ACTIVE')
				})
				.catch((error) => {
					// Redirect to 404
					this.$router.replace({ name: 'not-found' })
					return
				})
			},
			fetchNews(params) {
				this.loading = true
				this.$store.dispatch('FETCH_NEWS', params.newsSlug)
				.then(() => {
					// Windows title
					this.titlePage = this.newsActive.name
					// Status
					this.loading = false
					// Удаляем текущие списки новостей
					this.$store.commit('REMOVE_NEWS_LIST')
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
				if (to.params.newsSlug)
					this.fetchNews(to.params)
				else
					this.fetchNewsList(to.query)
			}
		},
		mounted() {
			if (this.$route.params.newsSlug)
				this.fetchNews(this.$route.params)
			else
				this.fetchNewsList(this.$route.query)
		},
		beforeDestroy() {
			// Удаляем текущие списки новостей
			this.$store.commit('REMOVE_NEWS_LIST')
			// Удаляем текущую новость
			this.$store.commit('REMOVE_NEWS_ACTIVE')
		}
	}
</script>