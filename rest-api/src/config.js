import { resolve as resolvePath } from "path"

require("dotenv").config({
    path: resolvePath(__dirname, "../.env")
})

const { PORT, NODE_ENV, CRA_BUILD_PATH, DB_URI } = process.env

const isProduction = NODE_ENV === "production"
const port = PORT || 3000
const craPath = resolvePath(
    __dirname,
    CRA_BUILD_PATH || "../../front-end/build"
)

export { port, isProduction, craPath, DB_URI as dbUri }
