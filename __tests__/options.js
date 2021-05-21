const { validateOptions } = require("../options")
const { checkPathExists } = require("../path")
describe("returns an object with valid flags set to true or returns a helpful error message", () => {
	const validFlag = ["--s"]
	const validFlags = ["--stats", "--v"]
	const invalidFlag = ["--sfa"]
	const invalidFlags = ["-fs", "eg", "--st"]

	test("returns an object with a resolved path and the stats process set to true", async () => {
		const checkPath = await checkPathExists(
			"./__tests__/__mocks__/md/README2.md",
		)
		const optionValidation = await validateOptions(checkPath, validFlag)
		expect(optionValidation).toMatchObject({
			stats: true,
			validate: false,
			paths: [
				"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
			],
		})
	})
	test("returns an error since the path does not exist", async () => {
		const path = "./__tests__/__mocks__/md/READMfE2.md"
		const checkPath = await checkPathExists(path)
		// const optionValidation = await validateOptions(checkPath, validFlag)
		expect(checkPath).toEqual(
			`The given path does not exist:
	  ${path}
	  Error: ENOENT: no such file or directory, access '${path}'`,
		)
	})
	test("returns an error message pointing out that the flag does not exist", async () => {
		const checkPath = await checkPathExists(
			"./__tests__/__mocks__/md/README2.md",
		)
		const optionValidation = await validateOptions(checkPath, invalidFlag)
		expect(optionValidation).toEqual(`The flag ${invalidFlag} is not valid`)
	})
	test("returns an error message with a list of invalid flags", async () => {
		const checkPath = await checkPathExists(
			"./__tests__/__mocks__/md/README2.md",
		)
		const optionValidation = await validateOptions(checkPath, [
			...validFlags,
			...invalidFlags,
		])
		expect(optionValidation).toEqual(`This flags are not valid:
${invalidFlags.map((f) => f).join("\n")}`)
	})
})
