<template>
	<footer>
		<div class="warp">
			<span>&copy; {{ date }} {{ appName }}</span>
		</div>
	</footer>
</template>

<script>
	export default {
		name: 'app-footer',
		computed: {
			appName() {
				return this.$store.state.appName
			},
			date() {
				return new Date().getFullYear()
			}
		}
	}
</script>