<template>
	<section class="content">
		<div class="warp">
			<h1>{{ appName }}</h1>
			<p>{{ appName }} — это система форумов, где можно общаться быстро и свободно, где любая точка зрения имеет право на жизнь. Здесь нет регистрации и подписываться не нужно, хотя это не избавляет вас от необходимости соблюдать правила. Все форумы (кроме <router-link :to="{ name: 'board', params: { boardSlug: 'b' } }">/Б/реда</router-link>), а их список находится слева, имеют собственную чётко ограниченную тематику. Словом, всё, что не запрещено правилами отдельно взятого форума и относится к его тематике, на этом форуме разрешено.</p>
			<p>Все ваши идеи по поводу улучшения {{ appName }} и добавления новых форумов просьба излагать в специально отведённом месте — на форуме <router-link :to="{ name: 'board', params: { boardSlug: 'd' } }">/Д/искуссии</router-link>.</p>
		</div>
	</section>
</template>

<script>
	import { mapState } from 'vuex'

	export default {
		name: 'app-home',
		metaInfo() {
			return {
				title: this.appName
			}
		},
		computed: {
			...mapState([
				'appName',
			])
		}
	}
</script>