import { getRepository, Not, Repository } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from "@modules/users/dtos/ICreateUserDTO"

import User from "../entities/User";
import IFindProviderDTO from '@modules/users/dtos/IFindAllProvidersDTO';

class UsersRepository implements IUsersRepository{

    private ormRepository: Repository<User>;

    constructor(){
        this.ormRepository = getRepository(User);
    }

    public async findAllProviders({but}: IFindProviderDTO): Promise<User[]> {
        
        let users: User[];

        if(but){
            users = await this.ormRepository.find({
                where: {
                    id: Not(but)
                }
            });
        } else {
            users = await this.ormRepository.find();
        }

        return users;
    }

    public async findById(id: string): Promise<User | undefined>{

        const user = await this.ormRepository.findOne({ id });

        return user;

    }

    public async findByEmail(email: string): Promise<User | undefined>{
        
        const user = this.ormRepository.findOne({ 
            where: { email } ,
        });

        return user;

    }

    public async create({ name, email, password }: ICreateUserDTO ): Promise<User>{

        const user = this.ormRepository.create({ name, email, password });

        await this.ormRepository.save(user);

        return user;
    }

    public async save(user: User): Promise<User>{
        return this.ormRepository.save(user);
    }
}

export default UsersRepository;