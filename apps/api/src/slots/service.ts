import admin from 'firebase-admin';
import type { Booking } from './model.js';

const BOOKINGS_COLLECTION = process.env.BOOKINGS_COLLECTION || 'bookings';

export async function getBookingsForDate(date: string): Promise<Booking[]> {
    const db = admin.firestore();
    const snapshot = await db.collection(BOOKINGS_COLLECTION).where('date', '==', date).get();
    const bookings: Booking[] = [];
    snapshot.forEach(doc => bookings.push(doc.data() as Booking));
    return bookings;
}

export async function createBookingIfAvailable(payload: { date: string; time: string }): Promise<Booking> {
    const db = admin.firestore();
    const docId = `${payload.date}_${payload.time}`;
    const docRef = db.collection(BOOKINGS_COLLECTION).doc(docId);

    return db.runTransaction(async (tx) => {
        const doc = await tx.get(docRef);
        if (doc.exists) {
            const existing = doc.data() as Booking;
            const err: any = new Error(`Slot already booked for ${payload.date} ${payload.time}`);
            err.code = 'CONFLICT';
            throw err;
        }

        const booking: Booking = {
            id: docId,
            date: payload.date,
            time: payload.time,
            // name: payload.name || null,
            createdAt: admin.firestore.FieldValue.serverTimestamp() as any,
        } as any;

        tx.set(docRef, booking);
        return booking;
    });
}