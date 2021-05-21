const classify = async (res) => {
	const result = await res.reduce((r, a) => {
		// console.log(a)
		r[a.statusText] = r[a.statusText] || []
		r[a.statusText].push(a)
		return r
	}, {})
	return result
}

const results = [
	{
		href: "https://github.com/jevy",
		text: "jlevy",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 3,
		status: 200,
		statusText: "OK",
	},
	{
		href: "https://www.holloway.com",
		text: "Holloway",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 3,
		status: 200,
		statusText: "OK",
	},
	{
		href: "https://airtable.com/shrzMhx00YiIVAWJg000",
		text: "**Please submit a question**",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 12,
		status: 404,
		statusText: "Not Found",
	},
]

const getResults = (object) => Object.entries(object)

classify(results)
	.then((data) => {
		// data.map((e) => e.length)
		console.log(data["OK"])
	})
	.catch((err) => console.log(err))

const total = async (arr) => {
	const links = await classify(arr)
	const res = await getResults(links)
	return res
}
// total(results)
// 	.then((data) => console.log(data[0]))
// 	.catch((err) => console.log(err))
