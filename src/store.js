import Vue from 'vue'
import Vuex from 'vuex'

import * as api from 'create-api'

Vue.use(Vuex)

const state = {
	name: 'cryChan',
	loading: false,

	boardActive: false,
	boardsList: {},

	threadsList: false,
	threadActive: false,
	threadsStream: false,

	pageActive: false,

	newsList: false,
	newsActive: false
}

const mutations = {
	/**
	 * App
	 */
	SET_LOADING (state, payload) {
		state.loading = payload
	},
	/**
	 * Board
	 */
	// Заполнение списка разделов
	SET_BOARDS_LIST (state, payload) {
		payload.boards_data.forEach((board) => {
			Vue.set(state.boardsList, board.slug, board)
		})
	},
	// Заполнение раздела и отчистка
	SET_BOARD_ACTIVE (state, payload) {
		state.boardActive = payload.board_data
	},
	REMOVE_BOARD_ACTIVE (state) {
		state.boardActive = false
	},

	/**
	 * Thread
	 */
	// Заполнение списка тредов и отчистка
	SET_THREADS_LIST (state, payload) {
		state.threadsList = payload.threads_data
	},
	REMOVE_THREADS_LIST (state) {
		state.threadsList = false
	},
	// Заполнение активного треда и отчистка
	SET_THREAD_ACTIVE (state, payload) {
		state.threadActive = payload.thread_data
	},
	REMOVE_THREAD_ACTIVE (state) {
		state.threadActive = false
	},
	// Заполнение потока и отчистка
	SET_THREADS_STREAM (state, payload) {
		state.threadsStream = payload.threads_data
	},
	REMOVE_THREADS_STREAM (state) {
		state._THREAD_STREAM = false
	},
	// Обновление треда
	REFRESH_THREAD_ACTIVE (state, payload) {
		state.threadActive.replies.push(...payload.replies_data)
	},
	// Разворот треда
	EXPAND_THREAD_ACTIVE (state, payload) {
		state.threadsList.items.forEach((thread) => {
			if (thread.id == payload.thread_id)
				thread.replies = payload.replies_data
		})
	},

	/**
	 * Page
	 */
	// Заполняем текущую страницу и отчистка
	SET_PAGE_ACTIVE (state, payload) {
		state.pageActive = payload.page_data
	},
	REMOVE_PAGE_ACTIVE (state) {
		state.pageActive = false
	},

	/**
	 * News
	 */
	// Заполняем список новостей и отчистка
	SET_NEWS_LIST (state, payload) {
		state.newsList = payload.news_list
	},
	REMOVE_NEWS_LIST (state) {
		state.newsList = false
	},
	// Заполняем текущую новость и отчистка
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
	FETCH_BOARD_THREADS_STREAM ({ commit }) {
		return api.threads.stream()
		.then((threads_data) => {
			commit('SET_THREADS_STREAM', { threads_data })
			return threads_data
		})
	},

	REFRESH_BOARD_THREAD ({ commit }, [board_slug, thread_id, after_id]) {
		return api.threads.refresh({ board_slug, thread_id, after_id })
		.then((replies_data) => {
			commit('REFRESH_THREAD_ACTIVE', { replies_data })
			return replies_data
		})
	},

	EXPAND_BOARD_THREAD ({ commit }, [board_slug, thread_id]) {
		return api.threads.expand({ board_slug, thread_id })
		.then((replies_data) => {
			commit('EXPAND_THREAD_ACTIVE', { replies_data, thread_id })
			return replies_data
		})
	},

	// Send post
	SEND_POST_DATA ({ commit }, params) {
		return api.threads.add(params)
		.then((data) => {
			return data
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

const store = new Vuex.Store({
	state,
	mutations,
	actions
})

export default store