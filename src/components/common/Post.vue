<template>
	<div class="post-box">
		<div class="post" :id="post.id">
			<div class="post-info">
				<span class="nyan nyan-sage" title="Sage" v-if="post.isSage"></span>
				<span class="subject" v-if="post.subject">{{ post.subject }}</span>
				<span class="name">{{ post.name }}</span>
				<span class="time">{{ post.time }}</span>
				<span class="link">
					<router-link :to="{ name: 'thread', params: { boardSlug: post.board, threadId: post.parent } }">#{{ post.id }}</router-link>
				</span>
			</div>
			<div class="post-text" v-html="post.text"></div>
		</div>
		<div class="clear"></div>
	</div>
</template>

<script>
	export default {
		name: 'post',
		props: ['post'],
	}
</script>