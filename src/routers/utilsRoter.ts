import {Router} from "express";
import UtilsController from "../controllers/UtilsController";
import {authMiddleware, checkRole} from "../middelwear/AuthMiddleware";

const utilsRouter = Router()

utilsRouter.get('/get_list',authMiddleware, checkRole, UtilsController.getUsersList)

export default utilsRouter