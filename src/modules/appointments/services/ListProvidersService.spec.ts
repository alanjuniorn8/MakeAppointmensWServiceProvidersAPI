import AppError from '@shared/errors/AppError'

import FakeUsersRepository from "@modules/users/repositories/fakes/FakeUsersRepository";
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from "./ListProvidersService"

let fakeUsersRepository: FakeUsersRepository;
let listProvidersService: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;


describe('UpdateUserAvatar', () => {

    beforeEach(()=>{
        
        fakeUsersRepository = new FakeUsersRepository();
        fakeCacheProvider = new FakeCacheProvider();

        listProvidersService = new ListProvidersService(fakeUsersRepository, fakeCacheProvider);

    });

    it('should be able to list the providers', async () => {
      
        const user1 = await fakeUsersRepository.create({
            name: 'Jon Doe',
            email: 'jondoe@jondoe.jondoe',
            password: 'jondoe123'
        });

        const user2 = await fakeUsersRepository.create({
            name: 'Jon Trê',
            email: 'jontre@jontre.jontre',
            password: 'jontre123'
        });

        const loggedUser = await fakeUsersRepository.create({
            name: 'Jon Qua',
            email: 'jonqua@jonqua.jonqua',
            password: 'jonqua123'
        });

        const providers = await listProvidersService.execute({
            user_id: loggedUser.id,
        });

        expect(providers).toEqual([
            user1,
            user2
        ]);
    
    });

})