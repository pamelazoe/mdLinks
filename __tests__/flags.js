const {
	getFlags,
	setFlagsToFalse,
	generateOptionsWithPath,
	getValidFlags,
	filterFlags,
} = require("../flags")

test("returns an array of objects with the main flags available to the user", async () => {
	const data = await getFlags()
	expect(data).toMatchObject([
		{ alias: ["--stats", "--s"], process: "stats" },
		{ alias: ["--validate", "--v"], process: "validate" },
	])
})

test("returns an object with all the flags set to false", async () => {
	const flagsTofalse = await setFlagsToFalse()
	expect(flagsTofalse).toMatchObject({ validate: false, stats: false })
})

test("returns an object with flags set to false and the key path set to an existing path", async () => {
	const joinPath = await generateOptionsWithPath(
		"__tests__/__mocks__/md/README2.md",
	)
	expect(joinPath).toMatchObject({
		stats: false,
		validate: false,
		paths: [
			"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
		],
	})
})

test("return an array", async () => {
	const validFlags = await getValidFlags()
	expect(validFlags).toEqual(expect.any(Array))
})

test("return an array with all the valid aliases/options available to the user", async () => {
	const validFlags = await getValidFlags()
	const array = ["--validate", "--v", "--s", "--stats"]
	expect(validFlags.sort()).toEqual(array.sort())
})

test("should return an array of invalid flags", async () => {
	const valid = await getValidFlags()
	const notValid = ["dgfd", "--", "--sf", "-yr"]
	const filteredFlags = await filterFlags([...valid, ...notValid])
	expect(filteredFlags).toEqual(notValid)
	expect(filteredFlags).toEqual(expect.not.arrayContaining(valid))
})
