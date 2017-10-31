<template>
	<section class="content">
		<div class="warp">
			<h1 v-html="titlePage"></h1>
			<hr>
			<template v-if="newsList">
				<div class="article-box" v-for="(news, index) in newsList.items" :key="index">
					<article :id="news.id">
						<h4 v-html="news.name"></h4>
						<div v-html="news.content"></div>
						<span v-html="news.created_at" class="article-info"></span>
					</article>
					<div class="clear"></div>
				</div>
				<pagination name='news' :current="newsList.current" :total="newsList.total_pages" :before="newsList.before" :next="newsList.next" />
			</template>
			<template v-else-if="newsActive">
				<div class="article-box">
					<article>
						<h4 v-html="newsActive.name"></h4>
						<div v-html="newsActive.content"></div>
						<span v-html="newsActive.created_at" class="article-info"></span>
					</article>
				</div>
			</template>
			<template v-else>
				<h4>Loading news</h4>
				<p>Please wait</p>
			</template>
		</div>
	</section>
</template>

<script>
	import { mapState } from 'vuex'
	import Pagination from './common/Pagination'

	export default {
		name: 'news',
		components: {
			Pagination
		},
		data() {
			return {
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
				this.$store.commit('SET_LOADING', true)
				this.$store.dispatch('FETCH_NEWS_LIST', query.currentPage)
				.then(() => {
					// Windows title
					this.titlePage = 'News'
					// Удаляем текущую новость
					this.$store.commit('REMOVE_NEWS_ACTIVE')
					// Status
					this.$store.commit('SET_LOADING', false)
				})
				.catch((error) => {
					// Redirect to 404
					this.$router.replace({ name: 'not-found' })
					// Status
					this.$store.commit('SET_LOADING', false)
				})
			},
			fetchNews(params) {
				this.$store.commit('SET_LOADING', true)
				this.$store.dispatch('FETCH_NEWS', params.newsSlug)
				.then(() => {
					// Windows title
					this.titlePage = 'News'
					// Удаляем текущие списки новостей
					this.$store.commit('REMOVE_NEWS_LIST')
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