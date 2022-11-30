import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import { check } from "express-validator";

const authRouter = new Router();

authRouter.post('/reg',[
    check('username', 'Не верная почта').isEmail(),
    check('password', 'Пароль не может быть меньше 8 символов').isLength({min: 8})
], AuthController.reg);
authRouter.post('/login', AuthController.login);


export default authRouter;

