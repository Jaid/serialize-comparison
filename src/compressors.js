import lzString from "lz-string"
import pako from "pako"
import lzjs from "lzjs"
import compressJs from "compressjs"

const zlibDictionaries = {
    json: "0123456789LNPWZUDACRJVEMqTIjS#kzwxv_{}f-gbhmdupc/ yl.oraistne,:\"",
    json5: "0123456789L`Rq^zNOPIAMCDjET[]Skw_#vx{}fbhg/-mupdcly .roistane:,'",
    yaml: "0123456789XAPRGkOv>FLCxUbzwWTNjI)(ySdEhfM/_pg-cu;s'm.te:ro\nnali "
}

const compressors = [
    {
        compress: text => Buffer.from(text),
        name: "(uncompressed)"
    },
    {
        compress: text => Buffer.from(lzString.compress(text)),
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
        compress: text => Buffer.from(lzjs.compress(text)),
        name: "lzjs",
        link: "https://github.com/polygonplanet/lzjs"
    }
]

for (const [compressorName, object] of Object.entries(compressJs)) {
    if (object?.compressFile) {
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
