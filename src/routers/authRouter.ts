import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import { check } from "express-validator";

const authRouter = Router();

authRouter.post('/reg',[
    check('username', 'Не верная почта').isEmail(),
    check('password', 'Пароль не может быть меньше 8 символов').isLength({min: 8})
], AuthController.reg);
authRouter.post('/login', AuthController.login);

authRouter.post('/ref', AuthController.ref)

authRouter.post('/logout', AuthController.logout)


export default authRouter;

