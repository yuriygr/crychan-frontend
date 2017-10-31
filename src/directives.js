function DraggbleForm(el, binding, vnode) {
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

const LinkPreview = {
	bind(el, binding, vnode) {
		let siteNames = ['www.youtube.com', 't.me', 'vk.com', 'i.imgur.com', 'meduza.io']
		let links = el.getElementsByTagName('a'),
			timer_ms = 100

		for (let j = 0; j < links.length; j++) {
			let link = links[j],
				host = link.host,
				normal = siteNames.indexOf(host) > -1

			// Если не подходит для обработки, то возвращаемся
			if (!normal) return
		}
	}
}

/**
 * Превью ссылок с атрибутом
 * Нагло украл у Абу
 */
const PostPreview = {
	bind(el, binding, vnode) {
		let links = el.querySelectorAll('a[data-post-preview]'),
			timers = {},
			timer_ms = 60

		const clearTimer = (num) => {
			if (timers.hasOwnProperty(num)) {
				clearTimeout(timers[num])
				delete timers[num]
			}
		}

		for (let j = 0; j < links.length; j++) {
			let link = links[j],
				data = links[j].getAttribute('data-post-preview').split('|'),
				params = {
					board_slug: data[0],
					thread_id: data[1],
					post_id: data[2]
				}
			link.addEventListener('mouseover', (e) => {
				let type = 'mouseover'
				timers[params.post_id] = setTimeout(() => {
					clearTimer(params.post_id)
					vnode.context.$bus.emit('thread:preview', { e, type, params })
				}, timer_ms)
			})
			link.addEventListener('mouseout', (e) => {
				let type = 'mouseout'
				clearTimer(params.post_id)
				vnode.context.$bus.emit('thread:preview', { e, type, params })
			})
		}
	}
}

export { DraggbleForm, LinkPreview, PostPreview }