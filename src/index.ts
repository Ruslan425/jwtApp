import app from './app.js'
import mongoose from 'mongoose';
const PORT = process.env.PORT || 3000;

export async function start(url: string){
    try {
        await mongoose.connect(url)
        app.listen(PORT, () => {
            console.log(`Server start on PORT: ${PORT}`)
        } )
    } catch(e) {
        console.log(`Error: ${e}`)
    }
}

const url = process.env.DB_URL!

start(url).then(r => {})