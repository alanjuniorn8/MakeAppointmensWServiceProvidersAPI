import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { inject, injectable } from 'tsyringe';

import Appointment from "../infra/typeorm/entities/Appointment"
import IAppointmentsRepository from "../repositories/IAppointmentsRepository";

import AppError from '@shared/errors/AppError'
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequestDTO {
    provider_id: string,
    user_id: string,
    date: Date
}

@injectable()
class CreateAppointmentService {

    constructor(
        @inject('AppointmentsRepository')
        private appointmentRepository: IAppointmentsRepository,

        @inject('NotificationsRepository')
        private notificationsRepository: INotificationsRepository,

        @inject('CacheProvider')
        private CacheProvider: ICacheProvider
    ){}
    
    public async execute({provider_id, user_id, date}: IRequestDTO): Promise<Appointment> {

        if(provider_id == user_id) throw new AppError('You can not cut your own hair!');

        const appointmentDate = startOfHour(date);

        if(getHours(appointmentDate) < 8 || getHours(appointmentDate)> 17){
            throw new AppError('You can only create appointments between 8am and 5pm.');
        }

        const currentDate = new Date(Date.now());

        if(isBefore(appointmentDate, currentDate)){
            throw new AppError('You can not make an appointment on the past.');
        }

        const appointmentWithSameDate = await this.appointmentRepository.findByDate(
            appointmentDate
        );

        if(appointmentWithSameDate){
            throw new AppError('This apppointment is already booked');
        }

        const appointment = await this.appointmentRepository.create({
            provider_id, 
            user_id,
            date: appointmentDate
        });

        const dateFormated = format(appointmentDate, "dd/MM/yyyy 'às' HH'h'");

        await this.notificationsRepository.create({
            recipient_id: provider_id,
            content: `Novo agendamento para dia ${dateFormated}`
        });

        await this.CacheProvider.invalidate(`provider-appointments:${provider_id}:${format(appointmentDate, 'yyyy-M-d')}`);

        return appointment;
    }

}

export default CreateAppointmentService;
