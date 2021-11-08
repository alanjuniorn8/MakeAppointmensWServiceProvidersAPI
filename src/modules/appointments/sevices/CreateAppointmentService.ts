import { startOfHour } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import Appointment from "../infra/typeorm/entities/Appointment"
import IAppointmentsRepository from "../repositories/IAppointmentsRepository";

import AppError from '@shared/errors/AppError'

interface IRequestDTO {
    provider_id: string,
    date: Date
}

@injectable()
class CreateAppointmentService {

    constructor(
        @inject('AppointmentsRepository')
        private appointmentRepository: IAppointmentsRepository
    ){}
    
    public async execute({provider_id, date}: IRequestDTO): Promise<Appointment> {

        const appointmentDate = startOfHour(date);

        const appointmentWithSameDate = await this.appointmentRepository.findByDate(
            appointmentDate
        );

        if(appointmentWithSameDate){
            throw new AppError('This apppointment is already booked');
        }

        const appointment = await this.appointmentRepository.create({
            provider_id, 
            date: appointmentDate
        });

        return appointment;
    }

}

export default CreateAppointmentService;