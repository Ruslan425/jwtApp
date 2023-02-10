import {Router} from "express";
import UtilsController from "../controllers/UtilsController";

const utilsRouter = Router()

utilsRouter.get('/get_list', UtilsController.getUsersList)

export default utilsRouter