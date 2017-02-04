import Vue from 'vue'
import VueRouter from 'vue-router'

import Board from './components/Board'
import Home from './components/Home'
import News from './components/News'
import NotFound from './components/NotFound'
import Page from './components/Page'

Vue.use(VueRouter)

const routes = [
	{ path: '/', name: 'home', component: Home },
	{ path: '/page/:pageSlug', name: 'page', component: Page },
	{ path: '/news/', name: 'news', component: News , children: [
		{ path: ':newsSlug', name: 'news-item', component: News },
	]},
	{ path: '/:boardSlug/', name: 'board', component: Board, children: [
		{ path: 'thread/:threadId', name: 'thread', component: Board },
	]},
	{ path: '/not-found', name: 'not-found', component: NotFound },
	{ path: '*', redirect: 'not-found' }
]

const router = new VueRouter({
	routes,
	mode: 'history',
	scrollBehavior: () => ({ y: 0 })
})

export default router