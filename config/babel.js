const isDevelopment = process.env.NODE_ENV !== "production"

const config = {}

const presets = [
  [
    "@babel/env", {
      targets: {
        node: "current"
      }
    }
  ]
]

const plugins = ["@babel/proposal-optional-chaining"]

if (isDevelopment) {
  config.sourceMaps = "inline"
} else {
  plugins.push("lodash")
  plugins.push("module:faster.js")
  presets.push("minify")
  config.comments = false
}

Object.assign(config, {
  presets,
  plugins
})

module.exports = config