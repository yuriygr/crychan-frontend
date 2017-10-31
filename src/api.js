import axios from 'axios'

const instance = axios.create({
	baseURL: 'https://api.crychan.com/',
	headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
	}
})

const boards = {
	list() {
		return instance.get('boards.list')
		.then((data) => {
			const {response} = JSON.parse(data.request.response)
			return response
		})
	},
	item(params) {
		return instance.get('boards.item', { params })
		.then((data) => {
			const {response} = JSON.parse(data.request.response)
			return response
		})
	}
}

const threads = {
	list(params) {
		return instance.get('threads.list', { params })
		.then((data) => {
			const {response} = JSON.parse(data.request.response)
			return response
		})
	},
	item(params) {
		return instance.get('threads.item', { params })
		.then((data) => {
			const {response} = JSON.parse(data.request.response)
			return response
		})
	},
	stream(params) {
		return instance.get('threads.stream', { params })
		.then((data) => {
			const {response} = JSON.parse(data.request.response)
			return response
		})
	},
	refresh(params) {
		return instance.get('threads.refresh', { params })
		.then((data) => {
			const {response} = JSON.parse(data.request.response)
			return response
		})
	},
	expand(params) {
		return instance.get('threads.expand', { params })
		.then((data) => {
			const {response} = JSON.parse(data.request.response)
			return response
		})
	},
	add(formData) {
		let config = { headers: { 'Content-Type': 'multipart/form-data' } }
		return instance.post('threads.add', formData, config)
		.then((data) => {
			const {response} = JSON.parse(data.request.response)
			return response
		})
	},
	post(params) {
		return instance.get('threads.post', { params })
		.then((data) => {
			const {response} = JSON.parse(data.request.response)
			return response
		})
	}
}

const pages = {
	list() {
		return instance.get('pages.list')
		.then((data) => {
			const {response} = JSON.parse(data.request.response)
			return response
		})
	},
	item(params) {
		return instance.get('pages.item', { params })
		.then((data) => {
			const {response} = JSON.parse(data.request.response)
			return response
		})
	}
}

const news = {
	list(params) {
		return instance.get('news.list', { params })
		.then((data) => {
			const {response} = JSON.parse(data.request.response)
			return response
		})
	},
	item(params) {
		return instance.get('news.item', { params })
		.then((data) => {
			const {response} = JSON.parse(data.request.response)
			return response
		})
	}
}

export { boards, threads, pages, news }