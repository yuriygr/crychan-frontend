<template>
	<div id="app">
		<app-header></app-header>
		<router-view></router-view>
		<app-footer></app-footer>
	</div>
</template>

<script>
	import AppHeader from './common/AppHeader'
	import AppFooter from './common/AppFooter'

	export default {
		name: 'app',
		components: {
			AppHeader,
			AppFooter
		}
	}
</script>