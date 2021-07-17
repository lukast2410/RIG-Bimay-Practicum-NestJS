export const listShift = [
	{ id: 1, Name: '07:20 - 09:00' },
	{ id: 2, Name: '09:20 - 11:00' },
	{ id: 3, Name: '11:20 - 13:00' },
	{ id: 4, Name: '13:20 - 15:00' },
	{ id: 5, Name: '15:20 - 17:00' },
	{ id: 6, Name: '17:20 - 19:00' },
	{ id: 7, Name: '19:20 - 21:00' },
	{ id: 8, Name: '21:20 - 23:00' },
]

export const formatDate = (date) => {
	// let monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	let monthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	]

	let day = date.getDate()

	let monthIndex = date.getMonth()
	let monthName = monthNames[monthIndex]

	let year = date.getFullYear()

	return `${day} ${monthName} ${year}`
}