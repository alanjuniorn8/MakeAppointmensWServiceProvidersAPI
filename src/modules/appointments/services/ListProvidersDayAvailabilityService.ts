import { inject, injectable } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
    provider_id: string,
    day: number,
    month: number
    year: number
}

type IResponse = Array<{
    hour: number,
    available: boolean
}>;

@injectable()
class ListProvidersDayAvailabityService {

    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository
    ){}
    
    public async execute({provider_id, day, month, year}: IRequest): Promise<IResponse> {
        
        const appointmentsInDay = await this.appointmentsRepository.findAllInDayFromProvider({
            provider_id,
            year,
            month,
            day
        });

        const startHour = 8;

        const eachHourArray = Array.from(
            { length: 10},
            (_, index) => startHour + index,
        );

        const currentDate = new Date(Date.now());

        const availability = eachHourArray.map(hour =>{
            const hasAppointmentInHour = appointmentsInDay.find(
                appointment => getHours(appointment.date) == hour
            );

            const compareDate = new Date(year, month - 1, day, hour);

            return {
                hour,
                available: !hasAppointmentInHour && isAfter(compareDate, currentDate),
            };
        });
        
        return availability;

    }

}

export default ListProvidersDayAvailabityService;