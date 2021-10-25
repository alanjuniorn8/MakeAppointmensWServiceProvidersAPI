import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import Appointment from "../models/Appointment"
import AppointmentRepository from "../repositories/AppointmentsRepository";

interface RequestDTO {
    provider: string,
    date: Date
}

class CreateAppointmentService {
    
    public async execute({provider, date}: RequestDTO): Promise<Appointment> {

        const appointmentRepository = getCustomRepository(AppointmentRepository);

        const appointmentDate = startOfHour(date);

        const appointmentWithSameDate = await appointmentRepository.findByDate(
            appointmentDate
        );

        if(appointmentWithSameDate){
            throw Error('This apppointment is already booked');
        }

        const appointment = appointmentRepository.create({
            provider, 
            date: appointmentDate
        });

        await appointmentRepository.save(appointment);

        return appointment;
    }

}

export default CreateAppointmentService;