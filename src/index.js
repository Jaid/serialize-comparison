import lodash from "lodash"
import defaultData from "./data"
import defaultFormats from "./formats"
import defaultCompressors from "./compressors"
import defaultEncoders from "./encoders"

export default (options = {}) => {
    options = {
        data: defaultData,
        formats: defaultFormats,
        compressors: defaultCompressors,
        encoders: defaultEncoders,
        ...options
    }

    const results = []

    const test = (name, func) => {
        const startTime = Number(new Date)
        const result = func()
        if (!result.encoders) {
            result.encoders = {}
        }

        for (const [encoderName, encoderFunction] of Object.entries(options.encoders)) {
            if (!result.encoders[encoderName]) {
                result.encoders[encoderName] = encoderFunction(result.bin)
            }
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

    return lodash.orderBy(results, [result => result.bin.length])
}
