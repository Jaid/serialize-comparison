<h1 align="center">
  <a href="https://serialize-comparison.jaid.codes">
  <img src="./config/icon.png" alt="Logo">
  </a>
  serialize-comparison
</h1>

[![MIT license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](./license.txt)
[![Travis build](https://travis-ci.org/Jaid/serialize-comparison.svg)](https://travis-ci.org/Jaid/serialize-comparison)
[![npm package](https://img.shields.io/npm/v/serialize-comparison.svg)](https://www.npmjs.com/package/serialize-comparison)
[![Website](https://img.shields.io/badge/page-jaid.codes-blue.svg)](http://serialize-comparison.jaid.codes)
[![Donate button](https://img.shields.io/badge/donate-PayPal-ff0080.svg)](https://donate.jaid.codes)

I was looking for a quick and efficient method of compressing a JavaScript object into a url-safe (actually [url-fragment-safe](https://stackoverflow.com/a/2849800), which seems to allow 77 different characters) string. This was needed to convert a React component state into a permalink (like `example.com/#setStateWithUrlFragmentData`), although React component states are just plain JavaScript objects, so this project is not framework-depended.

The comparison base currently contains over 160 different methods of compressing objects into strings and corresponding scripts to test those methods regarding performance and compression rate.

You can find the latest test results over here: [serialize-comparison.jaid.codes](https://serialize-comparison.jaid.codes)

## Winner

The most efficient way of compressing objects turned out to be [`json5`](https://github.com/mcollina/msgpack5) as serializer and [`brotli`](https://github.com/cscott/compressjs/blob/master/lib/PPM.js) as compression algorithm. The Brotli compressor performs pretty fast and gives insane compression results for a wide spectrum of input data.

Example:

```js
import json5 from "json5"
import { compressSync } from "iltorb"

const data = {a: "a", b: 2}
const jsonBin = Buffer.from(json5.stringify(data))
const compressed = Buffer.from(compressSync(jsonBin)).toString("base64")
// compressed = "CwWAe2E6J2EnLGI6Mn0D"
```

#### The search is not over

If you built or know another good [serializer](./src/formatters.js) or [compression algorithm](./src/compressors.js), feel free to suggest it in an [issue](https://github.com/Jaid/serialize-comparison/issues)!

## Command Line

The CLI script runs the tests locally and prints the top 10 (regarding compression ratio) as an ansi-colored table.

npx:
```bash
npx serialize-comparison
```

Yarn:
```bash
yarn global add serialize-comparison
serialize-comparison
```

npm:
```bash
npm install --global serialize-comparison
serialize-comparison
```

![CLI Screenshot](https://i.imgur.com/OczUpoo.png)

## License

Copyright © 2019
Licensed under [MIT](./license.txt)
Jaid ([github.com/Jaid](https://github.com/Jaid))
