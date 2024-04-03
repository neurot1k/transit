import express from 'express';
import * as controllers from './controllers';

export const router = express.Router();


router.get(String.raw`/routes/`, controllers.getRoutes);
router.get(String.raw`/routes/:routeId/shapes`, controllers.getShapes);