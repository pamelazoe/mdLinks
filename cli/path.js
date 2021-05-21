const fs = require("fs")
const path = require("path")

/**
 * Check if the path is a Directory
 * @param {string} inputPath - User unresolved path
 * @returns {boolean} - Returns true or false
 * @description Confirms or denies if a path is a directory.
 */
const isDir = (inputPath) => {
	return new Promise((resolve, reject) => {
		fs.stat(inputPath, (err, stats) => {
			return err ? reject(err) : resolve(stats.isDirectory())
	})
		})
}

/**
 * Check if the path is a File
 * @param {string} inputPath
 * @returns {boolean}
 */
const isFile = (inputPath) => {
	return new Promise((resolve, reject) => {
		fs.stat(inputPath, (err, stats) => {
			err ? reject(err) : resolve(stats.isFile())
		})
	})
}

/**
 * Check if the path is an .md File
 * @param {string} inputPath
 * @returns {boolean}
 */
const isMdFile = (inputPath) => path.extname(inputPath) === ".md"

const getFiles = (inputPath) => {
	return new Promise((resolve, reject) => {
		fs.readdir(inputPath, (err, files) => {
			const fullRoute = files.map((file) => path.resolve(inputPath, file))
			err ? reject(err) : resolve(fullRoute)
		})
	})
}
/**
 * Get all .md files in a directory, resolve their paths and puts them into an array
 * @param {string} inputPath
 * @returns {Array}
 */
const getMdFilesFromDir = async (inputPath) => {
	const getAllFiles = await getFiles(inputPath)
	const filterFiles = await getAllFiles.filter((file) => isMdFile(file))
	const setFiles = filterFiles.map((file) => path.resolve(__dirname, file))
	return setFiles
}

// exports.checkPathExists = checkPathExists
exports.isDir = isDir
exports.isFile = isFile
exports.isMdFile = isMdFile
// exports.getFiles = getFiles
exports.getMdFilesFromDir = getMdFilesFromDir
// exports.addPath = addPath

// checkFiles("__tests__/__mocks__/md")
// 	.then((data) => console.log(data))
// 	.catch((err) => console.log(err))
// getFiles(
// 	"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md",
// )
// 	.then((data) => console.log(data))
// 	.catch((err) => console.log(err))
// filterFiles("__tests__/__mocks__/md")
// 	.then((data) => console.log(data))
// 	.catch((err) => console.log(err))
// getMdFilesFromDir(
// 	"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md",
// )
// 	.then((data) => console.log(data))
// 	.catch((err) => console.log(err))
// console.log(isMdFile("hello.md"))
// isDir("__tests__/__mocks__/md")
// 	.then((data) => console.log(data))
// 	.catch((err) => console.log(err))
// checkPathExists("./__tests__/__mocks__/md/README2.md")
// 	.then((data) => console.log(data))
// 	.catch((err) => console.log(err))
// checkPathExists("./__tests__/__mocks__/md/fake.md")
// 	.then((data) => console.log(data))
// 	.catch((err) => console.log(err))

// const isDir = async (inputPath) => {
// 	return fs.stat(inputPath, (err, stats) => {
// 		return err ? console.log(err) : console.log(stats.isDirectory())
// 	})
// }
// const isFile = async (inputPath) => {
// 	return fs.stat(inputPath, (err, stats) => {
// 		return err ? console.log(err) : console.log(stats.isFile())
// 	})
// }

