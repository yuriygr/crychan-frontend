<template>
	<div class="thread-box">
		<div class="post thread">
			<div class="post-info">
				<span class="nyan nyan-locked" title="Locked" v-if="thread.isLocked"></span>
				<span class="nyan nyan-sticky" title="Sticky" v-if="thread.isSticky"></span>
				<span class="subject" v-if="thread.subject">{{ thread.subject }}</span>
				<span class="name">{{ thread.name }}</span>
				<span class="time">{{ thread.time }}</span>
				<span class="link">{{ thread.id }}</span>
				<span class="open">
					<router-link :to="{ name: 'thread', params: { boardSlug: thread.board, threadId: thread.id } }">[Open]</router-link>
				</span>
			</div>
			<div class="post-text" v-html="thread.text"></div>
		</div>
		<div class="omitted" v-if="hasOmitted()">
			{{ getOmitted() }}
			<a href="#">Expand</a>
		</div>
		<div class="clear"></div>
		<div class="post-replys" v-if="thread.replys.length > 0">
			<slot></slot>
		</div>
		<hr>
	</div>
</template>

<script>
	export default {
		name: 'thread',
		props: ['thread'],
		methods: {
			hasOmitted() {
				return this.thread.count_replys > 3
			},
			getOmitted() {
				let count = this.thread.count_replys - 3
				let cases = [2, 0, 1, 1, 1, 2];
				let titles = ['reply', 'replies', 'replies'];
				return count + ' ' + titles[ (count%100 > 4 && count%100 < 20) ? 2 : cases[Math.min(count%10, 5)] ] + ' omitted.';
			}
		}
	}
</script>