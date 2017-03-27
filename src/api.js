import axios from 'axios'

const api = 'https://api.crychan.com/'

const instance = axios.create({
	baseURL: api,
});

const boards = {
	getList() {
		return instance.get('boards.getList')
		.then((data) => {
			const {response} = JSON.parse(data.request.response)
			return response
		})
	},
	getItem(board_slug) {
		return instance.get('boards.getItem', { params: { board_slug: board_slug }})
		.then((data) => {
			const {response} = JSON.parse(data.request.response)
			return response
		})
	}
}

const threads = {	
	getList(board_slug, page) {
		return instance.get('threads.getList', { params: { board_slug: board_slug, page: page }})
		.then((data) => {
			const {response} = JSON.parse(data.request.response)
			return response
		})
	},
	getItem(board_slug, thread_id) {
		return instance.get('threads.getItem', { params: { board_slug: board_slug, thread_id: thread_id }})
		.then((data) => {
			const {response} = JSON.parse(data.request.response)
			return response
		})
	},
	refresh(board_slug, thread_id, after) {
		return instance.get('threads.refresh', { params: { board_slug: board_slug, thread_id: thread_id, after: after }})
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

export { boards, threads, pages, news }