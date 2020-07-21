# Northwestern Mutual Advisor Parser

Reads and parses the personnel information for Northwestern Mutual Financial Advisors from the public website.

## Installation

All you have to do is clone this repository to your local computer to run the code.

1. Ensure [git](https://git-scm.com/downloads) is installed on your computer
2. Open a command prompt and `cd` into the directory where you want to store the project
3. Enter this command: `git clone git@github.com:/christianspeegle/northwestern-mutual-advisor-parser.git`

## Running the code

Running the code is pretty basic.

1. Ensure [Node.js](https://nodejs.org/en/download/) is installed on your computer
2. Open a command prompt and `cd` into the directory containing the project `package.json` file
3. Install the project dependencies by running `npm i`
4. Execute the program by running `node index.js x y z` where `x`, `y`, and `z` are state abbreviations for the states you need to parse.

For example, to get information on financial advisors from Alabama, Ohio, Florida, Texas, and Wyoming, run this command:

```
node index.js al oh fl tx wy
```

The state abbreviations are case-insensitive; `AL`, `Al`, `aL`, and `al` are all acceptable inputs because the program converts these to a single case at runtime.

The program outputs the contents of the CSV into a file called `output.csv` in the project directory. To test that the program is working for you, run this command:

```
node index.js ak
```

This runs the program against the Alaska financial advisors. Use Alaska because there are only two financial advisors statewide; the program runs in just a few moments and so can be tested quickly.

## Improving the code

The code loosely follows a few basic code conventions, such as Separation of Concerns. However, this is a small project and it can be improved. I encourage you to improve this program and make it more robust to suit your needs. There are several upgrades to the program that can be made, including but not limited to:

1. Extract the Puppeteer instance from each of the functions in `tools/browser.js` and either a) make a single instance for both functions to share at the top of the file, or b) make a single instance in `index.js` and pass it into the `toos/browser.js` functions as an argument. This will improve code speed by only having a single instance of Puppeteer, which is a large program that costs several seconds to start and stop. For more information on ways to effectively share a single instance of an object between functions and modules, look up Inversion of Control (IoC) and Dependency Injection (DI).

2. Add the ability to name the output file. Currently, the name is hardcoded into the file ("output.csv") and this isn't robust or user-friendly.

3. Add the ability to choose different output formats. Currently, only CSV output is supported but this can be expanded to other formats such as XML and JSON.

4. Add the ability to provide command line flags. With command line options and flags, you can vastly diversify the capabilities of the program. A popular package for command line options is [yargs](https://npmjs.com/package/yargs). However, I have created an alternative package called [Crossview CLI](https://npmjs.com/package/@crossview/cli) that does the same thing as `yargs`, but with fewer files (9 versus 62), fewer lines of code (11kB vs 231kB, better test coverage (100% coverage vs 96%), and no dependencies (`yargs` has 11 top-level dependencies and many more nested dependencies).

This list isn't exhaustive; feel free to update, change, or reuse this code however you see fit (this code is MIT licensed, which allows you to do pretty much everything you want with it).
