const fs = require("fs")
const path = require("path")
const { generateOptionsWithPath } = require("./path/options")
const { getFlags, filterFlags } = require("./cli/flags")
const { readFile } = require("./noOptions")
const { validate } = require("./validate")
const { getUnique } = require("./stats")

/**
 * Checks if a given
 * @param {*} dirname
 * @param {*} file
 */
const checkPathExists = async (dirname, file) => {
	// console.log("checkPathExists function...");
	return fs.promises
		.access(file, fs.constants.F_OK)
		.then(() => generateOptionsWithPath(dirname, file))
		.catch((err) => {
			console.log(`The given path does not exist:
			  ${file}
			   ${err}`)
			return err && process.exit(1)
		})
}

const validateOptions = async (arr, args) => {
	// console.log("validateOptions function...");
	// console.log(arr)
	const invalidFlags = await filterFlags(args)
	if (invalidFlags.length === 1) {
		console.log(`The flag ${invalidFlags[0]} is not valid`)
		process.exit()
	} else if (invalidFlags.length > 1) {
		console.log(`This flags are not valid:
${invalidFlags.map((f) => f).join("\n")}`)
process.exit()
	} else {
		const flags = await getFlags()
		flags.map((items) =>
			items.alias.map((flagValue) =>
				args.map((arg) =>
					arg === flagValue
						? (arr[1][items.process] = true)
						: `${arg} is not a valid flag`,
				),
			),
		)
		const [originalPath, optionsWithPathsToCheck] = arr
		// Shows flags and paths in the console
		// console.log(optionsWithPathsToCheck)
		return !optionsWithPathsToCheck.pathsToProcess.length
			? `There are no .md files to check for this path:
		${path.resolve(__dirname, originalPath)}`
			: arr
		// if (arr) return arr
		// process.exit(1)
	}
}

const extractLinks = async (array) => {
	// console.log("extractLinks function...");
	// eslint-disable-next-line no-unused-vars
	const [originalPath, processingInfo] = array
	// console.log(array)
	const links = await Promise.all(
		processingInfo.pathsToProcess.map((path) => {
			return readFile(path)
				.then((links) => ({ path: path, links: links }))
				.catch((err) => console.log(err))
		}),
	)
	const returnedLinks = [processingInfo, links]
	return returnedLinks
	// return links
}

const checkValidate = async (arrayToEvaluate) => {
	const [options, returnedLinks] = arrayToEvaluate
	console.log("Loading...")
	if (options.validate) {
		const validationProcess = await Promise.all(
			returnedLinks.map(async (w) => {
				const { path, links } = w;
				const validation = await validate(links)
				return { path, links: validation }
			}),
		)
		return [options, validationProcess]
	}
	return arrayToEvaluate
	// console.log(returnedLinks)
}

const checkStats = async (arrayToEvaluate) => {
	const [options, returnedLinks] = await arrayToEvaluate
	if (options.stats) {
		const getFullObjects = await Promise.all(
			returnedLinks.map(async (q) => {
				const unique = await q.links.map((l) => {
					if (l === []) return l
					if (l.status) return { status: l.status, href: l.href }
					return { href: l.href }
				})
				const x = await unique.filter(
					(elem, index, arr) =>
						arr.findIndex((obj) => obj.href === elem.href) === index,
				)
				return { path: q.path, links: x }
				// return unique
			}),
		)
		return getFullObjects
	}
	return arrayToEvaluate
}

exports.checkPathExists = checkPathExists
exports.validateOptions = validateOptions
exports.extractLinks = extractLinks
exports.checkValidate = checkValidate

