<template>
	<section class="content">
		<div class="warp">
			<h1>Not Found</h1>
			<p>The requested page can not be displayed because of the lack thereof</p>
		</div>
	</section>
</template>

<script>
	export default {
		name: 'not-found',
		data () {
			return {
				
			}
		},
		metaInfo() {
			return {
				title: this.pageTitle || 'Loading...'
			}
		},
	}
</script>