import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProvidersMonthAvailabilityService from "./ListProvidersMonthAvailabilityService"


let listProvidersMonthAvailabilityService: ListProvidersMonthAvailabilityService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('ListProvidersMonthAvailability', () => {

    beforeEach(() =>{
        
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProvidersMonthAvailabilityService = new ListProvidersMonthAvailabilityService(fakeAppointmentsRepository);
    });

    it('should be able to list the month availability from provider', async () => {
        
        let i = 8;
        
        while(i != 18 ){
            await fakeAppointmentsRepository.create({
                provider_id: 'provider_id',
                user_id: 'eu',
                date: new Date (2021, 4, 20, i, 0, 0)
            });

            i++
        }
        
        await fakeAppointmentsRepository.create({
            provider_id: 'provider_id',
            user_id: 'eu',
            date: new Date (2021, 4, 21, 8, 0, 0)
        });

        const availability = await listProvidersMonthAvailabilityService.execute({
            provider_id: 'provider_id',
            year: 2021,
            month: 5
        });

        expect(availability).toEqual(expect.arrayContaining([
            {day: 19, available: true },
            {day: 20, available: false },
            {day: 21, available: true },
            {day: 22, available: true },
        ]))

    });

})