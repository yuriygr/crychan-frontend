import Vue from 'vue'
import VueAnalytics from 'vue-analytics'
import VueI18n from 'vue-i18n'
import VueLocalStorage from 'vue-localstorage'
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
//Vue.use(VueI18n)

// set locales
/*Object.keys(locales).forEach((lang) => {
	Vue.locale(lang, locales[lang])
})*/

// set localsotrage 
Vue.use(VueLocalStorage)

// o da!
Vue.directive('draggable', {
	bind (el, binding, vnode) {
		// Нода
		let vm = vnode.context

		var startX,
			startY,
			formX,
			formY,
			initialMouseX,
			initialMouseY

		// За что будем цепляться для переноса
		let elDraggOn = el.getElementsByClassName(binding.value.dragOn)[0] || el

		// Если я опустил мышку на элемент для переноса
		elDraggOn.addEventListener('mousedown', function(e) {

			// Рассчитываем текущее положение объекта переноса
			startX = el.offsetLeft
			startY = el.offsetTop
			
			// Рассчитываем ширину и высоту окна
			var cWi = document.body.clientWidth || document.documentElement.clientWidth
			var cHe = document.body.clientHeight || document.documentElement.clientHeight
			
			// Пиздец 1
			initialMouseX = e.clientX
			initialMouseY = e.clientY

			// Биндим эвенты
			document.addEventListener('mousemove', mousemove)
			document.addEventListener('mouseup', mouseup)
			return false
		})

		// При движении мышки
		function mousemove(e) {
			// Пиздец 2
			var dx = e.clientX - initialMouseX
			var dy = e.clientY - initialMouseY

			move_el(startX + dx, startY + dy)
			return false
		}

		// При убирании мышки удаляем эвенты
		function mouseup() {
			// Сохраняем конечно положение
			vm.$localStorage.set('form.pos.x', formX)
			vm.$localStorage.set('form.pos.y', formY)
			// И удаляем к хуям эвенты
			document.removeEventListener('mousemove', mousemove)
			document.removeEventListener('mouseup', mouseup)
		}
		// Двигаем форму
		function move_el(x, y) {
			// Задаём выбранному элементу 
			el.style.left = x + 'px'
			el.style.top = y + 'px'
			// Задаём конечные показатели
			formX = x
			formY = y
		}
	}
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