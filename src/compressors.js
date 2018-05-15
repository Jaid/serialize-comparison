import lzString from "lz-string"
import pako from "pako"
import lzjs from "lzjs"
import compressJs from "compressjs"

const zlibDictionaries = {
    json: "0123456789LNPWZUDACRJVEMqTIjS#kzwxv_{}f-gbhmdupc/ yl.oraistne,:\"",
    json5: "0123456789L`Rq^zNOPIAMCDjET[]Skw_#vx{}fbhg/-mupdcly .roistane:,'",
    yaml: "0123456789XAPRGkOv>FLCxUbzwWTNjI)(ySdEhfM/_pg-cu;s'm.te:ro\nnali "
}

const compressors = {
    uncompressed: text => ({
        bin: Buffer.from(text)
    }),
    "lz-string (internal)": text => ({
        bin: text,
        hashSafe: lzString.compressToEncodedURIComponent(text)
    }),
    "lz-string": text => ({
        bin: Buffer.from(lzString.compress(text))
    }),
    "pako.deflate": text => ({
        bin: pako.deflate(text)
    }),
    "pako.gzip": text => ({
        bin: pako.gzip(text, {ignore_os: true})
    }),
    lzjs: text => ({
        bin: Buffer.from(lzjs.compress(text))
    })
}

for (const [compressorName, object] of Object.entries(compressJs)) {
    if (object?.compressFile) {
        compressors[`compressjs.${compressorName}`] = text => ({
            bin: object.compressFile(Buffer.from(text))
        })
    }
}

for (const [dictionaryName, letters] of Object.entries(zlibDictionaries)) {
    compressors[`pako.deflate (${dictionaryName} dictionary)`] = text => ({
        bin: pako.deflate(text, {dictionary: letters})
    })
}

export default compressors
