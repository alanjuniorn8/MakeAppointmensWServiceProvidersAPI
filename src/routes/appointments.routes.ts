import { Router } from "express";
import { getCustomRepository } from "typeorm";
import { parseISO } from "date-fns";

import AppointmentRepository from "../repositories/AppointmentsRepository";
import CreateAppointmentService from "../services/CreateAppointmentService";

const appointmentsRouter = Router();


appointmentsRouter.get('/', async (request, response) => {

    const appointmentRepository = getCustomRepository(AppointmentRepository);
    const appointments = await appointmentRepository.find();

    return response.json(appointments);
});

appointmentsRouter.post('/', async (request, response)=> {
    

    try {
        const {provider, date} = request.body;
        const parsedDate = parseISO(date)
        
        const createAppointment = new CreateAppointmentService();

        const appointment = await createAppointment.execute({provider, date: parsedDate});
        
        return response.json(appointment);

    } catch (e){
        const err = e as Error;
        return response.status(400).json({ error: err.message});
    }
    
    
});

export default appointmentsRouter;