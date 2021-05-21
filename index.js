#!/usr/bin/env node
const {
	checkPathExists,
	validateOptions,
	extractLinks,
	checkValidate,
} = require("./solvers")

const mdLinks = async (path, args) => {
	if(!path){
		console.log("You need to provide a valid path");
		process.exit()
	}
	const validatePath = await checkPathExists(__dirname, path)
	const validateFlags = await validateOptions(validatePath, args)
	const returnLinks = await extractLinks(validateFlags)
	const checkingValidation = await checkValidate(returnLinks)
	return checkingValidation
}

mdLinks(process.argv[2], process.argv.slice(3))
	.then((data) => {
		// console.log(data)
		const [a, b] = data
		// const [c, d] = b
		// console.log(a)
		console.dir(b, { depth: null })
		// console.log(d)
	})
	.catch((err) => console.log(err))

// mdLinks(process.argv[2], process.argv.slice(3))
// 	.then((data) => {
// 		console.log(data)
// 	})
// 	.catch((e

// const {stat} = require("fs")

// const pathsToCheck = [process.argv[2]];

// for (let i = 0; i < pathsToCheck.length; i++) {
//   stat(pathsToCheck[i], (err, stats) => {
//     console.log(stats.isDirectory());
//   });
// }

// const fs = require("fs")

// const isDir = (inputPath) => {
// 	return new Promise((resolve, reject) => {
// 		fs.stat(inputPath, (err, stats) => {
// 			return err ? reject(err) : resolve(stats.isDirectory())
// 	})
// 		})

// }

// isDir(process.argv[2]).then(data => console.log(data)).catch(err => console.log(err))