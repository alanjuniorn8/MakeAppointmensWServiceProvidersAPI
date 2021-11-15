import { Router } from "express";
import multer from "multer";
import uploadConfig from "@config/upload";

import ProfileController from "../conrollers/ProfileController";
import UserAvatarController from "../conrollers/UserAvatarContoller";


import ensureAuthenticated from "../middlewares/ensureAuthenticated";

const profileRouter = Router();
const profileController = new ProfileController();
const userAvatarController = new UserAvatarController();

const upload = multer(uploadConfig);

profileRouter.use(ensureAuthenticated);

profileRouter.get('/', profileController.show);
profileRouter.put('/', profileController.update);

profileRouter.patch(
    '/avatar',
    ensureAuthenticated,
    upload.single('avatar'),
    userAvatarController.update
);


export default profileRouter;