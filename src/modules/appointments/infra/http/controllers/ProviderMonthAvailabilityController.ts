import { Request, Response } from 'express';
import { container } from "tsyringe"

import ListProvidersMonthAvailabityService from '@modules/appointments/services/ListProvidersMonthAvailabilityService';

export default class ProviderMonthAvailabilityControler {
    public async index(request: Request, response: Response): Promise<Response> {

        const { month, year } = request.body;
        const provider_id = request.params.provider_id;
    
        const listProvidersMonthAvailabityService = container.resolve(ListProvidersMonthAvailabityService);
    
        const availablesDays = await listProvidersMonthAvailabityService.execute({
            provider_id,
            month,
            year
        });
        
        return response.json(availablesDays);
    }
}