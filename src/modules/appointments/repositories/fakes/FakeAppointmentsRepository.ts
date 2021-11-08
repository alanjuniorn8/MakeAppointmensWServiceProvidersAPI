
import { uuid } from 'uuidv4';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from "@modules/appointments/dtos/ICreateAppointmentDTO"

import Appointment from "@modules/appointments/infra/typeorm/entities/Appointment";

class FakeAppointmentsRepository implements IAppointmentsRepository{
    private appointments: Appointment[] = [];

    public async findByDate(date: Date): Promise<Appointment | undefined>{

        const appointment = this.appointments.find(
            appointment => appointment.date == date
        );

        return appointment;

    }

    public async create({ provider_id, date }: ICreateAppointmentDTO ): Promise<Appointment>{

        const appointment = new Appointment();

        appointment.id = uuid();
        appointment.date = date;
        appointment.provider_id = provider_id;

        this.appointments.push(appointment);

        return appointment;
    }



}

export default FakeAppointmentsRepository;