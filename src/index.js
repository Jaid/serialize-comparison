import lodash from "lodash"
import defaultData from "./data"
import defaultFormatters from "./formatters"
import defaultCompressors from "./compressors"
import defaultEncoders from "./encoders"

export default (options = {}) => {
    options = {
        data: defaultData,
        formatters: defaultFormatters,
        compressors: defaultCompressors,
        encoders: defaultEncoders,
        ...options
    }

    const results = []

    const test = (data, formatter, compressor) => {
        const startTime = Number(new Date)
        const serialized = formatter.format(data)
        const result = {
            compressor,
            formatter,
            bin: compressor.compress(serialized),
            encoders: {}
        }

        for (const [encoderName, encoderFunction] of Object.entries(options.encoders)) {
            if (!result.encoders[encoderName]) {
                result.encoders[encoderName] = encoderFunction(result.bin)
            }
        }

        const time = (Number(new Date) - startTime) || "< 1"

        results.push({
            name: `${formatter.name} > ${compressor.name}`,
            time,
            ...result
        })
    }

    for (const compressor of options.compressors) {
        for (const formatter of options.formatters) {
            test(options.data, formatter, compressor)
        }
    }

    return lodash.orderBy(results, [result => result.bin.length])
}
