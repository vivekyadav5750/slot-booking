import { type Request, type Response, type NextFunction } from 'express';
import { generateDaySlots, toTimeString } from '../utils/index.js';
import { createBookingIfAvailable, getBookingsForDate } from './service.js';

export async function getAvailableSlots(req: Request, res: Response, next: NextFunction) {
    try {
        const date = req.query.date as string;
        if (!date) return res.status(400).json({ message: 'Missing date query parameter. Use YYYY-MM-DD' });

        const allSlots = generateDaySlots('09:00', '17:00', 30);
        const bookings = await getBookingsForDate(date);
        const bookedTimes = new Set(bookings.map(b => b.time));
        const available = allSlots.filter(s => !bookedTimes.has(s));

        res.json({ date, available, booked: Array.from(bookedTimes) });
    } catch (err) {
        next(err);
    }
}


export async function bookSlot(req: Request, res: Response, next: NextFunction) {
    try {
        const { date, time } = req.body as { date: string; time: string };
        if (!date || !time) return res.status(400).json({ message: 'Missing date or time in request body' });
        const booking = await createBookingIfAvailable({ date, time });

        res.json({ success: true, message: 'Slot booked successfully', booking });
    } catch (err: any) {
        if (err?.code === 'CONFLICT') return res.status(409).json({ success: false, message: err.message });
        next(err);
    }
}