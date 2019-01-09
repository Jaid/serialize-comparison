import yaml from "js-yaml"
import jsonpack from "jsonpack"
import json5 from "json5"
import cson from "cson"
import msgpack from "msgpack5"
import {ProgressivePair} from "@as-com/pson"

export default [
  {
    name: "JSON",
    link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify",
    format: input => JSON.stringify(input)
  },
  {
    name: "CSON",
    link: "https://github.com/groupon/cson-parser",
    format: input => cson.stringify(input)
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
  },
  {
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
  },
  {
    name: "msgpack v5",
    link: "https://github.com/mcollina/msgpack5",
    format: input => msgpack().encode(input)
  },
  {
    name: "PSON",
    link: "https://github.com/as-com/PSON",
    format: input => (new ProgressivePair()).encode(input).compact().toBuffer()
  }
]