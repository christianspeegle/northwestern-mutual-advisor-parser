const { writeToString } = require("@fast-csv/format")
const { writeFileSync } = require("fs")

/**
 * Writes the Advisor data to a CSV file
 *
 * @param {Object[]} output The Advisor data to write
 */
async function writeToCsv(output) {
	// Writes the array into a string for storage
	// This wasn't my first choice
	// but I had touble with more direct approaches
	const parsedOutput = await writeToString(output)

	// Writes to output.csv in the project root directory
	writeFileSync("output.csv", parsedOutput)
}

module.exports = {
	writeToCsv
}