import AppError from '@shared/errors/AppError'

import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import ResetPasswordService from "./ResetPasswordService";


let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPasswordService: ResetPasswordService;


describe('ResetPassword', () => {

    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokensRepository= new FakeUserTokensRepository();
        fakeHashProvider = new FakeHashProvider();

        resetPasswordService = new ResetPasswordService(fakeUsersRepository, fakeUserTokensRepository, fakeHashProvider);

    });
    
    it('should be able to reset the password', async () => {

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

        const user = await fakeUsersRepository.create({
            name: 'Jon Doe',
            email: 'jondoe@jondoe.jondoe',
            password: 'senhaAntiga'
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        await resetPasswordService.execute({
            password: 'senhaNova',
            token
        });

        const updatedUser = await fakeUsersRepository.findById(user.id);

        expect(generateHash).toHaveBeenCalledWith('senhaNova');
        expect(updatedUser?.password).toBe('senhaNova');
        
    });

    it('should not be able to reset the password with non-existing token', async () => {
        await expect(resetPasswordService.execute({
            token: 'non-existing-token',
            password: 'password'
        }
        )).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset the password if user does not exist', async () => {
        
        const { token } = await fakeUserTokensRepository.generate('non-existing-user');

        await expect(resetPasswordService.execute({
            token,
            password: 'password'
        }
        )).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset the password if passed more than 2 hours', async () => {
        
        const user = await fakeUsersRepository.create({
            name: 'Jon Doe',
            email: 'jondoe@jondoe.jondoe',
            password: 'senhaAntiga'
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
           
            const customDate = new Date();

            return customDate.setHours(customDate.getHours() + 3) ;
        });

        await expect(resetPasswordService.execute({
            token,
            password: 'password'
        }
        )).rejects.toBeInstanceOf(AppError);
    });

})