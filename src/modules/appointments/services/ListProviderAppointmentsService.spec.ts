import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import ListProviderAppointments from './ListProviderAppointmentsService';

let listProviderAppointments: ListProviderAppointments;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviderAppointments', () => {

    beforeEach(() =>{
        
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        fakeCacheProvider = new FakeCacheProvider();

        listProviderAppointments = new ListProviderAppointments(fakeAppointmentsRepository, fakeCacheProvider);
    });

    it('should be able to list the porvider`s appointments of the day ', async () => {
        
        const appointment1 = await fakeAppointmentsRepository.create({
            provider_id: 'provider_id',
            user_id: 'eu',
            date: new Date (2021, 4, 20, 13, 0, 0)
        });

        const appointment2 = await fakeAppointmentsRepository.create({
            provider_id: 'provider_id',
            user_id: 'eu',
            date: new Date (2021, 4, 20, 14, 0, 0)
        });

        const appointments = await listProviderAppointments.execute({
            provider_id: 'provider_id',
            year: 2021,
            month: 5,
            day:20
        });

        expect(appointments).toEqual(expect.arrayContaining([
            appointment1,
            appointment2
        ]))

    });

})