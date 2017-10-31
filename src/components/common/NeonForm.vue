<template>
	<div class="neon-form" v-draggble-form="{ dragOn: 'header' }" v-show="formData.show">
		<form action="#" method="post" id="form" class="form" @submit.prevent="submit" enctype="multipart/form-data">
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
			<div class="form-group">
				<span class="actions right">
					<a href="#" v-bind:class="{ active: sage }" @click="sage = !sage" @click.prevent.stop title="Don't bump thread">sage</a>
					<a href="#" v-bind:class="{ active: noko }" @click="noko = !noko" @click.prevent.stop title="Return to thread">noko</a>
				</span>
				<div class="clear"></div>
			</div>
			<div class="form-group">
				{{file}}
			</div>
		</form>
	</div>
</template>

<script>
	import Loading from '../common/Loading'

	export default {
		name: 'neon-form',
		components: {
			Loading
		},
		props: ['formData'],
		data() {
			return {
				subject: '',
				message: '',
				file: '',
				sage: false,
				noko: true
			}
		},
		methods: {
			submit() {
				if (this.canSubmit) return

				let formData = new FormData()
					formData.append('board_slug', this.formData.board)
					formData.append('parent', this.formData.thread)
					formData.append('subject', this.subject)
					formData.append('message', this.message)
					//formData.append('file', this.file)
					formData.append('sage', (this.sage) ? 1 : 0)
					formData.append('noko', (this.noko) ? 1 : 0)

				this.$store.commit('SET_LOADING', true)
				this.$store.dispatch('SEND_POST_DATA', formData)
				.then((data) => {
					if (data.type == 'error') {
						alert(data.message)
					}
					if (data.type == 'success') {
						// Чистим инпуты
						this.clear()
						// Собщаем приложению о том что ты сейчас сделал
						this.$bus.emit('form:submit', data.created)
					}

					this.$ga.event('Form', 'Submit', data.type)
					// Status
					this.$store.commit('SET_LOADING', false)
				})
				.catch((error) => {
					alert(error)
					// Status
					this.$store.commit('SET_LOADING', false)
				})
			},
			close() {
				// Собщаем приложению о том что ты сейчас сделал
				this.$bus.emit('form:close')

				this.$ga.event('Form', 'Close')
			},
			clear() {
				// Чистим инпуты
				this.subject = ''
				this.message = ''
				this.file = ''
			},
			onFileChange(e) {
				this.file = e.target.files || e.dataTransfer.files

				if (!this.file.length)
					return;
			},
		},
		computed: {
			loading () {
				return this.$store.state.loading
			},
			header() {
				return this.formData.thread == 0  ? 'Create thread' : 'Reply to thread #' + this.formData.thread
			},
			canSubmit() {
				return !this.message || this.loading
			}
		}
	}
</script>