import { Router } from "express";

import SessionsController from "../conrollers/SessionsCotroller"

const sessionsRouter = Router();
const sessionsController = new SessionsController();

sessionsRouter.post('/', sessionsController.create);

export default sessionsRouter;