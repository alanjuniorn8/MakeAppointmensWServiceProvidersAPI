import AppError from '@shared/errors/AppError'

import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";
import UpdateProfileService from "./UpdateProfileService";

let fakeUsersRepository:FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;

let updateProfileService: UpdateProfileService;


describe('UpdateUserAvatar', () => {

    beforeEach(()=>{
        
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider(); 
        
        updateProfileService = new UpdateProfileService(
            fakeUsersRepository, 
            fakeHashProvider
        );

    });

    it('should be able to update the profile', async () => {
      
        const user = await fakeUsersRepository.create({
            name: 'Jon Doe',
            email: 'jondoe@jondoe.jondoe',
            password: 'jondoe123'
        });

        const updatedUser = await updateProfileService.execute({
            user_id: user.id,
            name:'Jon Trê',
            email: 'jontre@jontre.jontre'
        });

        expect(updatedUser.name).toBe('Jon Trê');
        expect(updatedUser.email).toBe('jontre@jontre.jontre');
    });

    it('should not be able to update the email if it is already being used', async () => {
      
        await fakeUsersRepository.create({
            name: 'Jon Doe',
            email: 'jondoe@jondoe.jondoe',
            password: 'jondoe123'
        });

        const user = await fakeUsersRepository.create({
            name: 'Another Doe',
            email: 'anotherdoe@anotherdoe.anotherdoe',
            password: 'anotherdoe'
        });

        await expect(updateProfileService.execute({
            user_id: user.id,
            name:'Another Trê',
            email: 'jondoe@jondoe.jondoe'
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update the password', async () => {
      
        const user = await fakeUsersRepository.create({
            name: 'Jon Doe',
            email: 'jondoe@jondoe.jondoe',
            password: 'jondoe123'
        });

        const updatedUser = await updateProfileService.execute({
            user_id: user.id,
            name:'Jon Trê',
            email: 'jontre@jontre.jontre',
            old_password: 'jondoe123',
            password: 'jontre123'

        });

        expect(updatedUser.password).toBe('jontre123');
    });

    it('should not be able to update the password without old password', async () => {
      
        const user = await fakeUsersRepository.create({
            name: 'Jon Doe',
            email: 'jondoe@jondoe.jondoe',
            password: 'jondoe123'
        });

        await expect(updateProfileService.execute({
            user_id: user.id,
            name:'Jon Trê',
            email: 'jontre@jontre.jontre',
            password: 'jontre123'

        })).rejects.toBeInstanceOf(AppError);
    });


    it('should not be able to update the password if old password is wrong', async () => {
      
        const user = await fakeUsersRepository.create({
            name: 'Jon Doe',
            email: 'jondoe@jondoe.jondoe',
            password: 'jondoe123'
        });

        await expect(updateProfileService.execute({
            user_id: user.id,
            name:'Jon Trê',
            email: 'jontre@jontre.jontre',
            old_password: 'jondoe12',
            password: 'jontre123'

        })).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update the profile of a non-existing user', async () => {
      
        const user = await fakeUsersRepository.create({
            name: 'Jon Doe',
            email: 'jondoe@jondoe.jondoe',
            password: 'jondoe123'
        });

        await expect(updateProfileService.execute({
            user_id: 'non-existng-id',
            name:'Jon Trê',
            email: 'jontre@jontre.jontre',
            old_password: 'jondoe12',
            password: 'jontre123'

        })).rejects.toBeInstanceOf(AppError);
    });

})