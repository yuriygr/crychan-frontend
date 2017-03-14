import axios from 'axios'

const api = 'https://api.crychan.com/'

const instance = axios.create({
	baseURL: api,
});

const board = {
	getList() {
		return instance.get('board.getList')
		.then((data) => {
			const {response} = JSON.parse(data.request.response)
			return response
		})
	},
	getItem(board_slug) {
		return instance.get('board.getItem', { params: { board_slug: board_slug }})
		.then((data) => {
			const {response} = JSON.parse(data.request.response)
			return response
		})
	},
	getThreads(board_slug, page) {
		return instance.get('board.getThreads', { params: { board_slug: board_slug, page: page }})
		.then((data) => {
			const {response} = JSON.parse(data.request.response)
			return response
		})
	},
	getThread(board_slug, thread_id) {
		return instance.get('board.getThread', { params: { board_slug: board_slug, thread_id: thread_id }})
		.then((data) => {
			const {response} = JSON.parse(data.request.response)
			return response
		})
	},
	refreshThread(board_slug, thread_id, after) {
		return instance.get('board.refreshThread', { params: { board_slug: board_slug, thread_id: thread_id, after: after }})
		.then((data) => {
			const {response} = JSON.parse(data.request.response)
			return response
		})
	}
}

const pages = {
	getList() {
		return instance.get('pages.getList')
		.then((data) => {
			const {response} = JSON.parse(data.request.response)
			return response
		})
	},
	getItem(page_slug) {
		return instance.get('pages.getItem', { params: { page_slug: page_slug }})
		.then((data) => {
			const {response} = JSON.parse(data.request.response)
			return response
		})
	}
}

const news = {
	getList(page) {
		return instance.get('news.getList', { params: { page: page }})
		.then((data) => {
			const {response} = JSON.parse(data.request.response)
			return response
		})
	},
	getItem(news_slug) {
		return instance.get('news.getItem', { params: { news_slug: news_slug }})
		.then((data) => {
			const {response} = JSON.parse(data.request.response)
			return response
		})
	}
}

export { board, pages, news }