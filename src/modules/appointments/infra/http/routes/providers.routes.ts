import { Router } from "express";
import { celebrate, Segments, Joi } from "celebrate";

import ensureAuthenticated from "@modules/users/infra/http/middlewares/ensureAuthenticated";

import ProvidersController from "../controllers/ProvidersController";
import ProviderMonthAvailabilityControler from "../controllers/ProviderMonthAvailabilityController";
import ProviderDayAvailabilityControler from "../controllers/ProviderDayAvailabilityController";



const providersRouter = Router();
const providersController = new ProvidersController();
const providerMonthAvailabilityControler = new ProviderMonthAvailabilityControler();
const providerDayAvailabilityControler = new ProviderDayAvailabilityControler();

providersRouter.use(ensureAuthenticated);

providersRouter.get('/', providersController.index);
providersRouter.get(
    '/:provider_id/month-availability',
    celebrate({
        [Segments.PARAMS]:{
            provider_id: Joi.string().uuid().required()
        }
    }),
    providerMonthAvailabilityControler.index
);
providersRouter.get(
    '/:provider_id/day-availability', 
    celebrate({
        [Segments.PARAMS]:{
            provider_id: Joi.string().uuid().required()
        }
    }),
    providerDayAvailabilityControler.index
);

export default providersRouter;