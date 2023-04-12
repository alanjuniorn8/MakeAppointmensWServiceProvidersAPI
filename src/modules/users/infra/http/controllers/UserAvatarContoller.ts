import { Request, Response } from 'express';
import { container } from "tsyringe";
import { classToClass } from 'class-transformer';

import UpdateUserAvatarSevice from "@modules/users/services/UpdateUserAvatarService";


export default class UserAvatarController {
    public async update( request: Request, response: Response): Promise<Response> {
        const UpdateUserAvatar = container.resolve(UpdateUserAvatarSevice);

        const user = await UpdateUserAvatar.execute({
            user_id: request.user.id,
            avatarFileName: request.file.filename,
        });

        delete user.password;

        return response.json(classToClass(user));
    }
}