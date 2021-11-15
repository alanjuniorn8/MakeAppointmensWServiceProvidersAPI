import AppError from '@shared/errors/AppError'

import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';

import UpdateUserAvatarService from "./UpdateUserAvatarService";

let fakeUsersRepository:FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;

let updateUserAvatarService: UpdateUserAvatarService;


describe('UpdateUserAvatar', () => {

    beforeEach(()=>{
        
        fakeUsersRepository = new FakeUsersRepository();
        fakeStorageProvider = new FakeStorageProvider(); 
        
        updateUserAvatarService = new UpdateUserAvatarService(
            fakeUsersRepository, 
            fakeStorageProvider
        );

    });

    it('should be able to update a users avatar', async () => {
      
        const user = await fakeUsersRepository.create({
            name: 'Jon Doe',
            email: 'jondoe@jondoe.jondoe',
            password: 'jondoe123'
        });

        await updateUserAvatarService.execute({
            user_id: user.id,
            avatarFileName: 'avatar.png'
        });

        expect(user.avatar).toBe('avatar.png');
    });

    it('should not be able to update the avatar of a non existing users ', async () => {
        
        await expect(updateUserAvatarService.execute({
            user_id: 'non-existing-id',
            avatarFileName: 'avatar.png'
        })).rejects.toBeInstanceOf(AppError);
    });

    it('should delete old avatar when updating new one', async () => {
       
        const deleteFileFunction = jest.spyOn(fakeStorageProvider, 'deleteFile');

        const user = await fakeUsersRepository.create({
            name: 'Jon Doe',
            email: 'jondoe@jondoe.jondoe',
            password: 'jondoe123'
        });

        await updateUserAvatarService.execute({
            user_id: user.id,
            avatarFileName: 'old-avatar.png'
        });

        await updateUserAvatarService.execute({
            user_id: user.id,
            avatarFileName: 'new-avatar.png'
        });

        expect(deleteFileFunction).toHaveBeenCalledWith('old-avatar.png');
        expect(user.avatar).toBe('new-avatar.png');
    });


})