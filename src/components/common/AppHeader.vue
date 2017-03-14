<template>
	<header>
		<div class="warp">
			<ul class="header__links left">
				<li v-if="boardActive">
					<router-link :to="{ name: 'board', params: { boardSlug: boardActive.slug } }">/{{ boardActive.slug }}/ - {{ boardActive.name }}</router-link>
				</li>
				<li v-if="newsList || newsActive">
					News
				</li>
				<li v-if="pagesList || pageActive">
					Page
				</li>
			</ul>
			<ul class="header__links right">
				<li>
					<router-link :to="{ name: 'home' }">{{ name }}</router-link>
				</li>
				<li v-for="(board, index) in boardsList" key="index">
					<router-link :to="{ name: 'board', params: { boardSlug: board.slug } }" :title="board.name" exact>/{{ board.slug }}/</router-link>
				</li>
				<li>
					<router-link :to="{ name: 'news' }">/news/</router-link>
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
				'name',
				'boardsList',
				'boardActive',
				'newsList',
				'newsActive',
				'pagesList',
				'pageActive'
			])
		}
	}
</script>

<style>
.fade-enter-active, .fade-leave-active {
	transition: opacity .4s
}
.fade-enter, .fade-leave-to {
	opacity: 0
}
</style>