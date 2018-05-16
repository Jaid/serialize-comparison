import comparison from "./index"

import crypto from "crypto"
import lodash from "lodash"
import table from "tty-table"

const paddingSum = 3

const results = comparison()
const topResults = lodash.slice(results, 0, 20).map((result, index) => ({
    rank: index + 1,
    ...result
}))

const encoderHeaders = {}
for (const result of topResults) {
    for (const [encoderName, text] of Object.entries(result.encoders)) {
        if (!encoderHeaders[encoderName]) {
            encoderHeaders[encoderName] = {
                alias: `${encoderName} size`,
                value: "encoders",
                formatter: encoders => encoders[encoderName]?.length,
                align: "right",
                width: encoderName.length + paddingSum
            }
        }
    }
}

console.log(table([
    {
        alias: "Rank",
        value: "rank",
        align: "right",
        width: "Rank".length + paddingSum
    },
    {
        alias: "Method",
        value: "name",
        align: "left",
        width: 30
    },
    {
        alias: "Bin size",
        value: "bin",
        formatter: bin => bin?.length,
        width: "Bin size".length + paddingSum,
        align: "right"
    },
    ...Object.values(encoderHeaders),
    {
        alias: "Speed",
        value: "time",
        align: "right",
        width: "Speed".length + paddingSum,
        formatter: value => `${value} ms`
    },
    {
        alias: "MD5",
        value: "bin",
        formatter: bin => crypto.createHash("md5").update(bin).digest("hex").toUpperCase().substring(0, 4),
        width: 4 + paddingSum
    }
], topResults).render())

console.log(`winner: ${results[0].name}`)
