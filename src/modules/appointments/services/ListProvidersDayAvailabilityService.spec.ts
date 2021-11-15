import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProvidersDayAvailabilityService from "./ListProvidersDayAvailabilityService"


let listProvidersDayAvailabilityService: ListProvidersDayAvailabilityService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('ListProvidersDayAvailability', () => {

    beforeEach(() =>{
        
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProvidersDayAvailabilityService = new ListProvidersDayAvailabilityService(fakeAppointmentsRepository);
    });

    it('should be able to list the day availability from provider', async () => {
        
        await fakeAppointmentsRepository.create({
            provider_id: 'provider_id',
            user_id: 'eu',
            date: new Date (2021, 4, 20, 13, 0, 0)
        });

        await fakeAppointmentsRepository.create({
            provider_id: 'provider_id',
            user_id: 'eu',
            date: new Date (2021, 4, 20, 14, 0, 0)
        });

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2021, 4, 20, 11, 0, 0).getTime();
        });

        const availability = await listProvidersDayAvailabilityService.execute({
            provider_id: 'provider_id',
            year: 2021,
            month: 5,
            day:20
        });

        expect(availability).toEqual(expect.arrayContaining([
            {hour: 9, available: false },
            {hour: 10, available: false },
            {hour: 11, available: false },
            {hour: 12, available: true },
            {hour: 13, available: false },
            {hour: 14, available: false },
            {hour: 15, available: true },
            {hour: 16, available: true },
        ]))

    });

})