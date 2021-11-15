import { inject, injectable } from 'tsyringe';
import { getDate, getDaysInMonth } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
    provider_id: string,
    month: number
    year: number
}

type IResponse = Array<{
    day: number,
    available: boolean
}>;

@injectable()
class ListProvidersMonthAvailabityService {

    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository
    ){}
    
    public async execute({provider_id, month, year}: IRequest): Promise<IResponse> {
        
        const appointmentsInMonth = await this.appointmentsRepository.findAllInMonthFromProvider({
            provider_id,
            year,
            month
        });

        const numberOfDaysinMonth = getDaysInMonth(new Date(year, month - 1));

        const eachDayArray = Array.from(
            { length: numberOfDaysinMonth},
            (_, index) => index + 1,
        );

        const availability = eachDayArray.map(day =>{
            const appointmentsInDay = appointmentsInMonth.filter( appointment => {
                return getDate(appointment.date) == day;
            })

            return {
                day,
                available: appointmentsInDay.length < 10
            };
        });
        
        return availability;

    }

}

export default ListProvidersMonthAvailabityService;