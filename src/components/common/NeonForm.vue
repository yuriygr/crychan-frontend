<template>
	<div class="neon-form" v-draggable="{ dragOn: 'header' }" v-show="show">
		<form action="#" method="post" id="form" class="form" @submit.prevent="submit">
			<div class="header">
				{{ header }}
				<span class="close" @click="close">✖</span>
			</div>
			<div class="form-group">
				<input v-model="subject" class="input" type="text" id="subject" size="30" name="subject" placeholder="Subject" tabindex="1">
				<input type="submit" id="submit" name="submit" value="Send" class="btn" tabindex="3">
			</div>
			<div class="form-group">
				<textarea v-model="message" @keydown.ctrl.13="submit" id="message" name="message" rows="8" placeholder="Message" tabindex="2"></textarea>
			</div>
		</form>
	</div>
</template>

<script>
	export default {
		name: 'neon-form',
		props: ['board', 'thread', 'show'],
		data() {
			return {
				subject: '',
				message: ''
			}
		},
		methods: {
			submit() {
				var form = document.getElementById('form');
				let formData = new FormData()

				formData.append('board', this.board)
				formData.append('thread', this.thread)
				formData.append('subject', this.subject)
				formData.append('message', this.message)
				// Говорим родителю и гуглу о своих действиях в форме
				this.$parent.$emit('form:submit')
				this.$ga.trackEvent('Form', 'Submit')
			},
			close() {
				// Говорим родителю и гуглу о своих действиях в форме
				this.$parent.$emit('form:close')
				this.$ga.trackEvent('Form', 'Close')
			},
		},
		computed: {
			header() {
				return this.thread == 0  ? 'Create thread' : 'Reply to thread #' + this.thread
			}
		}
	}
</script>