<template>
	<header>
		<div class="warp">
			<ul class="header__links left">
				<li>
					<router-link :to="{ name: 'home' }">{{ name }}</router-link>
				</li>
			</ul>
			<ul class="header__links right">
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
				'boardsList'
			])
		}
	}
</script>