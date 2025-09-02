import { Router } from 'express';
import { bookSlot, getAvailableSlots } from './controller.js';

const router = Router();

router.get('/slots', getAvailableSlots);
router.post('/book', bookSlot);

export default router;