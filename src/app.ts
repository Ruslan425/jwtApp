import express, {Express} from 'express';
import authRouter from './routers/authRouter';
import mongoose from "mongoose";

export default async function start(url: string){

    const app: Express = express()
    await mongoose.connect(url)

    app.use(express.json())
    app.use('/auth', authRouter)

    return app
}

