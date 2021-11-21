import AppError from '@shared/errors/AppError'

import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import CreateUserService from "./CreateUserService";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;

let createUserService: CreateUserService;

describe('CreateUser', () => {

    beforeEach(()=>{

        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeCacheProvider= new FakeCacheProvider();

        createUserService = new CreateUserService(
            fakeUsersRepository, 
            fakeHashProvider,
            fakeCacheProvider
        );

    });

    it('should be able to create a new user', async () => {
        
        const user = await createUserService.execute({
            name: 'tester',
            email: 'tester@test.com.br',
            password: 'teste123'
        });

        expect(user).toHaveProperty('id');
        expect(user.name).toBe('tester');
    });

    it('should not be able to create a new user with already used email', async () => {

        await createUserService.execute({
            name: 'tester',
            email: 'tester@test.com.br',
            password: 'teste123'
        });

        await expect(createUserService.execute({
            name: 'tester',
            email: 'tester@test.com.br',
            password: 'teste123'
        })).rejects.toBeInstanceOf(AppError);
    });

})