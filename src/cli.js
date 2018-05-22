#!/usr/bin/env node
import comparison from "."
import enhanceResults from "./enhanceResults"

import fs from "fs"
import crypto from "crypto"
import lodash from "lodash"
import table from "tty-table"
import cli from "commander"
import csvWriter from "csv-write-stream"

const paddingSum = 2

cli
    .description("Displays the best methods for object serialization and compression")
    .usage("[options]")
    .option("-f, --csv [path]", "Store data as csv in specified file")
    .option("-c, --count [value]", "Number of entries displayed (0 for no limit)", 10)
    .option("-s, --samples [value]", "Number of benchmark samples per test", 10)
    .parse(process.argv)

let results = enhanceResults(comparison({
    samples: cli.samples
}))

if (cli.count > 0) {
    results = lodash.slice(results, 0, cli.count)
}

const encoderHeaders = {}
for (const result of results) {
    for (const [encoderName] of Object.entries(result.encoders)) {
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

if (cli.csv) {
    const writer = csvWriter({
        headers: [
            "Rank",
            "Serializer",
            "Compressing algorithm",
            "Bin size",
            ...Object.values(encoderHeaders).map(header => header.alias),
            "Speed",
            "MD5"
        ]
    })
    writer.pipe(fs.createWriteStream(cli.csv))
    for (const result of results) {
        writer.write([
            result.rank,
            result.formatter.name,
            result.compressor.name,
            result.bin.length,
            ...Object.values(encoderHeaders).map(header => header.formatter(result.encoders)),
            result.time,
            result.md5
        ])
    }

    writer.end()
}

results = results.map(result => ({
    ...result,
    time: result.time || "< 1"
}))

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
        value: "md5",
        width: 4 + paddingSum
    }
], results).render())
