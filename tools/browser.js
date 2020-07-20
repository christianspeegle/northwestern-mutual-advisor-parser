const puppeteer = require("puppeteer")

/**
 * Gets all links from a page containing an Advisor link
 *
 * @param {string[]} urls The state abbreviations to get advisors for
 * @returns {Promise<string[]>} The Advisor URLs
 */
async function getAdvisorLinks(urls) {
	// This is what we want to get. It's the whole point of the function
	const advisorUrls = []

	// Puppeteer represents a headless browser
	// Essentially, it does everything a browser does (including process SPAs like Angular or Vue)
	// But it doesn't show you the results - it just internally renders it
	// and allows you to write code based on web pages

	// You need to manually launch a Puppeteer instance
	const browser = await puppeteer.launch()

	// You also need to manually open a new tab
	const page = await browser.newPage()

	// We want to synchronously loop through the provided array of URLs
	// Javascript is asynchronous by default, and we like that behavior
	// But to keep our memory profile low, we want to only work with one webpage at a time
	// So we need to take these pages one at a time without blocking the thread
	// Hence, we will use the unusual for...of loop
	// which is the only Javascript loop that allows asynchronous operations to await
	for (let url of urls) {
		// Go to the page for each state
		await page.goto(url)

		// Get all the <a> tags on the page
		// We also need to convert this to a Javascript array so we can iterate over it
		// (document.getElement____ functions return an HTMLCollection
		// which sound like an array but isn't)
		// Finally, use .map to pull just the a.href property off the <a> tags
		// since that's all we want
		const anchorElements = await page.evaluate(() => Array.from(document.getElementsByTagName("a")).map(a => a.href))

		// Process the href property from each element
		anchorElements.map(a => {
			// We need to make sure the anchor is not undefined before we use it
			// Otherwise the program will crash
			// JS allows "truthy" values anywhere it needs a boolean
			// so just throw a ! in front and it becomes a boolean
			if (!a) return

			// Copy the value of a into a new local variable so we can process it
			// Trying to modify 'a' directly will crash the program
			// because you can't modify an array as you iterate over it
			let href = a.valueOf()

			// If the last character is a slash, drop it
			if (href.charAt(href.length - 1) === "/")
				href = href.substring(0, href.length - 1)

			// If the href includes financial/advisor/
			// AND if # isn't the end of the string (the menu contains a javascript link with a # at the end)
			// then we found usselves a financial advisor URL, so save it
			if (href.includes("financial/advisor/") && !href.endsWith("#"))
				advisorUrls.push(href)
		})
	}

	// Cleanliness is next to godliness
	// Clean up after yourself
	await browser.close()

	// Give the caller what they came for
	return advisorUrls
}

/**
 * Gathers data on Northwestern Mutual advisors and compiles it into normalized objects
 *
 * @param {string[]} urls The advisor profile URLs to scrape
 * @returns {Promise<Object[]>} An array of advisor data objects
 */
async function getAdvisorData(urls) {
	const advisorData = []

	// You know the drill
	const browser = await puppeteer.launch()
	const page = await browser.newPage()
	let counter = 0
	const total = urls.length

	for (let url of urls) {
		// Since this program can take so long
		// Display a visual indicator of progress
		console.log(`Starting advisor ${++counter} of ${total}`)

		// Load the page, blah blah, more of the same
		await page.goto(url)

		// Execute Javascript against the rendered page
		// Remember, everything in the evaluate callback is local to the webpage
		// It can't be used outside the webpage,
		// and it can't modify variables outside its own scope
		// Otherwise, the 'advisor' const could be out here
		// instead of essentially saving it twice
		const advisorInfo = await page.evaluate(() => {
			// First, get the profile sidebar because all the data will be there
			const profile = document.getElementsByClassName("profile--sidebar")[0]

			// Advisor data needs stored somewhere
			// CSV parser expects this to be a string[]
			const advisor = []

			// The advisor name is in the <h1> within the sidebar
			advisor.push(profile.getElementsByTagName("h1")[0].innerText.trim())

			// The advisor address is in the <address> within the sidebar
			// Replace that pesky newline so everything is on one line
			advisor.push(profile.getElementsByTagName("address")[0].innerText.replace("\n", " ").trim())

			// The advisor phone has a unique class: .profile--phone-link
			advisor.push(profile.getElementsByClassName("profile--phone-link")[0].innerText.trim())

			// The advisor website has a unique class: .profile--website-link
			advisor.push(profile.getElementsByClassName("profile--website-link")[0].href)

			return advisor
		})

		// Save the advisor to the data
		advisorData.push(advisorInfo)
	}

	// Give the user their data
	return advisorData
}

module.exports = {
	getAdvisorLinks,
	getAdvisorData
}