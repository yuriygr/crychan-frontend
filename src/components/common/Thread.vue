<template>
	<div class="thread-box" v-if="!isHidden">
		<div class="post thread" :id="thread.id">
			<div class="post-info">
				<span class="locked" v-if="thread.isLocked">Locked</span>
				<span class="sticky" v-if="thread.isSticky">Sticky</span>
				<span class="subject" v-if="thread.subject">{{ thread.subject }}</span>
				<span class="name">{{ thread.name }}</span>
				<span class="time">{{ thread.timestamp | timeFormat }}</span>
				<span class="link">
					<router-link :to="{ name: 'thread', params: { boardSlug: thread.board, threadId: thread.id }, hash: '#' + thread.id }">#{{ thread.id }}</router-link>
				</span>
				<template v-if="!open">
					<span class="open" >
						<router-link :to="{ name: 'thread', params: { boardSlug: thread.board, threadId: thread.id } }">Open</router-link>
					</span>
					<span class="hide">
						<a href="#" @click="hide" @click.prevent.stop>Hide</a>
					</span>
				</template>
			</div>

			<div class="post-file left" v-if="thread.files.length > 0">
				<a v-for="file in thread.files" :href="file.origin" target="_blank">
					<img :src="file.thumb" :alt="file.type">
					<span class="file-info">({{ file.resolution }}) {{ file.type }}</span>
				</a>
			</div>

			<div class="post-message" v-link-preview v-post-preview v-html="thread.message"></div>
		</div>
		<div class="thread-omitted" v-if="hasOmitted && !open">
			{{ getOmitted() }}
			<a href="#" @click="expand" @click.prevent.stop>Expand</a>
		</div>
		<div class="thread-replies" v-if="hasReplies">
			<slot />
		</div>
		<div class="clear"></div>
		<div class="thread-actions" v-if="open">
			<a href="#" class="btn" @click="refresh" @click.prevent.stop>Refresh thread</a>
		</div>
		<hr>
	</div>
	<div class="thread-box" v-else>
		<div class="post thread">
			<div class="post-hide">
				Thread /{{ thread.board }}/ <router-link :to="{ name: 'thread', params: { boardSlug: thread.board, threadId: thread.id }, hash: '#' + thread.id }" :id="thread.id">#{{ thread.id }}</router-link> <span v-if="thread.subject">«{{ thread.subject }}»</span> is hidden. <a href="#" @click="restore" @click.prevent.stop>Restore</a>
			</div>
		</div>
		<hr>
	</div>
</template>

<script>
	export default {
		name: 'thread',
		props: ['thread', 'open', 'replyLimit'],
		data() {
			return {
				isHidden: false
			}
		},
		created() {
			this.isHidden = (JSON.parse(localStorage.getItem('hidden.' + this.thread.board)) || []).indexOf(this.thread.id) != -1
			if (this.open == true) {
				this.$bus.on('thread:refresh', () => {
					this.refresh()
				})
				this.$bus.on('thread:expand', () => {
					this.expand()
				})
			}
		},
		methods: {
			hide() {
				this.isHidden = true
				this.makeHidden(true)
				
				this.$ga.event('Thread', 'Hide')
			},
			restore() {
				this.isHidden = false
				this.makeHidden(false)

				this.$ga.event('Thread', 'Restore')
			},
			expand() {
				let boardSlug = this.thread.board,
					threadId = this.thread.id

				this.$store.commit('SET_LOADING', true)
				this.$store.dispatch('EXPAND_BOARD_THREAD', [boardSlug, threadId])
				.then((replies_data) => {
					this.thread.count_replies = 0
					// Statis
					this.$store.commit('SET_LOADING', false)
				})
				.catch((error) => {
					console.log(error)
					// Status
					this.$store.commit('SET_LOADING', false)
				})

				this.$ga.event('Thread', 'Expand')
			},
			refresh() {
				let boardSlug = this.thread.board,
					threadId = this.thread.id,
					afterId = this.thread.replies.length > 0
							? this.thread.replies[this.thread.replies.length - 1].id
							: this.thread.id

				this.$store.commit('SET_LOADING', true)
				this.$store.dispatch('REFRESH_BOARD_THREAD', [boardSlug, threadId, afterId])
				.then((replies_data) => {
					if (replies_data.length > 0)
						console.log('Новых постов: ' + replies_data.length)
					else
						console.log('Нет новых постов!')
					// Status
					this.$store.commit('SET_LOADING', false)
				})
				.catch((error) => {
					console.log(error)
					// Status
					this.$store.commit('SET_LOADING', false)
				})

				this.$ga.event('Thread', 'Refresh')
			},

			getOmitted() {
				let count = this.thread.count_replies - this.replyLimit,
					cases = [2, 0, 1, 1, 1, 2],
					titles = ['reply', 'replies', 'replies']
				return count + ' ' + titles[ (count%100 > 4 && count%100 < 20) ? 2 : cases[Math.min(count%10, 5)] ] + ' omitted.'
			},
			makeHidden(value) {
				let list = JSON.parse(localStorage.getItem('hidden.' + this.thread.board)) || []
				if (value) {
					list.push(this.thread.id)
				} else {
					list = list.filter(e => e !== this.thread.id)
				}
				localStorage.setItem('hidden.' + this.thread.board, JSON.stringify(list))
			}
		},
		computed: {
			hasReplies() {
				return this.thread.replies.length > 0
			},
			hasOmitted() {
				return this.thread.count_replies > this.replyLimit
			}
		},
		beforeDestroy() {
			if (this.open == true) {
				// Отписались от эвентов
				this.$bus.off('thread:refresh')
				this.$bus.off('thread:expand')
			}
		}
	}
</script>