const links = [
	{
		stats: false,
		validate: true,
		resolvedPath:
			"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md",
		pathsToProcess: [
			"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2 copy.md",
			"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
		],
	},
	[
		{
			path:
				"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2 copy.md",
			links: [],
		},
		{
			path:
				"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
			links: [
				{
					href: "https://github.com/jlevy",
					text: "jlevy",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 8,
				},
				{
					href: "https://www.holloway.com",
					text: "Holloway",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 8,
				},
				{
					href: "https://airtable.com/shrzMhx00YiIVAWJg",
					text: "**Please submit a question**",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 12,
				},
				{
					href: "http://explainshell.com/",
					text: "Explainshell",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 26,
				},
				{
					href: "http://superuser.com/a/183980/7106",
					text: "arrange for login shells to source it",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 99,
				},
				{
					href: "https://www.tldp.org/LDP/abs/html/here-docs.html",
					text: "redirection of multiple lines of input",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 142,
				},
				{
					href: "https://tmux.github.io/",
					text: "`tmux`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 155,
				},
				{
					href: "https://github.com/bogner/dtach",
					text: "`dtach`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 155,
				},
				{
					href: "https://mosh.mit.edu/",
					text: "`mosh`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 173,
				},
				{
					href: "https://github.com/mooz/percol",
					text: "`percol`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 181,
				},
				{
					href: "https://github.com/junegunn/fzf",
					text: "`fzf`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 181,
				},
				{
					href: "https://github.com/facebook/PathPicker",
					text: "PathPicker",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 183,
				},
				{
					href:
						"https://wiki.debian.org/CommonErrorMessages/ArgumentListTooLong",
					text: "128K limit",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 192,
				},
				{
					href: "https://github.com/beyondgrep/ack2",
					text: "`ack`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 205,
				},
				{
					href: "https://github.com/ggreer/the_silver_searcher",
					text: "`ag`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 205,
				},
				{
					href: "https://github.com/BurntSushi/ripgrep",
					text: "`rg`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 205,
				},
				{
					href: "http://pandoc.org/",
					text: "`pandoc`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 209,
				},
				{
					href: "http://stedolan.github.io/jq/",
					text: "`jq`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 213,
				},
				{
					href: "https://github.com/simeji/jid",
					text: "`jid`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 213,
				},
				{
					href: "https://github.com/fiatjaf/jiq",
					text: "`jiq`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 213,
				},
				{
					href: "https://github.com/0k/shyaml",
					text: "`shyaml`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 215,
				},
				{
					href: "https://github.com/onyxfish/csvkit",
					text: "csvkit",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 217,
				},
				{
					href: "https://github.com/s3tools/s3cmd",
					text: "`s3cmd`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 219,
				},
				{
					href: "https://github.com/bloomreach/s4cmd",
					text: "`s4cmd`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 219,
				},
				{
					href: "https://github.com/aws/aws-cli",
					text: "`aws`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 219,
				},
				{
					href: "https://github.com/donnemartin/saws",
					text: "`saws`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 219,
				},
				{
					href: "https://www.gnu.org/software/datamash/",
					text: "`datamash`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 229,
				},
				{
					href: "https://github.com/jlevy/repren",
					text: "`repren`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 241,
				},
				{
					href:
						"https://web.archive.org/web/20130929001850/http://linuxnote.net/jianingy/en/linux/a-fast-way-to-remove-huge-number-of-files.html",
					text: "fastest ways",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 252,
				},
				{
					href: "http://www.ivarch.com/programs/pv.shtml",
					text: "`pv`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 258,
				},
				{
					href: "https://github.com/dmerejkowsky/pycp",
					text: "`pycp`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 258,
				},
				{
					href: "https://github.com/dspinellis/pmonitor",
					text: "`pmonitor`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 258,
				},
				{
					href: "https://github.com/Xfennec/progress",
					text: "`progress`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 258,
				},
				{
					href: "https://en.wikipedia.org/wiki/ISO_8601",
					text: "ISO 8601",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 286,
				},
				{
					href:
						"https://stackoverflow.com/questions/7216358/date-command-on-os-x-doesnt-have-iso-8601-i-option",
					text: "are",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 286,
				},
				{
					href:
						"https://unix.stackexchange.com/questions/164826/date-command-iso-8601-option",
					text: "problematic",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 286,
				},
				{
					href: "http://www.fresse.org/dateutils/",
					text: "`dateutils`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 286,
				},
				{
					href: "https://en.wikipedia.org/wiki/Sparse_file",
					text: "sparse file",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 299,
				},
				{
					href: "https://github.com/jkbrzt/httpie",
					text: "`httpie`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 303,
				},
				{
					href: "https://github.com/nicolargo/glances",
					text: "`glances`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 309,
				},
				{
					href: "https://github.com/aragozin/jvm-tools",
					text: "SJK tools",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 313,
				},
				{
					href: "http://www.bitwizard.nl/mtr/",
					text: "`mtr`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 315,
				},
				{
					href: "https://dev.yorhel.nl/ncdu",
					text: "`ncdu`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 317,
				},
				{
					href: "http://www.ex-parrot.com/~pdw/iftop/",
					text: "`iftop`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 319,
				},
				{
					href: "https://github.com/raboof/nethogs",
					text: "`nethogs`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 319,
				},
				{
					href: "https://wireshark.org/",
					text: "`wireshark`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 323,
				},
				{
					href:
						"https://www.wireshark.org/docs/wsug_html_chunked/AppToolstshark.html",
					text: "`tshark`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 323,
				},
				{
					href: "http://ngrep.sourceforge.net/",
					text: "`ngrep`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 323,
				},
				{
					href: "http://www.catonmat.net/blog/ldd-arbitrary-code-execution/",
					text: "never run it on untrusted files",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 327,
				},
				{
					href: "http://sebastien.godard.pagesperso-orange.fr/",
					text: "`sar`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 333,
				},
				{
					href: "https://sourceware.org/systemtap/wiki",
					text: "SystemTap",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 335,
				},
				{
					href: "https://en.wikipedia.org/wiki/Perf_%28Linux%29",
					text: "`perf`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 335,
				},
				{
					href: "https://github.com/draios/sysdig",
					text: "`sysdig`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 335,
				},
				{
					href: "https://gnupg.org/",
					text: "`gpg`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 433,
				},
				{
					href: "https://github.com/mattthias/slurm",
					text: "`slurm`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 441,
				},
				{
					href: "https://github.com/joh/when-changed",
					text: "`when-changed`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 461,
				},
				{
					href: "https://github.com/wg/wrk",
					text: "`wrk`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 487,
				},
				{
					href: "http://www.bitwizard.nl/mtr/",
					text: "`mtr`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 491,
				},
				{
					href: "https://wireshark.org/",
					text: "`wireshark`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 497,
				},
				{
					href:
						"https://www.wireshark.org/docs/wsug_html_chunked/AppToolstshark.html",
					text: "`tshark`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 497,
				},
				{
					href: "http://ngrep.sourceforge.net/",
					text: "`ngrep`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 499,
				},
				{
					href: "https://github.com/nicolargo/glances",
					text: "`glances`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 507,
				},
				{
					href: "http://sebastien.godard.pagesperso-orange.fr/",
					text: "`sar`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 523,
				},
				{
					href: "http://www.ex-parrot.com/~pdw/iftop/",
					text: "`iftop`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 525,
				},
				{
					href: "https://github.com/raboof/nethogs",
					text: "`nethogs`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 525,
				},
				{
					href: "https://cygwin.com/",
					text: "Cygwin",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 567,
				},
				{
					href: "https://msdn.microsoft.com/commandline/wsl/about",
					text: "Windows Subsystem for Linux (WSL)",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 569,
				},
				{
					href: "http://www.mingw.org/",
					text: "MinGW",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 571,
				},
				{
					href: "http://www.mingw.org/wiki/msys",
					text: "MSYS",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 571,
				},
				{
					href: "https://github.com/dthree/cash",
					text: "Cash",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 573,
				},
				{
					href:
						"http://www.thewindowsclub.com/rundll32-shortcut-commands-windows",
					text: "many useful Windows tasks",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 581,
				},
				{
					href: "https://github.com/alebcay/awesome-shell",
					text: "awesome-shell",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 599,
				},
				{
					href: "https://github.com/herrbischoff/awesome-osx-command-line",
					text: "awesome-osx-command-line",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 600,
				},
				{
					href: "http://redsymbol.net/articles/unofficial-bash-strict-mode/",
					text: "Strict mode",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 601,
				},
				{
					href: "https://github.com/koalaman/shellcheck",
					text: "shellcheck",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 602,
				},
				{
					href: "http://www.dwheeler.com/essays/filenames-in-shell.html",
					text: "Filenames and Pathnames in Shell",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 603,
				},
				{
					href: "https://i.creativecommons.org/l/by-sa/4.0/88x31.png",
					text: "![Creative Commons License",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 611,
				},
				{
					href: "http://creativecommons.org/licenses/by-sa/4.0/",
					text:
						"Creative Commons Attribution-ShareAlike 4.0 International License",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 613,
				},
			],
		},
	],
]
const links2 = [
	{
		stats: true,
		validate: true,
		resolvedPath:
			"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md",
		pathsToProcess: [
			"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2 copy.md",
			"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
		],
	},
	[
		{
			path:
				"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2 copy.md",
			links: [],
		},
		{
			path:
				"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
			links: [
				{
					href: "https://github.com/jlevy",
					text: "jlevy",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 8,
				},
				{
					href: "https://github.com/jlevy",
					text: "jlevy",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 8,
				},
				{
					href: "https://github.com/jlevy",
					text: "jlevy",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 8,
				},
				{
					href: "https://www.holloway.com",
					text: "Holloway",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 8,
				},
				{
					href: "https://airtable.com/shrzMhx00YiIVAWJg",
					text: "**Please submit a question**",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 12,
				},
				{
					href: "http://explainshell.com/",
					text: "Explainshell",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 26,
				},
				{
					href: "http://superuser.com/a/183980/7106",
					text: "arrange for login shells to source it",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 99,
				},
				{
					href: "https://www.tldp.org/LDP/abs/html/here-docs.html",
					text: "redirection of multiple lines of input",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 142,
				},
				{
					href: "https://tmux.github.io/",
					text: "`tmux`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 155,
				},
				{
					href: "https://github.com/bogner/dtach",
					text: "`dtach`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 155,
				},
				{
					href: "https://mosh.mit.edu/",
					text: "`mosh`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 173,
				},
				{
					href: "https://github.com/mooz/percol",
					text: "`percol`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 181,
				},
				{
					href: "https://github.com/junegunn/fzf",
					text: "`fzf`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 181,
				},
				{
					href: "https://github.com/facebook/PathPicker",
					text: "PathPicker",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 183,
				},
				{
					href:
						"https://wiki.debian.org/CommonErrorMessages/ArgumentListTooLong",
					text: "128K limit",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 192,
				},
				{
					href: "https://github.com/beyondgrep/ack2",
					text: "`ack`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 205,
				},
				{
					href: "https://github.com/ggreer/the_silver_searcher",
					text: "`ag`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 205,
				},
				{
					href: "https://github.com/BurntSushi/ripgrep",
					text: "`rg`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 205,
				},
				{
					href: "http://pandoc.org/",
					text: "`pandoc`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 209,
				},
				{
					href: "http://stedolan.github.io/jq/",
					text: "`jq`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 213,
				},
				{
					href: "https://github.com/simeji/jid",
					text: "`jid`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 213,
				},
				{
					href: "https://github.com/fiatjaf/jiq",
					text: "`jiq`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 213,
				},
				{
					href: "https://github.com/0k/shyaml",
					text: "`shyaml`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 215,
				},
				{
					href: "https://github.com/onyxfish/csvkit",
					text: "csvkit",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 217,
				},
				{
					href: "https://github.com/s3tools/s3cmd",
					text: "`s3cmd`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 219,
				},
				{
					href: "https://github.com/bloomreach/s4cmd",
					text: "`s4cmd`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 219,
				},
				{
					href: "https://github.com/aws/aws-cli",
					text: "`aws`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 219,
				},
				{
					href: "https://github.com/donnemartin/saws",
					text: "`saws`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 219,
				},
				{
					href: "https://www.gnu.org/software/datamash/",
					text: "`datamash`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 229,
				},
				{
					href: "https://github.com/jlevy/repren",
					text: "`repren`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 241,
				},
				{
					href:
						"https://web.archive.org/web/20130929001850/http://linuxnote.net/jianingy/en/linux/a-fast-way-to-remove-huge-number-of-files.html",
					text: "fastest ways",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 252,
				},
				{
					href: "http://www.ivarch.com/programs/pv.shtml",
					text: "`pv`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 258,
				},
				{
					href: "https://github.com/dmerejkowsky/pycp",
					text: "`pycp`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 258,
				},
				{
					href: "https://github.com/dspinellis/pmonitor",
					text: "`pmonitor`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 258,
				},
				{
					href: "https://github.com/Xfennec/progress",
					text: "`progress`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 258,
				},
				{
					href: "https://en.wikipedia.org/wiki/ISO_8601",
					text: "ISO 8601",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 286,
				},
				{
					href:
						"https://stackoverflow.com/questions/7216358/date-command-on-os-x-doesnt-have-iso-8601-i-option",
					text: "are",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 286,
				},
				{
					href:
						"https://unix.stackexchange.com/questions/164826/date-command-iso-8601-option",
					text: "problematic",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 286,
				},
				{
					href: "http://www.fresse.org/dateutils/",
					text: "`dateutils`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 286,
				},
				{
					href: "https://en.wikipedia.org/wiki/Sparse_file",
					text: "sparse file",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 299,
				},
				{
					href: "https://github.com/jkbrzt/httpie",
					text: "`httpie`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 303,
				},
				{
					href: "https://github.com/nicolargo/glances",
					text: "`glances`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 309,
				},
				{
					href: "https://github.com/aragozin/jvm-tools",
					text: "SJK tools",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 313,
				},
				{
					href: "http://www.bitwizard.nl/mtr/",
					text: "`mtr`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 315,
				},
				{
					href: "https://dev.yorhel.nl/ncdu",
					text: "`ncdu`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 317,
				},
				{
					href: "http://www.ex-parrot.com/~pdw/iftop/",
					text: "`iftop`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 319,
				},
				{
					href: "https://github.com/raboof/nethogs",
					text: "`nethogs`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 319,
				},
				{
					href: "https://wireshark.org/",
					text: "`wireshark`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 323,
				},
				{
					href:
						"https://www.wireshark.org/docs/wsug_html_chunked/AppToolstshark.html",
					text: "`tshark`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 323,
				},
				{
					href: "http://ngrep.sourceforge.net/",
					text: "`ngrep`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 323,
				},
				{
					href: "http://www.catonmat.net/blog/ldd-arbitrary-code-execution/",
					text: "never run it on untrusted files",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 327,
				},
				{
					href: "http://sebastien.godard.pagesperso-orange.fr/",
					text: "`sar`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 333,
				},
				{
					href: "https://sourceware.org/systemtap/wiki",
					text: "SystemTap",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 335,
				},
				{
					href: "https://en.wikipedia.org/wiki/Perf_%28Linux%29",
					text: "`perf`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 335,
				},
				{
					href: "https://github.com/draios/sysdig",
					text: "`sysdig`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 335,
				},
				{
					href: "https://gnupg.org/",
					text: "`gpg`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 433,
				},
				{
					href: "https://github.com/mattthias/slurm",
					text: "`slurm`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 441,
				},
				{
					href: "https://github.com/joh/when-changed",
					text: "`when-changed`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 461,
				},
				{
					href: "https://github.com/wg/wrk",
					text: "`wrk`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 487,
				},
				{
					href: "http://www.bitwizard.nl/mtr/",
					text: "`mtr`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 491,
				},
				{
					href: "https://wireshark.org/",
					text: "`wireshark`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 497,
				},
				{
					href:
						"https://www.wireshark.org/docs/wsug_html_chunked/AppToolstshark.html",
					text: "`tshark`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 497,
				},
				{
					href: "http://ngrep.sourceforge.net/",
					text: "`ngrep`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 499,
				},
				{
					href: "https://github.com/nicolargo/glances",
					text: "`glances`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 507,
				},
				{
					href: "http://sebastien.godard.pagesperso-orange.fr/",
					text: "`sar`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 523,
				},
				{
					href: "http://www.ex-parrot.com/~pdw/iftop/",
					text: "`iftop`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 525,
				},
				{
					href: "https://github.com/raboof/nethogs",
					text: "`nethogs`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 525,
				},
				{
					href: "https://cygwin.com/",
					text: "Cygwin",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 567,
				},
				{
					href: "https://msdn.microsoft.com/commandline/wsl/about",
					text: "Windows Subsystem for Linux (WSL)",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 569,
				},
				{
					href: "http://www.mingw.org/",
					text: "MinGW",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 571,
				},
				{
					href: "http://www.mingw.org/wiki/msys",
					text: "MSYS",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 571,
				},
				{
					href: "https://github.com/dthree/cash",
					text: "Cash",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 573,
				},
				{
					href:
						"http://www.thewindowsclub.com/rundll32-shortcut-commands-windows",
					text: "many useful Windows tasks",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 581,
				},
				{
					href: "https://github.com/alebcay/awesome-shell",
					text: "awesome-shell",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 599,
				},
				{
					href: "https://github.com/herrbischoff/awesome-osx-command-line",
					text: "awesome-osx-command-line",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 600,
				},
				{
					href: "http://redsymbol.net/articles/unofficial-bash-strict-mode/",
					text: "Strict mode",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 601,
				},
				{
					href: "https://github.com/koalaman/shellcheck",
					text: "shellcheck",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 602,
				},
				{
					href: "http://www.dwheeler.com/essays/filenames-in-shell.html",
					text: "Filenames and Pathnames in Shell",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 603,
				},
				{
					href: "https://i.creativecommons.org/l/by-sa/4.0/88x31.png",
					text: "![Creative Commons License",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 611,
				},
				{
					href: "http://creativecommons.org/licenses/by-sa/4.0/",
					text:
						"Creative Commons Attribution-ShareAlike 4.0 International License",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 613,
				},
			],
		},
	],
]
const links3 = [
	{
		stats: false,
		validate: true,
		resolvedPath:
			"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md",
		pathsToProcess: [
			"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2 copy.md",
			"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
		],
	},
	[
		{
			path:
				"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2 copy.md",
			links: [],
		},
		{
			path:
				"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
			links: [
				{
					href: "https://github.com/jlevy",
					text: "jlevy",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 8,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://github.com/jlevy",
					text: "jlevy",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 8,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://github.com/jlevy",
					text: "jlevy",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 8,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://www.holloway.com",
					text: "Holloway",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 8,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://airtable.com/shrzMhx00YiIVAWJg",
					text: "**Please submit a question**",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 12,
					status: 200,
					statusText: "OK",
				},
				{
					href: "http://explainshell.com/",
					text: "Explainshell",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 26,
					status: 200,
					statusText: "OK",
				},
				{
					href: "http://superuser.com/a/183980/7106",
					text: "arrange for login shells to source it",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 99,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://www.tldp.org/LDP/abs/html/here-docs.html",
					text: "redirection of multiple lines of input",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 142,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://tmux.github.io/",
					text: "`tmux`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 155,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://github.com/bogner/dtach",
					text: "`dtach`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 155,
					status: 404,
					statusText: "Not Found",
				},
				{
					href: "https://mosh.mit.edu/",
					text: "`mosh`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 173,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://github.com/mooz/percol",
					text: "`percol`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 181,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://github.com/junegunn/fzf",
					text: "`fzf`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 181,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://github.com/facebook/PathPicker",
					text: "PathPicker",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 183,
					status: 200,
					statusText: "OK",
				},
				{
					href:
						"https://wiki.debian.org/CommonErrorMessages/ArgumentListTooLong",
					text: "128K limit",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 192,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://github.com/beyondgrep/ack2",
					text: "`ack`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 205,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://github.com/ggreer/the_silver_searcher",
					text: "`ag`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 205,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://github.com/BurntSushi/ripgrep",
					text: "`rg`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 205,
					status: 200,
					statusText: "OK",
				},
				{
					href: "http://pandoc.org/",
					text: "`pandoc`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 209,
					status: 200,
					statusText: "OK",
				},
				{
					href: "http://stedolan.github.io/jq/",
					text: "`jq`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 213,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://github.com/simeji/jid",
					text: "`jid`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 213,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://github.com/fiatjaf/jiq",
					text: "`jiq`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 213,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://github.com/0k/shyaml",
					text: "`shyaml`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 215,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://github.com/onyxfish/csvkit",
					text: "csvkit",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 217,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://github.com/s3tools/s3cmd",
					text: "`s3cmd`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 219,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://github.com/bloomreach/s4cmd",
					text: "`s4cmd`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 219,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://github.com/aws/aws-cli",
					text: "`aws`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 219,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://github.com/donnemartin/saws",
					text: "`saws`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 219,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://www.gnu.org/software/datamash/",
					text: "`datamash`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 229,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://github.com/jlevy/repren",
					text: "`repren`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 241,
					status: 200,
					statusText: "OK",
				},
				{
					href:
						"https://web.archive.org/web/20130929001850/http://linuxnote.net/jianingy/en/linux/a-fast-way-to-remove-huge-number-of-files.html",
					text: "fastest ways",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 252,
					status: 200,
					statusText: "OK",
				},
				{
					href: "http://www.ivarch.com/programs/pv.shtml",
					text: "`pv`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 258,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://github.com/dmerejkowsky/pycp",
					text: "`pycp`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 258,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://github.com/dspinellis/pmonitor",
					text: "`pmonitor`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 258,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://github.com/Xfennec/progress",
					text: "`progress`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 258,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://en.wikipedia.org/wiki/ISO_8601",
					text: "ISO 8601",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 286,
					status: 200,
					statusText: "OK",
				},
				{
					href:
						"https://stackoverflow.com/questions/7216358/date-command-on-os-x-doesnt-have-iso-8601-i-option",
					text: "are",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 286,
					status: 200,
					statusText: "OK",
				},
				{
					href:
						"https://unix.stackexchange.com/questions/164826/date-command-iso-8601-option",
					text: "problematic",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 286,
					status: 200,
					statusText: "OK",
				},
				{
					href: "http://www.fresse.org/dateutils/",
					text: "`dateutils`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 286,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://en.wikipedia.org/wiki/Sparse_file",
					text: "sparse file",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 299,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://github.com/jkbrzt/httpie",
					text: "`httpie`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 303,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://github.com/nicolargo/glances",
					text: "`glances`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 309,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://github.com/aragozin/jvm-tools",
					text: "SJK tools",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 313,
					status: 200,
					statusText: "OK",
				},
				{
					href: "http://www.bitwizard.nl/mtr/",
					text: "`mtr`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 315,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://dev.yorhel.nl/ncdu",
					text: "`ncdu`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 317,
					status: 200,
					statusText: "OK",
				},
				{
					href: "http://www.ex-parrot.com/~pdw/iftop/",
					text: "`iftop`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 319,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://github.com/raboof/nethogs",
					text: "`nethogs`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 319,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://wireshark.org/",
					text: "`wireshark`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 323,
					status: 200,
					statusText: "OK",
				},
				{
					href:
						"https://www.wireshark.org/docs/wsug_html_chunked/AppToolstshark.html",
					text: "`tshark`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 323,
					status: 200,
					statusText: "OK",
				},
				{
					href: "http://ngrep.sourceforge.net/",
					text: "`ngrep`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 323,
					status: 200,
					statusText: "OK",
				},
				{
					href: "http://www.catonmat.net/blog/ldd-arbitrary-code-execution/",
					text: "never run it on untrusted files",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 327,
					status: 200,
					statusText: "OK",
				},
				{
					href: "http://sebastien.godard.pagesperso-orange.fr/",
					text: "`sar`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 333,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://sourceware.org/systemtap/wiki",
					text: "SystemTap",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 335,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://en.wikipedia.org/wiki/Perf_%28Linux%29",
					text: "`perf`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 335,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://github.com/draios/sysdig",
					text: "`sysdig`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 335,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://gnupg.org/",
					text: "`gpg`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 433,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://github.com/mattthias/slurm",
					text: "`slurm`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 441,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://github.com/joh/when-changed",
					text: "`when-changed`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 461,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://github.com/wg/wrk",
					text: "`wrk`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 487,
					status: 200,
					statusText: "OK",
				},
				{
					href: "http://www.bitwizard.nl/mtr/",
					text: "`mtr`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 491,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://wireshark.org/",
					text: "`wireshark`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 497,
					status: 200,
					statusText: "OK",
				},
				{
					href:
						"https://www.wireshark.org/docs/wsug_html_chunked/AppToolstshark.html",
					text: "`tshark`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 497,
					status: 200,
					statusText: "OK",
				},
				{
					href: "http://ngrep.sourceforge.net/",
					text: "`ngrep`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 499,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://github.com/nicolargo/glances",
					text: "`glances`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 507,
					status: 200,
					statusText: "OK",
				},
				{
					href: "http://sebastien.godard.pagesperso-orange.fr/",
					text: "`sar`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 523,
					status: 200,
					statusText: "OK",
				},
				{
					href: "http://www.ex-parrot.com/~pdw/iftop/",
					text: "`iftop`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 525,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://github.com/raboof/nethogs",
					text: "`nethogs`",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 525,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://cygwin.com/",
					text: "Cygwin",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 567,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://msdn.microsoft.com/commandline/wsl/about",
					text: "Windows Subsystem for Linux (WSL)",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 569,
					status: 403,
					statusText: "Forbidden",
				},
				{
					href: "http://www.mingw.org/",
					text: "MinGW",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 571,
					status: 200,
					statusText: "OK",
				},
				{
					href: "http://www.mingw.org/wiki/msys",
					text: "MSYS",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 571,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://github.com/dthree/cash",
					text: "Cash",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 573,
					status: 200,
					statusText: "OK",
				},
				{
					href:
						"http://www.thewindowsclub.com/rundll32-shortcut-commands-windows",
					text: "many useful Windows tasks",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 581,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://github.com/alebcay/awesome-shell",
					text: "awesome-shell",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 599,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://github.com/herrbischoff/awesome-osx-command-line",
					text: "awesome-osx-command-line",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 600,
					status: 200,
					statusText: "OK",
				},
				{
					href: "http://redsymbol.net/articles/unofficial-bash-strict-mode/",
					text: "Strict mode",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 601,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://github.com/koalaman/shellcheck",
					text: "shellcheck",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 602,
					status: 200,
					statusText: "OK",
				},
				{
					href: "http://www.dwheeler.com/essays/filenames-in-shell.html",
					text: "Filenames and Pathnames in Shell",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 603,
					status: 200,
					statusText: "OK",
				},
				{
					href: "https://i.creativecommons.org/l/by-sa/4.0/88x31.png",
					text: "![Creative Commons License",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 611,
					status: 200,
					statusText: "OK",
				},
				{
					href: "http://creativecommons.org/licenses/by-sa/4.0/",
					text:
						"Creative Commons Attribution-ShareAlike 4.0 International License",
					file:
						"/Volumes/Macintosh HD/JSprojects/markdownLinks/__tests__/__mocks__/md/README2.md",
					lineNumber: 613,
					status: 200,
					statusText: "OK",
				},
			],
		},
	],
]
// checkStats(links3)
// 	.then((data) => {
// 		const [a, b] = data
// 		const [c, d] = b
// 		console.log(d)
// 		// console.log(data)
// 	})
// 	.catch((err) => console.log(err))

// checkValidate(links)
// 	.then((data) => {
// 		console.log(data)
// 	})
// 	.catch((err) => console.log(err))

// checkPathExists(__dirname, "READE2.md")
// 	.then((data) => data)
// 	.catch((err) => err)

// validateOptions(
// 	[
// 		"README2.md",
// 		{
// 			stats: false,
// 			validate: false,
// 			paths: ["/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md"],
// 		},
// 	],
// 	["--v"],
// )
// 	.then((data) => console.log(data))
// 	.catch((err) => console.log(err))
