export function timeFormat(timestamp){
	const a = new Date(timestamp * 1000);
	const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	const year = a.getFullYear();
	const month = months[a.getMonth()];
	const date = a.getDate();
	const hour = a.getHours() < 10 ? '0' + a.getHours() : a.getHours();
	const min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
	const time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min;
	return time;
}