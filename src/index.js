const safeChars = "123456789" + "ABCDEFGHJKLMNPQRSTUVWXYZ" + "abcdefghijkmnopqrstuvwxyz" + "!$&'()*+,;=" + "-._~:@/?" // eslint-disable-line no-useless-concat

import baseX from "base-x"
import lodash from "lodash"
import defaultData from "./data"
import defaultFormats from "./formats"
import defaultCompressors from "./compressors"

const base77 = baseX(safeChars)

export default (options = {}) => {
    options = {
        data: defaultData,
        formats: defaultFormats,
        compressors: defaultCompressors,
        hashSafeEncode: bin => base77.encode(bin),
        ...options
    }

    const results = []

    const test = (name, func) => {
        const startTime = Number(new Date)
        const result = func()
        if (!result.hashSafe) {
            result.hashSafe = options.hashSafeEncode(result.bin)
        }

        const time = (Number(new Date) - startTime) || "< 1"
        results.push({
            name,
            time,
            ...result
        })
    }

    for (const [compressorName, compressorFunction] of Object.entries(options.compressors)) {
        for (const [formatName, formatFunction] of Object.entries(options.formats)) {
            test(`${formatName} → ${compressorName}`, () => compressorFunction(formatFunction(options.data)))
        }
    }

    return lodash.orderBy(results, [result => result.hashSafe?.length])
}
