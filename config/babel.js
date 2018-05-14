const isDevelopment = process.env.NODE_ENV !== "production"

const config = {}

const presets = [
    [
        "@babel/env", {
            targets: {
                node: "6.10"
            }
        }
    ],
    ["@babel/stage-1", {decoratorsLegacy: true}] // https://github.com/babel/babel/issues/7786
]

const plugins = []

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
