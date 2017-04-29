<template>
	<div class="neon-form" v-draggable="{ dragOn: 'header' }" v-show="show">
		<form action="#" method="post" id="form" class="form" @submit.prevent="submit">
			<div class="header">
				{{ header }}
				<span class="close" @click="close">✖</span>
			</div>
			<div class="form-group">
				<input v-model="subject" class="input" type="text" id="subject" size="30" name="subject" placeholder="Subject" tabindex="1">
				<input type="submit" id="submit" name="submit" value="Send" class="btn" tabindex="3" :disabled="canSubmit">
			</div>
			<div class="form-group">
				<textarea v-model="message" @keydown.ctrl.13="submit" id="message" name="message" rows="8" placeholder="Message" tabindex="2"></textarea>
			</div>
		</form>
	</div>
</template>

<script>
	import { threads } from 'create-api'

	export default {
		name: 'neon-form',
		props: ['board', 'thread', 'show'],
		data() {
			return {
				subject: '',
				message: '',
				sage: ''
			}
		},
		methods: {
			submit() {
				let formData = new FormData()
				formData.append('board_slug', this.board)
				formData.append('parent', this.thread)
				formData.append('subject', this.subject)
				formData.append('message', this.message)

				threads.add(formData)
				.then((data) => {
					// Сообщаем гуглу о том, то сделали
					this.$ga.trackEvent('Form', 'Submit', data.type)
					if (data.type == 'error') {
						console.error(data.message)
					}
					if (data.type == 'success') {
						// Чистим инпуты
						this.clear()
						// Собщаем приложению о том что ты сейчас сделал
						this.$bus.emit('form:submit', data.created)
					}
				})
				.catch((error) => {
					console.log(error)
				})
			},
			close() {
				// Сообщаем гуглу о том, то сделали
				this.$ga.trackEvent('Form', 'Close')
				// Собщаем приложению о том что ты сейчас сделал
				this.$bus.emit('form:close')
			},
			clear() {
				// Чистим инпуты
				this.subject = ''
				this.message = ''
				this.sage = ''
			}
		},
		computed: {
			header() {
				return this.thread == 0  ? 'Create thread' : 'Reply to thread #' + this.thread
			},
			canSubmit() {
				return !this.message
			}
		}
	}
</script>