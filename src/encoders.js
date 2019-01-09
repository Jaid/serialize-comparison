
import baseX from "base-x"

// https://stackoverflow.com/a/2849800
const safeChars = "123456789" + "ABCDEFGHJKLMNPQRSTUVWXYZ" + "abcdefghijkmnopqrstuvwxyz" + "!$&'()*+,;=" + "-._~:@/?" // eslint-disable-line no-useless-concat
const base77 = baseX(safeChars)

export default {
  "fragment-safe": bin => base77.encode(bin),
  base64: bin => bin.toString("base64")
}