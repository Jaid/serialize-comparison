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
        samples: 10,
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

        const time = (Number(new Date) - startTime) || 1

        return {
            name: `${formatter.name} > ${compressor.name}`,
            time,
            ...result
        }
    }

    for (const compressor of options.compressors) {
        for (const formatter of options.formatters) {
            if (options.samples > 1) {
                let timeSum = 0
                let result = null
                for (let i = 0; i !== options.samples; i++) {
                    result = test(options.data, formatter, compressor)
                    timeSum += result.time
                }

                results.push({
                    ...result,
                    time: Math.round(timeSum / options.samples)
                })
            } else {
                results.push(test(options.data, formatter, compressor))
            }
        }
    }

    return lodash.orderBy(results, [result => result.bin.length])
}
