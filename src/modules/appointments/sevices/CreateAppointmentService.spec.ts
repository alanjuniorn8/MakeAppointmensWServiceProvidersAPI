import FakeAppointmentsRepository from "../repositories/fakes/FakeAppointmentsRepository"; 
import CreateAppointmentService from "./CreateAppointmentService";

describe('CreateAppointment', () => {
    it('should be able to create a new appointment', async () => {
        const fakeAppointmentsRepository = new FakeAppointmentsRepository();

        const createAppointment = new CreateAppointmentService(fakeAppointmentsRepository);

        const appointment = await createAppointment.execute({
            date: new Date(2021, 4, 10, 11),
            provider_id: '123384934832880'
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('123384934832880');
    });

    it('should not be able to create two appointments on the same date', async () => {
        const fakeAppointmentsRepository = new FakeAppointmentsRepository();

        const createAppointment = new CreateAppointmentService(fakeAppointmentsRepository);

        const sameDate = new Date();

        await createAppointment.execute({
            date: sameDate,
            provider_id: '123384934832880'
        });

        expect(createAppointment.execute({
            date: sameDate,
            provider_id: '123384934832880'
        })).rejects.toBeInstanceOf(Error);

    });
})