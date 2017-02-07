<template>
	<section class="content">
		<loading :show="!loaded"></loading>
		<div class="warp">
			<div v-if="listNews">
				<h1 v-html="pageTitle"></h1>
				<article v-for="news in listNews.items" key="news.id">
					<h4>
						<router-link :to="{ name: 'news-item', params: { newsSlug: news.slug } }" :title="news.name" exact>{{ news.name }}</router-link>
					</h4>
					<div v-html="news.description"></div>
					<div v-html="news.created_at"></div>
					<hr>
				</article>

				<pagination
					:name="'news'"
					:current="listNews.current"
					:total="listNews.total_pages"
					:before="listNews.before"
					:next="listNews.next"
				></pagination>
			</div>

			<article v-if="activeNews">
				<h1 v-html="pageTitle"></h1>
				<div v-html="activeNews.content"></div>
				<div v-html="activeNews.created_at"></div>
			</article>
		</div>
	</section>
</template>

<script>
	import { mapActions } from 'vuex'
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
				listNews: false,
				activeNews: false,
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
			fetchNewsList(currentPage) {
				this.FETCH_NEWS_LIST(currentPage)
				.then(() => {
					// Set content and status
					this.listNews = this.$store.state.appNewsList
					this.activeNews = false
					this.pageTitle = 'News'
					this.loaded = true
					// Change header
					this.$emit('updateHead')
				})
				.catch((error, status) => {
					// Redirect to 404
					this.$router.push({ name: 'not-found' })
					// Set content and status
					this.listNews = false
					this.loaded = true
				})
			},
			fetchNews(newsSlug) {
				this.FETCH_NEWS(newsSlug)
				.then(() => {
					// Set content and status
					this.activeNews = this.$store.state.appNewsActive
					this.listNews = false
					this.pageTitle = this.activeNews.name
					this.loaded = true
					// Change header
					this.$emit('updateHead')
				})
				.catch((error, status) => {
					// Redirect to 404
					this.$router.push({ name: 'not-found' })
					// Set content and status
					this.activeNews = false
					this.loaded = true
				})
			},
			...mapActions([
				'FETCH_NEWS_LIST',
				'FETCH_NEWS'
			])
		},
		watch: {
			$route() {
				this.loaded = false
				if (this.$route.params.newsSlug)
					this.fetchNews(this.$route.params.newsSlug)
				else
					this.fetchNewsList(this.$route.query.page)
			}
		},
		beforeMount() {
			this.loaded = false
			if (this.$route.params.newsSlug)
				this.fetchNews(this.$route.params.newsSlug)
			else
				this.fetchNewsList(this.$route.query.page)
		}
	}
</script>