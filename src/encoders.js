
import baseX from "base-x"

const safeChars = "123456789" + "ABCDEFGHJKLMNPQRSTUVWXYZ" + "abcdefghijkmnopqrstuvwxyz" + "!$&'()*+,;=" + "-._~:@/?" // eslint-disable-line no-useless-concat
const base77 = baseX(safeChars)

export default {
    "hash-safe": bin => base77.encode(bin)
}
