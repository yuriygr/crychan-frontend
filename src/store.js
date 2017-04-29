import Vue from 'vue'
import Vuex from 'vuex'

import * as api from './api'

Vue.use(Vuex)

const state = {
	name: 'cryChan',

	boardActive: false,
	boardsList: {},

	threadsList: false,
	threadActive: false,

	pageActive: false,

	newsList: false,
	newsActive: false
}

const mutations = {
	// Работа с разделами
	SET_BOARDS_LIST (state, payload) {
		payload.boards_data.forEach((board) => {
			Vue.set(state.boardsList, board.slug, board)
		})
	},
	SET_BOARD_ACTIVE (state, payload) {
		state.boardActive = payload.board_data
	},
	REMOVE_BOARD_ACTIVE (state) {
		state.boardActive = false
	},

	// Работа с тредами
	SET_THREADS_LIST (state, payload) {
		state.threadsList = payload.threads_data
	},
	REMOVE_THREADS_LIST (state) {
		state.threadsList = false
	},
	SET_THREAD_ACTIVE (state, payload) {
		state.threadActive = payload.thread_data
	},
	REMOVE_THREAD_ACTIVE (state) {
		state.threadActive = false
	},

	REFRESH_THREAD_ACTIVE (state, payload) {
		state.threadActive.replies.push(...payload.replies_data)
	},

	// Заполняем текущую страницу
	SET_PAGE_ACTIVE (state, payload) {
		state.pageActive = payload.page_data
	},
	REMOVE_PAGE_ACTIVE (state) {
		state.pageActive = false
	},

	// Заполняем список новостей
	SET_NEWS_LIST (state, payload) {
		state.newsList = payload.news_list
	},
	REMOVE_NEWS_LIST (state) {
		state.newsList = false
	},
	// Задаём текущую новость
	SET_NEWS_ACTIVE (state, payload) {
		state.newsActive = payload.news_data
	},
	REMOVE_NEWS_ACTIVE (state) {
		state.newsActive = false
	}
}

const actions = {
	// Работа с разделами
	FETCH_BOARDS_LIST ({ commit }) {
		return api.boards.list()
		.then((boards_data) => {
			commit('SET_BOARDS_LIST', { boards_data })
			return boards_data
		})
	},
	SET_BOARD_ACTIVE ({ commit }, board_slug) {
		return api.boards.item({ board_slug })
		.then((board_data) => {
			commit('SET_BOARD_ACTIVE', { board_data })
			return board_data
		})
	},

	// Работа с тредами
	FETCH_BOARD_THREADS ({ commit }, [board_slug, page]) {
		return api.threads.list({ board_slug, page })
		.then((threads_data) => {
			commit('SET_THREADS_LIST', { threads_data })
			return threads_data
		})
	},
	FETCH_BOARD_THREAD ({ commit }, [board_slug, thread_id]) {
		return api.threads.item({ board_slug, thread_id })
		.then((thread_data) => {
			commit('SET_THREAD_ACTIVE', { thread_data })
			return thread_data
		})
	},

	REFRESH_BOARD_THREAD ({ commit }, [board_slug, thread_id, after_id]) {
		return api.threads.refresh({ board_slug, thread_id, after_id })
		.then((replies_data) => {
			commit('REFRESH_THREAD_ACTIVE', { replies_data })
			return replies_data
		})
	},

	// Заполняем текущую страницу в массив
	FETCH_PAGE ({ commit }, page_slug) {
		return api.pages.item({ page_slug })
		.then((page_data) => {
			commit('SET_PAGE_ACTIVE', { page_data })
		})
	},

	// NEWS
	FETCH_NEWS_LIST ({ commit }, page) {
		return api.news.list({ page })
		.then((news_list) => {
			commit('SET_NEWS_LIST', { news_list })
		})
	},
	FETCH_NEWS ({ commit }, news_slug) {
		return api.news.item({ news_slug })
		.then((news_data) => {
			commit('SET_NEWS_ACTIVE', { news_data })
		})
	}
}

const getters = {
	boardActive (state) {
	const { boardActive, boardsList } = state
		if (boardActive) {
			return boardsList[boardActive]
		} else {
			return []
		}
	}
}

const store = new Vuex.Store({
	state,
	mutations,
	actions,
	getters
})

export default store