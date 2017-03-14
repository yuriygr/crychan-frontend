<template>
	<div class="post-box">
		<div class="post" :id="post.id">
			<div class="post-info">
				<span class="sage" v-if="post.isSage">Sage</span>
				<span class="subject" v-if="post.subject">{{ post.subject }}</span>
				<span class="name">{{ post.name }}</span>
				<span class="time">{{ post.timestamp | timeFormat }}</span>
				<span class="link">
					<router-link :to="{ name: 'thread', params: { boardSlug: post.board, threadId: post.parent }, hash: '#' + post.id }">#{{ post.id }}</router-link>
				</span>
			</div>

			<div class="post-file left" v-if="post.files.length > 0">
				<a v-for="file in post.files" :href="file.origin" target="_blank">
					<img :src="file.thumb">
					<span class="file-info">({{ file.resolution }}) {{ file.type }}</span>
				</a>
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