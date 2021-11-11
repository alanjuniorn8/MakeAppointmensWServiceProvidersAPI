import AppError from '@shared/errors/AppError'

import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import CreateUserService from "./CreateUserService";

describe('CreateUser', () => {
    it('should be able to create a new user', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider()

        const createUserService = new CreateUserService(fakeUsersRepository, fakeHashProvider);

        const user = await createUserService.execute({
            name: 'tester',
            email: 'tester@test.com.br',
            password: 'teste123'
        });

        expect(user).toHaveProperty('id');
        expect(user.name).toBe('tester');
    });

    it('should not be able to create a new user with already used email', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider()

        const createUserService = new CreateUserService(fakeUsersRepository, fakeHashProvider);

        await createUserService.execute({
            name: 'tester',
            email: 'tester@test.com.br',
            password: 'teste123'
        });

        expect(createUserService.execute({
            name: 'tester',
            email: 'tester@test.com.br',
            password: 'teste123'
        })).rejects.toBeInstanceOf(AppError);
    });

})