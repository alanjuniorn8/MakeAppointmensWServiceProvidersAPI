import AppError from '@shared/errors/AppError'

import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import SendForgotPasswordEmailService from "./SendForgotPasswordEmailService";


let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;


describe('SendForgotPasswordEmail', () => {

    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokensRepository= new FakeUserTokensRepository();

        fakeMailProvider= new FakeMailProvider();

        sendForgotPasswordEmailService = new SendForgotPasswordEmailService(fakeUsersRepository, fakeUserTokensRepository, fakeMailProvider);

    });
    
    it('should be able to recover the password using the email', async () => {
        const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

        const user = await fakeUsersRepository.create({
            name: 'Jon Doe',
            email: 'jondoe@jondoe.jondoe',
            password: 'jondoe123'
        });

        await sendForgotPasswordEmailService.execute({
            email: 'jondoe@jondoe.jondoe'
        });

        expect(sendMail).toHaveBeenCalled();
        
    });

    it('should not be able to recover a non-existing user password', async () => {

        await expect(
            sendForgotPasswordEmailService.execute({
                email: 'jondoe@jondoe.jondoe'
        })).rejects.toBeInstanceOf(AppError);

    });

    it('should generate a forgot password token', async () => {
        
        const generate = jest.spyOn(fakeUserTokensRepository, 'generate');

        const user = await fakeUsersRepository.create({
            name: 'Jon Doe',
            email: 'jondoe@jondoe.jondoe',
            password: 'jondoe123'
        });

        await sendForgotPasswordEmailService.execute({
            email: 'jondoe@jondoe.jondoe'
        });

        expect(generate).toHaveBeenCalledWith(user.id);
    });

})