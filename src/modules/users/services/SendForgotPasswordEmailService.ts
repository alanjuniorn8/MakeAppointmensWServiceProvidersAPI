import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

import User from '../infra/typeorm/entities/User'
import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe';


interface IRequest {
    email: string;
}

@injectable()
class SendForgotPasswordEmailService {


    constructor(
        @inject('UsersRepository') 
        private usersRepository: IUsersRepository,

        @inject('UserTokensRepository') 
        private userTokensRepository: IUserTokensRepository,

        @inject('MailProvider') 
        private mailProvider: IMailProvider,
    ) {}

    public async execute({ email }: IRequest): Promise<void>{

        const user = await this.usersRepository.findByEmail(email);

        if(!user) throw new AppError('User does not exists');

        const userToken = this.userTokensRepository.generate(user.id);

        this.mailProvider.sendMail(email, 'Request received.');

    }

}

export default SendForgotPasswordEmailService;