import Vue from 'vue'
import VueAnalytics from 'vue-analytics'
import VueI18n from 'vue-i18n'
import Meta from 'vue-meta'
import { sync } from 'vuex-router-sync'

import App from './components/App'

import router from './router'
import store from './store'
import * as locales from './locales'
import * as filters from './filters'

// some styles
import 'reset-css/reset.css'
import 'assets/style.css'

// use Google Analytcs tracking 
const id = 'UA-56787403-2' 
Vue.use(VueAnalytics, { id, router })

// use VueMeta
Vue.use(Meta)

// register global utility filters.
Object.keys(filters).forEach((key) => {
	Vue.filter(key, filters[key])
})

// use locales
Vue.use(VueI18n)

// set locales
Object.keys(locales).forEach((lang) => {
	Vue.locale(lang, locales[lang])
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