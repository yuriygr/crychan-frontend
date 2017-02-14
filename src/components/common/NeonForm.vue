<template>
	<div class="neon-form" draggable="true">
		<form action="#" method="post" id="form" class="form" @submit.prevent="formSubmit()">
			<div class="header">
				{{ formHeader }}
				<span class="close" @click="formClose()">✖</span>
			</div>

			<div class="form-group">
				<input v-model="subject" class="input" type="text" id="subject" name="subject" placeholder="Subject" tabindex="1">
				<input type="submit" id="submit" name="submit" value="Send" class="btn" tabindex="3">
			</div>

			<div class="form-group">
				<textarea v-model="message" @keydown="formHandle()" id="message" name="message" rows="6" placeholder="Message" tabindex="2"></textarea>
			</div>
		</form>
	</div>
</template>

<script>
	export default {
		name: 'neon-form',
		props: ['board', 'thread'],
		data() {
			return {
				subject: '',
				message: ''
			}
		},
		created() {
			this.$on('pageChanged', () => {
				console.log('страница сменилась')
			});
		},
		methods: {
			formHandle() {
				if ((event.metaKey || event.ctrlKey) && event.keyCode == 13) {
					this.formSubmit()
				}
			},

			formSubmit() {
				var form = document.getElementById('form');
				let formData = new FormData()

				formData.append('board', this.board)
				formData.append('thread', this.thread)
				formData.append('subject', this.subject)
				formData.append('message', this.message)

				console.log(event.target)

				console.log(formData.get())

				this.$emit('formSubmit')
			},
			formClose() {
				this.$emit('formClose')
			},
		},
		computed: {
			formHeader() {
				return this.thread == 0  ? 'Create thread' : 'Reply to ' + this.thread
			}
		},
	}
</script>