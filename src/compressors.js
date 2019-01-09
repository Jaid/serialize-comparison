import lzString from "lz-string"
import pako from "pako"
import lzjs from "lzjs"
import compressJs from "compressjs"
import iltorb from "iltorb"

const zlibDictionaries = {
  json: "0123456789LNPWZUDACRJVEMqTIjS#kzwxv_{}f-gbhmdupc/ yl.oraistne,:\"",
  json5: "0123456789L`Rq^zNOPIAMCDjET[]Skw_#vx{}fbhg/-mupdcly .roistane:,'",
  yaml: "0123456789XAPRGkOv>FLCxUbzwWTNjI)(ySdEhfM/_pg-cu;s'm.te:ro\nnali "
}

const compressors = [
  {
    compress: text => text,
    name: "(uncompressed)"
  },
  {
    compress: text => text instanceof Buffer ? null : lzString.compress(text),
    name: "lz-string",
    link: "https://github.com/pieroxy/lz-string"
  },
  {
    compress: text => pako.deflate(text),
    name: "pako.deflate",
    link: "http://nodeca.github.io/pako"
  },
  {
    compress: text => pako.gzip(text, {ignore_os: true}),
    name: "pako.gzip",
    link: "http://nodeca.github.io/pako"
  },
  {
    compress: text => lzjs.compress(text),
    name: "lzjs",
    link: "https://github.com/polygonplanet/lzjs"
  },
  {
    compress: text => iltorb.compressSync(text),
    name: "brotli-default",
    link: "https://github.com/MayhemYDG/iltorb"
  },
  {
    compress: text => iltorb.compressSync(text, {
      mode: 1, // See https://github.com/google/brotli/blob/v1.0.4/c/include/brotli/encode.h#L54
      quality: 11 // See https://github.com/google/brotli/blob/v1.0.4/c/include/brotli/encode.h#L42
    }),
    name: "brotli-configured",
    link: "https://github.com/MayhemYDG/iltorb"
  }
]

for (const [compressorName, object] of Object.entries(compressJs)) {
  if (object ?.compressFile) {
    compressors.push({
      compress: text => object.compressFile(Buffer.from(text)),
      name: `compressjs.${compressorName}`,
      link: `https://github.com/cscott/compressjs/blob/master/lib/${compressorName}.js`
    })
  }
}

for (const [dictionaryName, letters] of Object.entries(zlibDictionaries)) {
  compressors.push({
    compress: text => pako.deflate(text, {dictionary: letters}),
    name: `pako.deflate (${dictionaryName} dictionary)`,
    link: "http://zlib.net/manual.html#Advanced"
  })
}

export default compressors
