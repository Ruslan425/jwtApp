import {Router} from "express";
import {getUsers, changeRole, deleteUser} from "../controllers/UtilsController";
import {authMiddleware, checkRole} from "../middelwear/AuthMiddleware";

const utilsRouter = Router()

utilsRouter.get('/get_list',authMiddleware, checkRole, getUsers)
utilsRouter.post('/change_role',authMiddleware, checkRole, changeRole)
utilsRouter.post('/delete_user', authMiddleware, checkRole, deleteUser)

export default utilsRouter