import Vue from 'vue'
import NProgress from 'vue-nprogress'

Vue.use(NProgress)

const nprogress = new NProgress({
	parent: '.nprogress-container'
})

export default nprogress