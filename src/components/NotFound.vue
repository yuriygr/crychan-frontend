<template>
	<section class="content">
		<div class="warp">
			<h1 v-html="pageTitle"></h1>
			<hr>
			<p>The requested page can not be displayed because of the lack thereof</p>
			<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vero sit, quisquam beatae nulla numquam vel totam, animi aliquam, similique illum ex quasi cum esse optio, vitae sint. Nam soluta, asperiores, eveniet ratione atque vero quis possimus ipsa hic quibusdam reprehenderit ab obcaecati? <b>Хули</b> nisi, ipsa illo doloremque modi explicabo eum, rerum hic dolor alias iste itaque voluptatem ullam autem maxime temporibus ratione vitae fugit beatae similique. Necessitatibus tenetur, adipisci in fugiat, quasi amet! In aperiam, sed ipsum ut veniam sunt rem assumenda velit deserunt eligendi ex, accusantium nisi dolore et aliquid doloribus culpa eum aut est quibusdam nihil vero. Voluptatum magni, explicabo <b>ты</b>? Voluptates nulla dicta officia maiores corporis, aperiam quas minus perferendis, sed totam quasi cum dolore voluptatem adipisci. <b>тут</b> saepe, quidem perferendis esse id assumenda qui omnis quae iure doloremque, quod similique architecto laborum quo ipsam dolorem amet veniam libero excepturi. Nulla modi earum praesentium consequatur natus vero non neque ea dicta obcaecati, quo voluptatibus, doloribus <b>ищешь</b> ab quam itaque velit recusandae aut facere. Reiciendis odit beatae veritatis necessitatibus quasi aut, cum neque quos, laborum numquam corrupti dicta fugit sit quaerat quae quod quo rem obcaecati rerum tempora facilis eum. Vitae dolor, odit aut omnis soluta animi ducimus!</p>
		</div>
	</section>
</template>

<script>
	export default {
		name: 'not-found',
		data() {
			return {
				pageTitle: 'Not found'
			}
		},
		metaInfo() {
			return {
				title: this.pageTitle
			}
		}
	}
</script>