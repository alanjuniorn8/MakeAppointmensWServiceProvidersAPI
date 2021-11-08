import { Request, Response } from 'express';
import { container } from "tsyringe";

import UpdateUserAvatarSevice from "@modules/users/sevices/UpdateUserAvatarSevice";


export default class UserAvatarController {
    public async update( request: Request, response: Response): Promise<Response> {
        const UpdateUserAvatar = container.resolve(UpdateUserAvatarSevice);

        const user = await UpdateUserAvatar.execute({
            user_id: request.user.id,
            avatarFileName: request.file.filename,
        });

        delete user.password;

        return response.json({user});
    }
}