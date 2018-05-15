import yaml from "js-yaml"
import jsonpack from "jsonpack"
import json5 from "json5"

export default [
    {
        name: "JSON",
        link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify",
        format: input => JSON.stringify(input)
    },
    {
        name: "json5",
        link: "https://github.com/json5/json5",
        format: input => json5.stringify(input)
    },
    {
        name: "jsonpack",
        link: "https://github.com/sapienlab/jsonpack",
        format: input => jsonpack.pack(input)
    },
    {
        name: "js-yaml (line breaks)",
        link: "https://github.com/nodeca/js-yaml",
        format: input => yaml.safeDump(input, {
            skipInvalid: true,
            indent: 1,
            lineWidth: -1,
            noCompatMode: true,
            styles: {
                "!!null": "canonical"
            }
        })
    }, {
        name: "js-yaml (condensed)",
        link: "https://github.com/nodeca/js-yaml",
        format: input => yaml.safeDump(input, {
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
]
