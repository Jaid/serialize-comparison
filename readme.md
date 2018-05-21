<h1 align="center">
  <a href="https://serialize-comparison.j4id.com">
  <img src="./config/icon.png" alt="Logo">
  </a>
  serialize-comparison
</h1>

[![MIT License](https://img.shields.io/badge/license-MIT-brightgreen.svg)](./license.txt)
[![Travis build](https://travis-ci.org/Jaid/serialize-comparison.svg)](https://travis-ci.org/Jaid/serialize-comparison)
[![npm package](https://img.shields.io/npm/v/serialize-comparison.svg)](https://www.npmjs.com/package/serialize-comparison)
[![Website](https://img.shields.io/badge/page-j4id.com-blue.svg)](http://serialize-comparison.j4id.com)
[![Donate button](https://img.shields.io/badge/donate-PayPal-ff0080.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RW8UHK5ZG3BX4)

I was looking for a quick and efficient method of compressing a JavaScript object into a url-safe (actually [url-fragment-safe](https://stackoverflow.com/a/2849800), which seems to allow 77 different characters) string. This was needed to convert a React component state into a permalink (like `example.com/#setStateWithUrlFragmentData`), although React component states are just plain JavaScript objects, so this project is not framework-depended.

The comparison base currently contains over 160 different methods of compressing objects into strings and corresponding scripts to test those methods regarding performance and compression rate.

You can find the latest test results over here: [serialize-comparison.j4id.com](https://serialize-comparison.j4id.com)

## Winner

#### Compression winner

The most efficient way of compressing objects turned out to be using [`msgpack5`](https://github.com/mcollina/msgpack5) as serializer and [`compressjs.PPM.compressFile`](https://github.com/cscott/compressjs/blob/master/lib/PPM.js) as compression algorithm. The PPM compressor performs pretty fast and gives insane compression results for a wide spectrum of input data.

Example:

```js
import msgpack from "msgpack5"
import { PPM } from "compressjs"

const data = {a: "a", b: 2}
const dataPacked = msgpack().encode(data))
const compressed = Buffer.from(PPM.compressFile(dataPacked)).toString("base64")
// compressed = "cHBtMomCeMnJ+l4CAAAM"
```

#### Overall winner

The best overall compression method is using [`json5.stringify`](https://github.com/json5/json5) as serializer and [`pako.deflate`](http://nodeca.github.io/pako) as compression algorithm. [`pako`](https://github.com/nodeca/pako)'s deflate implementation is around 3-10x quicker than [`compressjs`](https://github.com/cscott/compressjs)'s PPM implementation and provides almost the same compression rate.

Example:

```js
import json5 from "json5"
import { deflate } from "pako"

const data = {a: "a", b: 2}
const jsonBin = Buffer.from(json5.stringify(data))
const compressed = Buffer.from(deflate(jsonBin)).toString("base64")
// compressed = "eJyrTrRST1TXSbIyqgUAE+QDPQ=="
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

![CLI Screenshot](https://i.imgur.com/X95JaYi.png)

## License

Copyright © 2018  
Licensed under [MIT](./license.txt)  
Jaid ([github.com/Jaid](https://github.com/Jaid))  
