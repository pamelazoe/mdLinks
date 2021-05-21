const { setFlagsToFalse } = require("../cli/flags")
const path = require("path")
const { isFile, getMdFilesFromDir, isMdFile, isDir } = require("../cli/path")

const addPath = async (dirname, inputPath, options) => {
	const ifFile = await isFile(inputPath)
	const ifDir = await isDir(inputPath)
	const mdFile = await isMdFile(inputPath)
	const array = []
	if (mdFile === true) {
		options.paths = [path.resolve(dirname, inputPath)]
		options.resolvedPath = path.resolve(dirname, inputPath)
		options.pathsToProcess = [path.resolve(dirname, inputPath)]
	} else if (ifDir) {
		options.resolvedPath = path.resolve(dirname, inputPath)
		options.pathsToProcess = await getMdFilesFromDir(inputPath)
	} else if(!ifDir && !mdFile){
		console.log("This is not an .md file");
		process.exit()
	}
	array.push(inputPath)
	array.push(options)
	return array
}
const generateOptionsWithPath = (dirname, inputPath) => {
	const flagsToFalse = setFlagsToFalse()
	return addPath(dirname, inputPath, flagsToFalse)
}

// addPath(__dirname, "README2.md", { validate: false, stats: false })
// 	.then((data) => console.log(data))
// 	.catch((err) => console.log(err))

// // WORKING EXAMPLE (Best)!!
// // Based on the flags array object
// const r = flags.map((items) =>
//   items.alias.map((flagValue) =>
//     args.map((arg) =>
//       arg === flagValue
//         ? (opts[items.process] = true)
//         : `${arg} is not a valid flag`
//     )
//   )
// );
// console.log(opts);

// // WORKING EXAMPLE!!!!
// // Based on the opts object
// // Ignore "--" from flag arguments
// const argToString = (arr) => arr.map((x) => x.substring(2));

// const optsObject = Object.keys(opts).map((option) =>
//   argToString(args).includes(option) || argToString(args).includes(option[0])
//     ? (opts[option] = true)
//     : null
// );

// console.log(opts);
// exports.addPath = addPath
exports.generateOptionsWithPath = generateOptionsWithPath
// exports.validateOptions = validateOptions

// validateOptions("./__tests__/__mocks__/md/README2.md")
// 	.then((data) => console.log(data))
// 	.catch((err) => console.log(err))
// generateOptionsWithPath(__dirname, "./__tests__/__mocks__/md/README2.md")
// 	.then((data) => console.log(data))
// 	.catch((err) => console.log(err))

// console.log(
// 	generateOptionsWithPath(__dirname, "./__tests__/__mocks__/md/README2.md"),
// )
