import fs from "fs"
import path from "path"
import ejs from "ejs"
import crypto from "crypto"
import mkdirp from "mkdirp"
import {minify} from "html-minifier"
import comparison from "../src"
import input from "../src/data"

const results = comparison().map((result, index) => ({
    rank: index + 1,
    md5: crypto.createHash("md5").update(result.bin).digest("hex").toUpperCase().substring(0, 4),
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
