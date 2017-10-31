import Vue from 'vue'
import VueAnalytics from 'vue-analytics'
import VueLazyload from 'vue-lazyload'
import VueBus from 'vue-bus';
import Meta from 'vue-meta'
import { sync } from 'vuex-router-sync'

import App from './components/App'

import router from './router'
import store from './store'
import * as filters from './filters'
import * as directives from './directives'

// some styles
import 'reset-css/reset.css'
import 'assets/style.css'

const id = 'UA-56787403-5' 
Vue.use(VueAnalytics, { id, router })
Vue.use(VueLazyload)
Vue.use(VueBus)
Vue.use(Meta)

// register global utility filters
Object.keys(filters).forEach((key) => {
	Vue.filter(key, filters[key])
})

// load apps directives
Object.keys(directives).forEach((key) => {
	Vue.directive(key, directives[key])
})

// sync the router with the vuex store.
// this registers `store.state.route`
sync(store, router)

// create the app instance.
// here we inject the router and store to all child components,
// making them available everywhere as `this.$router` and `this.$store`.
const app = new Vue({
	router,
	store,
	...App
})

// expose the app, the router and the store.
// note we are not mounting the app here, since bootstrapping will be
// different depending on whether we are in a browser or on the server.
export { app, router, store }