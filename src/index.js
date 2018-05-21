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
        let compressed = compressor.compress(Buffer.from(serialized))
        if (compressed === null) {
            return null
        }

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
            let result = test(options.data, formatter, compressor)
            if (!result) {
                continue
            }

            if (options.samples > 1) {
                const sampleTimes = [
                    result.time, ...lodash.times(options.samples - 1, () => {
                        result = test(options.data, formatter, compressor)
                        return result.time
                    })
                ]

                results.push({
                    sampleTimes,
                    ...result,
                    time: Math.round(sampleTimes.reduce((accumulator, value) => accumulator + value, 0) / sampleTimes.length)
                })
            } else {
                results.push(result)
            }
        }
    }

    return lodash.orderBy(results, [result => result.bin.length])
}
