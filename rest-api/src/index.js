import { port } from "./config"
import app from "./app"

app.listen(port, () => {
    console.log(`Create React App => http://localhost:${port}`)
    console.log(`REST API => http://localhost:${port}/api`)
})
