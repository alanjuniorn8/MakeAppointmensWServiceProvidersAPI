import { EntityRepository, Repository} from 'typeorm';

import Appointment from "../models/Appointment";

@EntityRepository(Appointment)
class AppointmentRepository extends Repository<Appointment>{

    public async findByDate(date: Date): Promise<Appointment | null> {

        const appointmentWithSameDate = await this.findOne({
            where: { date },
        });    

        return appointmentWithSameDate || null;
    }

}

export default AppointmentRepository;