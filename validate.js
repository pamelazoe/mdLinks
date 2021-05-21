const fetch = require("node-fetch")

// const validate = async (urls) => {
// 	return await Promise.all(
// 		urls.map(async (url) => {
// 			return await fetch(url.href)
// 				.then((data) => {
// 					const { status, statusText } = data
// 					const objectStatus = { status, statusText }
// 					const ff = { ...url, ...objectStatus }
// 					return ff
// 					// console.log(data);
// 				})
// 				.catch((error) => console.log(error))
// 		}),
// 	)
// }
const timeout = 7000
const get = (url) => {
	const controller = new AbortController()
	return Promise.race([
		fetch(url, {
			signal: controller.signal,
		}),
		new Promise((resolve) => {
			setTimeout(() => {
				resolve("request was not fulfilled in time")
				controller.abort()
			}, timeout)
		}),
	])
}

const validate = async (urls) => {
	return await Promise.all(
		urls.map(async (url) => {
			return await get(url.href)
				.then((data) => {
					const { status, statusText } = data
					const objectStatus =
						status !== undefined && statusText !== undefined
							? { status, statusText }
							: {
									status: "The request took too long",
									statusText: "You might want to check it individually",
							  }
					const ff = { ...url, ...objectStatus }
					return ff
					// console.log(data);
				})
				.catch((error) => error)
		}),
	)
}

