<template>
	<section class="index">
		<div class="warp">
			<h1>{{ name }}</h1>
			<p>Fuck JavaScript</p>
		</div>
	</section>
</template>

<script>
	import { mapState } from 'vuex'

	export default {
		name: 'app-home',
		metaInfo() {
			return {
				title: this.name
			}
		},
		computed: {
			...mapState([
				'name',
			])
		}
	}
</script>

<style>
.index {
	text-align: center;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>