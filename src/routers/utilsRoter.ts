import {Router} from "express";
import {getUsersList, changeRole} from "../controllers/UtilsController";
import {authMiddleware, checkRole} from "../middelwear/AuthMiddleware";

const utilsRouter = Router()

utilsRouter.get('/get_list',authMiddleware, checkRole, getUsersList)
utilsRouter.post('/changeRole',authMiddleware, checkRole, changeRole)

export default utilsRouter