exports.validate = validate
const arr = [
	{
		href: "https://github.com/jevy",
		text: "jlevy",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 3,
	},
	{
		href: "https://www.holloway.com",
		text: "Holloway",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 3,
	},
	{
		href: "https://airtable.com/shrzMhx00YiIVAWJg000",
		text: "**Please submit a question**",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 12,
	},
]
const arr2 = [
	{
		href: "https://github.com/jlevy",
		text: "jlevy",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 3,
	},
	{
		href: "https://www.holloway.com",
		text: "Holloway",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 3,
	},
	{
		href: "https://airtable.com/shrzMhx00YiIVAWJg",
		text: "**Please submit a question**",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 12,
	},
	{
		href: "http://explainshell.com/",
		text: "Explainshell",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 26,
	},
	{
		href: "http://superuser.com/a/183980/7106",
		text: "arrange for login shells to source it",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 99,
	},
	{
		href: "https://www.tldp.org/LDP/abs/html/here-docs.html",
		text: "redirection of multiple lines of input",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 142,
	},
	{
		href: "https://tmux.github.io/",
		text: "`tmux`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 155,
	},
	{
		href: "https://github.com/bogner/dtach",
		text: "`dtach`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 155,
	},
	{
		href: "https://mosh.mit.edu/",
		text: "`mosh`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 173,
	},
	{
		href: "https://github.com/mooz/percol",
		text: "`percol`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 181,
	},
	{
		href: "https://github.com/junegunn/fzf",
		text: "`fzf`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 181,
	},
	{
		href: "https://github.com/facebook/PathPicker",
		text: "PathPicker",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 183,
	},
	{
		href: "https://wiki.debian.org/CommonErrorMessages/ArgumentListTooLong",
		text: "128K limit",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 192,
	},
	{
		href: "https://github.com/beyondgrep/ack2",
		text: "`ack`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 205,
	},
	{
		href: "https://github.com/ggreer/the_silver_searcher",
		text: "`ag`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 205,
	},
	{
		href: "https://github.com/BurntSushi/ripgrep",
		text: "`rg`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 205,
	},
	{
		href: "http://pandoc.org/",
		text: "`pandoc`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 209,
	},
	{
		href: "http://stedolan.github.io/jq/",
		text: "`jq`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 213,
	},
	{
		href: "https://github.com/simeji/jid",
		text: "`jid`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 213,
	},
	{
		href: "https://github.com/fiatjaf/jiq",
		text: "`jiq`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 213,
	},
	{
		href: "https://github.com/0k/shyaml",
		text: "`shyaml`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 215,
	},
	{
		href: "https://github.com/onyxfish/csvkit",
		text: "csvkit",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 217,
	},
	{
		href: "https://github.com/s3tools/s3cmd",
		text: "`s3cmd`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 219,
	},
	{
		href: "https://github.com/bloomreach/s4cmd",
		text: "`s4cmd`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 219,
	},
	{
		href: "https://github.com/aws/aws-cli",
		text: "`aws`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 219,
	},
	{
		href: "https://github.com/donnemartin/saws",
		text: "`saws`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 219,
	},
	{
		href: "https://www.gnu.org/software/datamash/",
		text: "`datamash`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 229,
	},
	{
		href: "https://github.com/jlevy/repren",
		text: "`repren`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 241,
	},
	{
		href:
			"https://web.archive.org/web/20130929001850/http://linuxnote.net/jianingy/en/linux/a-fast-way-to-remove-huge-number-of-files.html",
		text: "fastest ways",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 252,
	},
	{
		href: "http://www.ivarch.com/programs/pv.shtml",
		text: "`pv`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 258,
	},
	{
		href: "https://github.com/dmerejkowsky/pycp",
		text: "`pycp`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 258,
	},
	{
		href: "https://github.com/dspinellis/pmonitor",
		text: "`pmonitor`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 258,
	},
	{
		href: "https://github.com/Xfennec/progress",
		text: "`progress`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 258,
	},
	{
		href: "https://en.wikipedia.org/wiki/ISO_8601",
		text: "ISO 8601",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 286,
	},
	{
		href:
			"https://stackoverflow.com/questions/7216358/date-command-on-os-x-doesnt-have-iso-8601-i-option",
		text: "are",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 286,
	},
	{
		href:
			"https://unix.stackexchange.com/questions/164826/date-command-iso-8601-option",
		text: "problematic",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 286,
	},
	{
		href: "http://www.fresse.org/dateutils/",
		text: "`dateutils`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 286,
	},
	{
		href: "https://en.wikipedia.org/wiki/Sparse_file",
		text: "sparse file",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 299,
	},
	{
		href: "https://github.com/jkbrzt/httpie",
		text: "`httpie`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 303,
	},
	{
		href: "https://github.com/nicolargo/glances",
		text: "`glances`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 309,
	},
	{
		href: "https://github.com/aragozin/jvm-tools",
		text: "SJK tools",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 313,
	},
	{
		href: "http://www.bitwizard.nl/mtr/",
		text: "`mtr`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 315,
	},
	{
		href: "https://dev.yorhel.nl/ncdu",
		text: "`ncdu`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 317,
	},
	{
		href: "http://www.ex-parrot.com/~pdw/iftop/",
		text: "`iftop`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 319,
	},
	{
		href: "https://github.com/raboof/nethogs",
		text: "`nethogs`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 319,
	},
	{
		href: "https://wireshark.org/",
		text: "`wireshark`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 323,
	},
	{
		href:
			"https://www.wireshark.org/docs/wsug_html_chunked/AppToolstshark.html",
		text: "`tshark`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 323,
	},
	{
		href: "http://ngrep.sourceforge.net/",
		text: "`ngrep`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 323,
	},
	{
		href: "http://www.catonmat.net/blog/ldd-arbitrary-code-execution/",
		text: "never run it on untrusted files",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 327,
	},
	{
		href: "http://sebastien.godard.pagesperso-orange.fr/",
		text: "`sar`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 333,
	},
	{
		href: "https://sourceware.org/systemtap/wiki",
		text: "SystemTap",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 335,
	},
	{
		href: "https://en.wikipedia.org/wiki/Perf_%28Linux%29",
		text: "`perf`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 335,
	},
	{
		href: "https://github.com/draios/sysdig",
		text: "`sysdig`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 335,
	},
	{
		href: "https://gnupg.org/",
		text: "`gpg`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 433,
	},
	{
		href: "https://github.com/mattthias/slurm",
		text: "`slurm`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 441,
	},
	{
		href: "https://github.com/joh/when-changed",
		text: "`when-changed`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 461,
	},
	{
		href: "https://github.com/wg/wrk",
		text: "`wrk`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 487,
	},
	{
		href: "http://www.bitwizard.nl/mtr/",
		text: "`mtr`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 491,
	},
	{
		href: "https://wireshark.org/",
		text: "`wireshark`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 497,
	},
	{
		href:
			"https://www.wireshark.org/docs/wsug_html_chunked/AppToolstshark.html",
		text: "`tshark`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 497,
	},
	{
		href: "http://ngrep.sourceforge.net/",
		text: "`ngrep`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 499,
	},
	{
		href: "https://github.com/nicolargo/glances",
		text: "`glances`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 507,
	},
	{
		href: "http://sebastien.godard.pagesperso-orange.fr/",
		text: "`sar`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 523,
	},
	{
		href: "http://www.ex-parrot.com/~pdw/iftop/",
		text: "`iftop`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 525,
	},
	{
		href: "https://github.com/raboof/nethogs",
		text: "`nethogs`",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 525,
	},
	{
		href: "https://cygwin.com/",
		text: "Cygwin",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 567,
	},
	{
		href: "https://msdn.microsoft.com/commandline/wsl/about",
		text: "Windows Subsystem for Linux (WSL)",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 569,
	},
	{
		href: "http://www.mingw.org/",
		text: "MinGW",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 571,
	},
	{
		href: "http://www.mingw.org/wiki/msys",
		text: "MSYS",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 571,
	},
	{
		href: "https://github.com/dthree/cash",
		text: "Cash",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 573,
	},
	{
		href: "http://www.thewindowsclub.com/rundll32-shortcut-commands-windows",
		text: "many useful Windows tasks",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 581,
	},
	{
		href: "https://github.com/alebcay/awesome-shell",
		text: "awesome-shell",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 599,
	},
	{
		href: "https://github.com/herrbischoff/awesome-osx-command-line",
		text: "awesome-osx-command-line",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 600,
	},
	{
		href: "http://redsymbol.net/articles/unofficial-bash-strict-mode/",
		text: "Strict mode",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 601,
	},
	{
		href: "https://github.com/koalaman/shellcheck",
		text: "shellcheck",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 602,
	},
	{
		href: "http://www.dwheeler.com/essays/filenames-in-shell.html",
		text: "Filenames and Pathnames in Shell",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 603,
	},
	{
		href: "https://i.creativecommons.org/l/by-sa/4.0/88x31.png",
		text: "![Creative Commons License",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 611,
	},
	{
		href: "http://creativecommons.org/licenses/by-sa/4.0/",
		text: "Creative Commons Attribution-ShareAlike 4.0 International License",
		file: "/Volumes/Macintosh HD/JSprojects/markdownLinks/README2.md",
		lineNumber: 613,
	},
]
// validate(arr)
// 	.then((data) => console.log(data))
// 	.catch((err) => console.log(err))

// const classify = async (array) => {
// 	const urls = await validate(array)
// 	// const w = urls.filter((e) => e.status === 404)
// 	return urls
// }

// classify(arr)
// 	.then((data) => console.log(data))
// 	.catch((err) => console.log(err))
