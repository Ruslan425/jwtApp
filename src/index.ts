import start from './app'
import dotnet from "dotenv";
dotnet.config();

const URL = process.env.DB_URL!
const PORT = process.env.PORT || 3000;

try {
    const app = await start(URL)
    app.listen(PORT, () => {
        console.log(`Server start on PORT: ${PORT}`)
    } )
} catch(e) {
    console.log(`Error: ${e}`)
}