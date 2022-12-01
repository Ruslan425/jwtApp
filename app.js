import express from 'express';
import authRouter from './routers/authRouter.js';
import dotnet from "dotenv";




const app = express()
dotnet.config(); 

app.use(express.json())
app.use('/auth', authRouter)



export default app;
