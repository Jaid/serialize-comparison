import lzString from "lz-string"
import pako from "pako"
import lzjs from "lzjs"
import compressJs from "compressjs"

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
    pako: text => ({
        bin: pako.deflate(text)
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

export default compressors
