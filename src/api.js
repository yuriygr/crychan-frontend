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
	getItem(board_slug, current_page) {
		return instance.get('board.getItem', { params: { slug: board_slug, page: current_page }})
		.then((data) => {
			const {response} = JSON.parse(data.request.response)
			return response
		})
	},
	getThread(board_slug, thread_id) {
		return instance.get('board.getThread', { params: { slug: board_slug, id: thread_id }})
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
		return instance.get('pages.getItem', { params: { slug: page_slug }})
		.then((data) => {
			const {response} = JSON.parse(data.request.response)
			return response
		})
	}
}

const news = {
	getList(current_page) {
		return instance.get('news.getList', { params: { page: current_page }})
		.then((data) => {
			const {response} = JSON.parse(data.request.response)
			return response
		})
	},
	getItem(news_slug) {
		return instance.get('news.getItem', { params: { slug: news_slug }})
		.then((data) => {
			const {response} = JSON.parse(data.request.response)
			return response
		})
	}
}

export { board, pages, news }