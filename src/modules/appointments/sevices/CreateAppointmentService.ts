import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import Appointment from "../infra/typeorm/entities/Appointment"
import AppointmentRepository from "../repositories/AppointmentsRepository";

import AppError from '@shared/errors/AppError'

interface RequestDTO {
    provider_id: string,
    date: Date
}

class CreateAppointmentService {
    
    public async execute({provider_id, date}: RequestDTO): Promise<Appointment> {

        const appointmentRepository = getCustomRepository(AppointmentRepository);

        const appointmentDate = startOfHour(date);

        const appointmentWithSameDate = await appointmentRepository.findByDate(
            appointmentDate
        );

        if(appointmentWithSameDate){
            throw new AppError('This apppointment is already booked');
        }

        const appointment = appointmentRepository.create({
            provider_id, 
            date: appointmentDate
        });

        await appointmentRepository.save(appointment);

        return appointment;
    }

}

export default CreateAppointmentService;