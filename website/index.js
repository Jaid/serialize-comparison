import fs from "fs"
import path from "path"
import ejs from "ejs"
import crypto from "crypto"
import mkdirp from "mkdirp"
import {minify} from "html-minifier"
import comparison from "../src"
import input from "../src/data"
import {mean, median, variance} from "stats-lite"
import numeral from "numeral"

const samples = Number(process.env.BENCHMARK_SAMPLES) || 5
const results = comparison({samples}).map((result, index) => ({
    rank: index + 1,
    md5: crypto.createHash("md5").update(result.bin).digest("hex").toUpperCase().substring(0, 4),
    sampleStats: {
        Mean: `${numeral(mean(result.sampleTimes)).format("0.[00]")} ms`,
        Median: `${numeral(median(result.sampleTimes)).format("0.[00]")} ms`,
        Min: `${Math.min(...result.sampleTimes)} ms`,
        Max: `${Math.max(...result.sampleTimes)} ms`,
        Variance: numeral(variance(result.sampleTimes)).format("0.[00]")
    },
    ...result
}))

const encoderHeaders = {}
for (const result of results) {
    for (const [encoderName, text] of Object.entries(result.encoders)) {
        if (!encoderHeaders[encoderName]) {
            encoderHeaders[encoderName] = {
                alias: `${encoderName} size`,
                getter: encoderResult => encoderResult.encoders[encoderName]?.length || "?"
            }
        }
    }
}

const template = fs.readFileSync(path.resolve(__dirname, "template.ejs"), "utf8")
const iconUrl = `data:image/png;base64,${fs.readFileSync(path.resolve("config", "icon.png")).toString("base64")}`

const html = ejs.render(template, {
    results,
    encoderHeaders,
    iconUrl,
    samples,
    input: JSON.stringify(input, null),
    manifest: require(path.resolve("package.json"))
})

mkdirp(path.resolve("dist"))
fs.writeFileSync(path.resolve("dist", "index.html"), minify(html, {
    removeAttributeQuotes: true,
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    decodeEntities: true,
    minifyCSS: true,
    minifyJS: true,
    minifyURLs: true,
    removeRedundantAttributes: true,
    sortAttributes: true,
    sortClassName: true,
    useShortDoctype: true
}))
