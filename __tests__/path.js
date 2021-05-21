const {
	checkPathExists,
	isDir,
	isFile,
	isMdFile,
	getFiles,
	getMdFiles,
} = require("../path")
const path = require("path")

const realPath = "./__tests__/__mocks__/md/README2.md"
const realDir = "./__tests__/__mocks__/md"
const fakePath = "./__tests__/__mocks__/md/fake.md"
// const fakeDir = "./__tests__/__mocks__/mdfake"

test("returns an object with flags set to false and an existing path", async () => {
	const resolvedPath = path.resolve(realPath)
	const checkPath = await checkPathExists(resolvedPath)
	expect(checkPath).toMatchObject({
		stats: false,
		validate: false,
		paths: [
			"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
		],
	})
})

test("returns an error since the path does not exist", async () => {
	const resolvedPath = path.resolve(fakePath)
	const checkPath = await checkPathExists(resolvedPath)
	expect(checkPath).toEqual(
		`The given path does not exist:
	  ${resolvedPath}
	  Error: ENOENT: no such file or directory, access '${resolvedPath}'`,
	)
})

test("x", async () => {
	const resolvedPath = path.resolve(realDir)
	const checkDir = await isDir(resolvedPath)
	expect(checkDir).toBe(true)
})

test("y", async () => {
	const resolvedPath = path.resolve(realPath)
	const checkDir = await isDir(resolvedPath)
	expect(checkDir).toBe(false)
})

test("z", async () => {
	const resolvedPath = path.resolve(realPath)
	const checkDir = await isFile(resolvedPath)
	expect(checkDir).toBe(true)
})

test("zz", async () => {
	const resolvedPath = path.resolve(realDir)
	const checkDir = await isFile(resolvedPath)
	expect(checkDir).toBe(false)
})
test("should return true", () => {
	const file = isMdFile(realPath)
	expect(file).toBe(true)
})

test("should return false", () => {
	const file = isMdFile(realDir)
	expect(file).toBe(false)
})
test("should return an array listing all the files in the directory", async () => {
	const dir = await getFiles(realDir)
	expect(dir).toEqual(expect.arrayContaining(["README2.md"]))
})
test("ss", async () => {
	const filterFiles = await getMdFiles(realDir)
	expect(filterFiles).toEqual(
		expect.arrayContaining(["README2.md", "README2 copy.md"]),
	)
})
test("sss", async () => {
	const filterFiles = await getMdFiles("./__tests__/__mocks__")
	expect(filterFiles).toEqual([])
})
