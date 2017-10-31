<template>
	<ul class="pagination" v-if="total > 1">
		<li v-if="hasBefore()">
			<router-link :to="{ name: name, params: { boardSlug: board }, query: { page: before } }" exact>Before</router-link>
		</li>
		<li v-else>Before</li>
		<li v-for="page in total" v-if="page != current">
			<router-link :to="{ name: name, params: { boardSlug: board }, query: { page: page } }" exact>{{ page }}</router-link>
		</li>
		<li v-else>{{page}}</li>
		<li v-if="hasNext()">
			<router-link :to="{ name: name, params: { boardSlug: board }, query: { page: next } }" exact>Next</router-link>
		</li>
		<li v-else>Next</li>
	</ul>
</template>

<script>
	export default {
		name: 'pagination',
		props: {
			'board': {
				type: String,
				default: ''
			},
			'name': {
				type: String,
				default: ''
			},
			'current': {
				type: Number,
				default: 1
			},
			'total': {
				type: Number,
				default: 0
			},
			'before': {
				type: Number,
				default: 0
			},
			'next': {
				type: Number,
				default: 1
			}
		},
		methods: {
			hasBefore() {
				return this.current > this.before
			},
			hasNext() {
				return this.current < this.next
			}
		}
	}
</script>