<template>
	<header>
		<div class="warp">
			<ul class="header__links left">
				<li v-for="board in appBoardsList" key="board.id">
					<router-link :to="{ name: 'board', params: { boardSlug: board.slug } }" :title="board.name" exact>{{ board.name }}</router-link>
				</li>
			</ul>
			<ul class="header__links right">
				<li>
					<router-link :to="{ name: 'home' }" exact>Home</router-link>
				</li>
				<li v-for="page in appPagesList" key="page.id">
					<router-link :to="{ name: 'page', params: { pageSlug: page.slug } }" exact>{{ page.name }}</router-link>
				</li>
				<li>
					<router-link :to="{ name: 'news' }">News</router-link>
				</li>
			</ul>
			<div class="clear"></div>
		</div>
	</header>
</template>

<script>
	import { mapState, mapActions } from 'vuex'

	export default {
		name: 'app-header',
		computed: {
			...mapState([
				'appName',
				'appBoardsList',
				'appPagesList'
			])
		},
		methods: {
			...mapActions([
				'FETCH_BOARDS_LIST',
				'FETCH_PAGES_LIST',
			])
		},
		beforeMount() {
			this.FETCH_BOARDS_LIST()
			this.FETCH_PAGES_LIST()
		}
	}
</script>