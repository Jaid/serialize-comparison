import yaml from "js-yaml"
import jsonpack from "jsonpack"

export default {
    json: input => JSON.stringify(input),
    jsonpack: input => jsonpack.pack(input),
    yaml: input => yaml.safeDump(input, {
        skipInvalid: true,
        indent: 1,
        lineWidth: -1,
        noCompatMode: true,
        styles: {
            "!!null": "canonical"
        }
    }),
    "yaml-condensed": input => yaml.safeDump(input, {
        skipInvalid: true,
        flowLevel: 0,
        condenseFlow: true,
        indent: 1,
        lineWidth: -1,
        noCompatMode: true,
        styles: {
            "!!null": "canonical"
        }
    })
}
