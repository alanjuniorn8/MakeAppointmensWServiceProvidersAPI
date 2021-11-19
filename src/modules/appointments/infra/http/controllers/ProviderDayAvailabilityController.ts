import { Request, Response } from 'express';
import { container } from "tsyringe"

import ListProvidersDayAvailabityService from '@modules/appointments/services/ListProvidersDayAvailabilityService';

export default class ProviderDayAvailabilityController {
    public async index(request: Request, response: Response): Promise<Response> {

        const { day, month, year } = request.body;
        const { provider_id } = request.params;
    
    
        const listProvidersDayAvailabityService = container.resolve(ListProvidersDayAvailabityService);
    
        const availablesDays = await listProvidersDayAvailabityService.execute({
            provider_id,
            day,
            month,
            year
        });
        
        return response.json(availablesDays);
    }
}