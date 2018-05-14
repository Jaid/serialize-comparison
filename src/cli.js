import comparison from "./index"

import crypto from "crypto"
import lodash from "lodash"

const results = comparison()

/*
 * console.log(table([
 * {
 * alias: "Method",
 * value: "name",
 * align: "left"
 * },
 * {
 * alias: "MD5",
 * value: "bin",
 * formatter: bin => crypto.createHash("md5").update(bin).digest("hex").substring(0, 4),
 * width: 6
 * },
 * {
 * alias: "Hash-safe size",
 * value: "hashSafe",
 * formatter: hashSafe => hashSafe?.length,
 * width: 11,
 * align: "right"
 * },
 * {
 * alias: "Bin size",
 * value: "bin",
 * formatter: bin => bin?.length,
 * width: 11,
 * align: "right"
 * },
 * {
 * alias: "Time",
 * value: "time",
 * align: "right",
 * width: 8,
 * formatter: value => `${value} ms`
 * }
 * ], lodash.slice(results, 0, 20)).render())
 */

console.log(`winner: ${results[0].name}`)
