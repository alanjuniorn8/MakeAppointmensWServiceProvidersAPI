import AppError from '@shared/errors/AppError'

import FakeAppointmentsRepository from "../repositories/fakes/FakeAppointmentsRepository"; 
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';

import CreateAppointmentService from "./CreateAppointmentService";

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;

let createAppointment: CreateAppointmentService;


describe('CreateAppointment', () => {

    beforeEach(() =>{
        
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        fakeNotificationsRepository = new FakeNotificationsRepository();

        createAppointment = new CreateAppointmentService(
            fakeAppointmentsRepository, fakeNotificationsRepository
        );

    });

    it('should be able to create a new appointment', async () => {

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2021, 4, 10, 10, 0, 0).getTime();
        });
        
        const appointment = await createAppointment.execute({
            date: new Date(2021, 4, 10, 11),
            provider_id: '123384934832880',
            user_id: 'eu'
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('123384934832880');
    });

    it('should not be able to create two appointments on the same date', async () => {
        
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2021, 4, 10, 10, 0, 0).getTime();
        });

        const sameDate = new Date(2022, 4, 10, 10, 0, 0);

        await createAppointment.execute({
            date: sameDate,
            provider_id: '123384934832880',
            user_id: 'eu'
        });

        await expect(createAppointment.execute({
            date: sameDate,
            provider_id: '123384934832880',
            user_id: 'eu'
        })).rejects.toHaveProperty('message', 'This apppointment is already booked');

    });

    it('should not be able to create an appointment on the past', async () => {
        
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2021, 4, 10, 12, 0, 0).getTime();
        });
        
        const past = new Date(2021, 4, 10, 11, 0, 0);

        await expect(createAppointment.execute({
            date: past,
            provider_id: '123384934832880',
            user_id: 'eu'
        })).rejects.toBeInstanceOf(AppError);

    });

    it('should not be able to create an appointment with same user as provider', async () => {
        
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2021, 4, 10, 12, 0, 0).getTime();
        });
        
        const appointmentDate = new Date(2021, 4, 10, 13, 0, 0);

        await expect(createAppointment.execute({
            date: appointmentDate,
            provider_id: 'eu',
            user_id: 'eu'
        })).rejects.toBeInstanceOf(AppError);

    });

    it('should not be able to create an appointment before 8', async () => {
        
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2021, 4, 10, 6, 0, 0).getTime();
        });
        
        const appointmentDate = new Date(2021, 4, 10, 7, 0, 0);

        await expect(createAppointment.execute({
            date: appointmentDate,
            provider_id: '123384934832880',
            user_id: 'eu'
        })).rejects.toBeInstanceOf(AppError);

    });

    it('should not be able to create an appointment after 17', async () => {
        
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2021, 4, 10, 6, 0, 0).getTime();
        });
        
        const appointmentDate = new Date(2021, 4, 10, 19, 0, 0);

        await expect(createAppointment.execute({
            date: appointmentDate,
            provider_id: '123384934832880',
            user_id: 'eu'
        })).rejects.toBeInstanceOf(AppError);

    });
})