import AppError from '@shared/errors/AppError'

import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";

import ShowProfileService from "./ShowProfileService"

let fakeUsersRepository: FakeUsersRepository;
let showProfileService: ShowProfileService


describe('UpdateUserAvatar', () => {

    beforeEach(()=>{
        
        fakeUsersRepository = new FakeUsersRepository();
        showProfileService = new ShowProfileService(fakeUsersRepository);

    });

    it('should be able to show user profile', async () => {
      
        const createdUser = await fakeUsersRepository.create({
            name: 'Jon Doe',
            email: 'jondoe@jondoe.jondoe',
            password: 'jondoe123'
        });

        const user = await showProfileService.execute({
            user_id: createdUser.id,
        });

        expect(user.name).toBe('Jon Doe');
        expect(user.email).toBe('jondoe@jondoe.jondoe');
    });

    it('should not be able to show a non-existing user profile', async () => {

        await expect(showProfileService.execute({
            user_id: 'non-existing-id'
        })).rejects.toBeInstanceOf(AppError);
    });

})