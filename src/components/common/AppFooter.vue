<template>
	<footer>
		<div class="warp">
			<ul class="footer__links">
				<li>&copy; {{ date }} {{ name }}</li>
				<li>
					<router-link :to="{ name: 'page', params: { pageSlug: 'about' } }" exact>About</router-link>
				</li>
				<li>
					<router-link :to="{ name: 'page', params: { pageSlug: 'donation' } }" exact>Donation</router-link>
				</li>
				<li><a href="https://t.me/crychan">Telegram</a></li>
			</ul>
		</div>
	</footer>
</template>

<script>
	import { mapState } from 'vuex'

	export default {
		name: 'app-footer',
		computed: {
			date() {
				return new Date().getFullYear()
			},
			...mapState([
				'name'
			])
		}
	}
</script>