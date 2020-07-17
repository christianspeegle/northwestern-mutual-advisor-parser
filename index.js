const { getAdvisorLinks, getAdvisorData } = require("./tools/browser")
const { writeToCsv } = require("./tools/output")

// All financial advisor URLs start with this base URL
const urlPrefix = "https://northwesternmutual.com/financial/advisors"

// All the user needs to do is list the state abbreviations for which they need advisors
// The stateUrls array stores the ready-to-go state URLs for the browser to pull
// The stateNames array stores state names passed in from the command line
const stateUrls = []
const stateNames = process.argv.slice(2)

// If the user forgot to pass in state abbreviations, the program will warn them and exit gracefully
if (stateNames.length < 1) {
	console.log("You must supply at least one state abbreviation")
	process.exit(1)
}

// For each state abbreviation:
// 1. Convert the state abbreviation to lowercase (this is how the website expects the URL to look)
// 2. Form the URL by combining the main portion of the URL with the capitalized abbreviation
// 3. Push this final URL into the array of stateUrls
stateNames.forEach(state => {
	const processedStateName = state.toLowerCase()
	const processedUrl = `${urlPrefix}/${processedStateName}`
	stateUrls.push(processedUrl)
})

// Run the program to get the advisor links
getAdvisorLinks(stateUrls)
	.then(advisorLinks => {
		return getAdvisorData(advisorLinks)
	})
	.then(advisorData => writeToCsv(advisorData))
	.catch(error => {
		console.log(`There was a problem: ${error.message}`)
		process.exit(1)
	})
	.then(() => process.exit(0))