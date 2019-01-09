// Inserts additional properties into result objects

import crypto from "crypto"

import {mean, median, variance} from "stats-lite"
import numeral from "numeral"

export default results => results.map((result, index) => ({
  rank: index + 1,
  md5: crypto.createHash("md5").update(result.bin).digest("hex").toUpperCase().substring(0, 4),
  sampleStats: result.sampleTimes ? {
    Mean: `${numeral(mean(result.sampleTimes)).format("0.[00]")} ms`,
    Median: `${numeral(median(result.sampleTimes)).format("0.[00]")} ms`,
    Min: `${Math.min(...result.sampleTimes)} ms`,
    Max: `${Math.max(...result.sampleTimes)} ms`,
    Variance: numeral(variance(result.sampleTimes)).format("0.[00]")
  } : undefined,
  ...result
}))