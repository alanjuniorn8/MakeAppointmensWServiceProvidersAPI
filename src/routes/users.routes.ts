import { Router } from "express";
import multer from "multer";
import uploadConfig from "../config/upload";

import CreateUserService from "../services/CreateUserService";
import UpdateUserAvatarSevice from "../services/UpdateUserAvatarSevice";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";

const usersRouter = Router();

const upload = multer(uploadConfig);



usersRouter.post('/', async (request, response)=> {
    
    try {

        const { name, email, password } = request.body;

        const createUser = new CreateUserService();

        const user = await createUser.execute({
            name,
            email,
            password
        });

        delete user.password;
        
        return response.json(user);

    } catch (e){
        const err = e as Error;
        return response.status(400).json({ error: err.message});
    }
    
    
});

usersRouter.patch(
    '/avatar',
    ensureAuthenticated,
    upload.single('avatar'),
    async (request, response)=> {

        const UpdateUserAvatar = new UpdateUserAvatarSevice();

        const user = await UpdateUserAvatar.execute({
            user_id: request.user.id,
            avatarFileName: request.file.filename,
        });

        delete user.password;

        return response.json({user});
});

export default usersRouter;