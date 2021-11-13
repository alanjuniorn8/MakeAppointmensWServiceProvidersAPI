import { Router } from "express";

import ForgotPasswordControler from "../conrollers/ForgotPasswordController";
import ResetPasswordControler from "../conrollers/ResetPasswordController";


const passwordRouter = Router();
const forgotPasswordController = new ForgotPasswordControler();
const resetPasswordController = new ResetPasswordControler();


passwordRouter.post('/forgot', forgotPasswordController.create);
passwordRouter.post('/reset', resetPasswordController.create);

export default passwordRouter;