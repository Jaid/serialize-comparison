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
        let compressed = compressor.compress(serialized)
        if (!(compressed instanceof Buffer)) {
            compressed = Buffer.from(compressed)
        }

        const result = {
            compressor,
            formatter,
            bin: compressed,
            encoders: {}
        }

        for (const [encoderName, encoderFunction] of Object.entries(options.encoders)) {
            if (!result.encoders[encoderName]) {
                result.encoders[encoderName] = encoderFunction(result.bin)
            }
        }

        return {
            name: `${formatter.name} > ${compressor.name}`,
            time: Number(new Date) - startTime,
            ...result
        }
    }

    for (const compressor of options.compressors) {
        for (const formatter of options.formatters) {
            if (options.samples > 1) {
                let result = null
                const sampleTimes = lodash.times(options.samples, () => {
                    result = test(options.data, formatter, compressor)
                    return result.time
                })

                results.push({
                    sampleTimes,
                    ...result,
                    time: Math.round(sampleTimes.reduce((accumulator, value) => accumulator + value, 0) / sampleTimes.length)
                })
            } else {
                results.push(test(options.data, formatter, compressor))
            }
        }
    }

    return lodash.orderBy(results, [result => result.bin.length])
}
