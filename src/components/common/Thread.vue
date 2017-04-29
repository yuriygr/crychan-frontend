<template>
	<div class="thread-box">
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
						<a @click="hide" @click.prevent.stop href="#">Hide</a>
					</span>
				</template>
			</div>

			<div class="post-file left" v-if="thread.files.length > 0">
				<a v-for="file in thread.files" :href="file.origin" target="_blank">
					<img :src="file.thumb">
					<span class="file-info">({{ file.resolution }}) {{ file.type }}</span>
				</a>
			</div>

			<div class="post-message" v-html="thread.message"></div>
		</div>
		<div class="omitted" v-if="hasOmitted && !open">
			{{ getOmitted() }}
			<a @click="expand" @click.prevent.stop href="#">Expand</a>
		</div>
		<div class="thread-replies" v-if="hasReplies">
			<transition-group name="list">
				<slot></slot>
			</transition-group>
		</div>
		<hr>
	</div>
</template>

<script>
	export default {
		name: 'thread',
		props: ['thread', 'open', 'replyLimit'],
		methods: {
			hide() {
				this.$ga.trackEvent('Thread', 'Hide')
			},
			expand() {
				this.$ga.trackEvent('Thread', 'Expand')
			},
			getOmitted() {
				let count = this.thread.count_replies - this.replyLimit
				let cases = [2, 0, 1, 1, 1, 2];
				let titles = ['reply', 'replies', 'replies'];
				return count + ' ' + titles[ (count%100 > 4 && count%100 < 20) ? 2 : cases[Math.min(count%10, 5)] ] + ' omitted.';
			},
		},
		computed: {
			hasReplies() {
				return this.thread.replies.length > 0
			},
			hasOmitted() {
				return this.thread.count_replies > this.replyLimit
			}
		}
	}
</script>
<style>
.list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active, .list-leave-active {
  transition: all .5s;
}
.list-enter, .list-leave-to /* .list-leave-active for <2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
</style>