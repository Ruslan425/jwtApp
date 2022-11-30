import app from './app.js'
import mongoose from 'mongoose';
const PORT = process.env.PORT || 5000;



async function start() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.5.1')
        app.listen(PORT, () => {
            console.log(`Server start on PORT: ${PORT}`)
        } )
    } catch(e) {
        console.log(`Error: ${e}`)
    }
}

start()