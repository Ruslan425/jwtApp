import { Router } from "express";
import { check } from "express-validator";
import {login, logout, refresh, registration} from "../controllers/AuthController";

const authRouter = Router();

authRouter.post('/reg',[
    check('username', 'Не верная почта').isEmail(),
    check('password', 'Пароль не может быть меньше 8 символов').isLength({min: 8})
], registration);
authRouter.post('/login', login);

authRouter.get('/logout', logout)

authRouter.post('/refresh', refresh)


export default authRouter;

