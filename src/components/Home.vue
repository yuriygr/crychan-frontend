<template>
	<section class="index">
		<div class="warp">
			<h1 class="index-logo" :data-text="name">{{ name }}</h1>
			<p class="index-info">{{ slogan }}</p>
		</div>
	</section>
</template>

<script>
	import { mapState } from 'vuex'

	export default {
		name: 'app-home',
		metaInfo() {
			return {
				title: this.name
			}
		},
		computed: {
			...mapState([
				'name',
			]),
			slogan() {
				let slogans = ['Fuck JavaScript', 'Это тебе не Двач', 'I, cry, when angels deserve to die']
				return slogans[Math.floor(Math.random() * slogans.length)]
			}
		}
	}
</script>

<style>
.index {
	text-align: center;
	display: flex;
	align-items: center;
	justify-content: center;
}
.index-logo {
	color: #37474F;
	font-size: 106px;
	font-weight: 300;
	position: relative;
	width: 400px;
	margin: 0 auto;
	-webkit-user-select: none;
	cursor: default;
}
.index-logo:after {
	content: attr(data-text);
	position: absolute;
	left: 2px;
	text-shadow: -1px 0 red;
	top: 0;
	color: #37474F;
	background: #f1f1f1;
	overflow: hidden;
	clip: rect(0, 900px, 0, 0);
	animation: noise-anim 2s infinite linear alternate-reverse;
}
.index-logo:before {
	content: attr(data-text);
	position: absolute;
	left: -2px;
	text-shadow: 1px 0 blue;
	top: 0;
	color: #37474F;
	background: #f1f1f1;
	overflow: hidden;
	clip: rect(0, 900px, 0, 0);
	animation: noise-anim-2 3s infinite linear alternate-reverse;
}
.index-info {
	font-size: 30px;
	font-weight: 300;
	-webkit-user-select: none;
	cursor: default;
}
@keyframes noise-anim-2 {
	0%   { clip: rect(93px, 9999px, 20px, 0); }
	5%   { clip: rect(79px, 9999px, 54px, 0); }
	10%  { clip: rect(48px, 9999px, 94px, 0); }
	15%  { clip: rect(82px, 9999px, 6px, 0);  }
	20%  { clip: rect(53px, 9999px, 79px, 0); }
	25%  { clip: rect(97px, 9999px, 40px, 0); }
	30%  { clip: rect(70px, 9999px, 42px, 0); }
	35%  { clip: rect(61px, 9999px, 70px, 0); }
	40%  { clip: rect(29px, 9999px, 77px, 0); }
	45%  { clip: rect(37px, 9999px, 83px, 0); }
	50%  { clip: rect(96px, 9999px, 95px, 0); }
	55%  { clip: rect(65px, 9999px, 30px, 0); }
	60%  { clip: rect(39px, 9999px, 23px, 0); }
	65%  { clip: rect(63px, 9999px, 34px, 0); }
	70%  { clip: rect(39px, 9999px, 12px, 0); }
	75%  { clip: rect(81px, 9999px, 79px, 0); }
	80%  { clip: rect(11px, 9999px, 39px, 0); }
	85%  { clip: rect(77px, 9999px, 48px, 0); }
	90%  { clip: rect(39px, 9999px, 54px, 0); }
	95%  { clip: rect(31px, 9999px, 98px, 0); }
	100% { clip: rect(10px, 9999px, 5px, 0); }
}
@keyframes noise-anim {
	0%   { clip: rect(94px, 9999px, 96px, 0); }
	5%   { clip: rect(38px, 9999px, 62px, 0); }
	10%  { clip: rect(73px, 9999px, 98px, 0); }
	15%  { clip: rect(27px, 9999px, 79px, 0); }
	20%  { clip: rect(100px, 9999px, 49px, 0); }
	25%  { clip: rect(76px, 9999px, 23px, 0); }
	30%  { clip: rect(14px, 9999px, 2px, 0); }
	35%  { clip: rect(36px, 9999px, 21px, 0); }
	40%  { clip: rect(43px, 9999px, 81px, 0); }
	45%  { clip: rect(67px, 9999px, 15px, 0); }
	50%  { clip: rect(25px, 9999px, 56px, 0); }
	55%  { clip: rect(40px, 9999px, 86px, 0); }
	60%  { clip: rect(74px, 9999px, 37px, 0); }
	65%  { clip: rect(41px, 9999px, 76px, 0); }
	70%  { clip: rect(8px, 9999px, 46px, 0);  }
	75%  { clip: rect(96px, 9999px, 5px, 0);  }
	80%  { clip: rect(69px, 9999px, 62px, 0); }
	85%  { clip: rect(88px, 9999px, 30px, 0); }
	90%  { clip: rect(49px, 9999px, 64px, 0); }
	95%  { clip: rect(13px, 9999px, 63px, 0); }
	100% { clip: rect(32px, 9999px, 76px, 0); }
}
</style>