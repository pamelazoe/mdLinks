const fs = require("fs")
const readline = require("readline")

// const regex = /\[(.*?)\]\((.+?)\)/gim
const regex = /(?:^|)\[([^!].*?)\]\((.+?)\)/gim

let lineCount = 0
let resultNr = 0

const readFile = (path) => {
	const rl = readline.createInterface({
		input: fs.createReadStream(path),
		crlfDelay: Infinity,
	})
	return new Promise((resolve, _reject) => {
		const lines = []
		rl.on("line", (line) => {
			++lineCount
			const matches = [...line.matchAll(regex)]
			const appendLineNr = matches.map((el) => [...el, lineCount])
			lines.push(appendLineNr)
		})

		rl.on("close", () => {
			const results = lines.flat()
			const print = results.map((x) => {
				const obj = {
					resultNumber: (resultNr += 1),
					href: x[2],
					text: x[1],
					file: path,
					lineNumber: x[3],
				}
				return obj
			})
			// 			!results.length
			// 				? reject(`There are no matches in this file:
			// ${path}`)
			// 				: resolve(print)
			resolve(print)
		})
	})
}

exports.readFile = readFile
// readFile("/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md")
// 	.then((data) => console.log(data))
// 	.catch((err) => console.log(err))
