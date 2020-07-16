const puppeteer = require("puppeteer")

/**
 * Gets all links from a page containing an Advisor link
 *
 * @param {string[]} urls The state abbreviations to get advisors for
 * @returns {Promise<string[]>}
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
	for (url of urls) {
		// Go to the page for each state
		await page.goto(url)

		// Get all the <a> tags on the page
		// We also need to convert this to a Javascript array so we can iterate over it
		// (document.getElement____ functions return an HTMLCollection
		// which sound like an array but isn't)
		const anchorElements = await page.evaluate(() => Array.from(document.getElementsByTagName("a")).map(a => a.href))

		// Process the a.href property from each element
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

			// If the href includes financial/advisors
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

module.exports = {
	getAdvisorLinks
}