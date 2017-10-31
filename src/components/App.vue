<template>
	<div id="app" :class="[ { 'loading': loading }, theme ]">
		<app-header></app-header>
		<router-view></router-view>
		<app-footer></app-footer>
		<loading :show="loading"></loading>
	</div>
</template>

<script>
	import { mapState, mapActions } from 'vuex'
	import AppHeader from './common/AppHeader'
	import AppFooter from './common/AppFooter'
	import Loading from './common/Loading'

	export default {
		name: 'app',
		components: {
			AppHeader,
			AppFooter,
			Loading
		},
		computed: {
			...mapState([
				'loading'
			]),
			theme() {
				return localStorage.getItem('theme') || 'theme-dark'
			}
		},
		methods: {
			...mapActions([
				'FETCH_BOARDS_LIST'
			])
		},
		beforeMount() {
			// Получаем список разделов
			this.FETCH_BOARDS_LIST()
		}
	}
</script>