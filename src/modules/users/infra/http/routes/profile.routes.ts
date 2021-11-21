import { Router } from "express";
import { celebrate, Segments, Joi } from "celebrate";

import multer from "multer";
import uploadConfig from "@config/upload";

import ProfileController from "../conrollers/ProfileController";
import UserAvatarController from "../conrollers/UserAvatarContoller";


import ensureAuthenticated from "../middlewares/ensureAuthenticated";

const profileRouter = Router();
const profileController = new ProfileController();
const userAvatarController = new UserAvatarController();

const upload = multer(uploadConfig.multer);

profileRouter.use(ensureAuthenticated);

profileRouter.get('/', profileController.show);
profileRouter.put(
    '/',
    celebrate({
        [Segments.BODY]: {
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            old_password: Joi.string().when(
                'password',{ 
                    is: Joi.exist(), 
                    then: Joi.required(), 
                    otherwise: Joi.optional() 
                }),
            password: Joi.string(),
            password_confirmation: Joi.string().valid(Joi.ref('password'))
        }
    }),
    profileController.update
);

profileRouter.patch(
    '/avatar',
    upload.single('avatar'),
    userAvatarController.update
);


export default profileRouter;