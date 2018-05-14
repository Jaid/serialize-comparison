const isDevelopment = process.env.NODE_ENV !== "production"

import webpack from "webpack"
import manifest from "../package.json"
import path from "path"

const config = {
    mode: isDevelopment ? "development" : "production",
    target: "node",
    entry: {
        index: path.resolve("src", "index.js"),
        cli: path.resolve("src", "cli.js")
    },
    output: {
        path: path.resolve("build"),
        library: "url-fragment-serialize-comparison",
        libraryTarget: "umd"
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules\//,
                use: "babel-loader"
            }
        ]
    },
    externals: Object.keys(manifest.dependencies).reduce((object, current) => {
        object[current] = current; return object
    }, {})
}

if (isDevelopment) {
    config.devtool = "eval"
} else {
    config.plugins = [
        new webpack.BannerPlugin({
            banner: `@license MIT\nCopyright © ${(new Date).getFullYear()} ${manifest.author.name}\n${manifest.name} v${manifest.version}\n${manifest.homepage || manifest.repository.url}`,
            entryOnly: true
        })
    ]
}

module.exports = config
