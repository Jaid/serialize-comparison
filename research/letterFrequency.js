import fs from "fs"
import globby from "globby"
import lodash from "lodash"
import chalk from "chalk"
import yaml from "js-yaml"
import json5 from "json5"

const test = (name, glob, formatter) => {
    const files = lodash.slice(lodash.shuffle(globby.sync(glob, {
        deep: 7,
        onlyFiles: true
    })), 0, 10000)

    const map = {}
    for (const file of files) {
        let preparedContent
        try {
            const content = fs.readFileSync(file, "utf8")
            preparedContent = formatter ? formatter(content) : content
        } catch (e) {}

        if (preparedContent) {
            for (const letter of preparedContent) {
                if (!map[letter]) {
                    map[letter] = 0
                }

                map[letter]++
            }
        }
    }

    const top64 = map
    |> Object.entries
    |> value => lodash.orderBy(value, [([letter, count]) => count], ["desc"])
    |> value => lodash.slice(value, 0, 64)
    |> lodash.reverse
    |> lodash.fromPairs
    |> Object.keys
    console.log(chalk`{blue ${name} (${files.length} files): "}{green ${top64.join("")}}{blue "}`)
}

test("json", "../**/*.json", content => JSON.stringify(JSON.parse(content)))
test("json5", "../**/*.json", content => json5.stringify(JSON.parse(content)))
test("yaml", ["../**/*.yml", "../**/*.yaml"], content => yaml.safeDump(yaml.load(content)), {
    skipInvalid: true,
    indent: 1,
    lineWidth: -1,
    noCompatMode: true,
    styles: {
        "!!null": "canonical"
    }
})
