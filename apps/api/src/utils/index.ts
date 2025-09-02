export function generateDaySlots(start = '09:00', end = '17:00', slotMinutes = 30): string[] {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    const slots: string[] = [];
    let d = new Date(0, 0, 0, sh, sm, 0, 0);
    const endDate = new Date(0, 0, 0, eh, em, 0, 0);

    while (d < endDate) {
        const hh = String(d.getHours()).padStart(2, '0');
        const mm = String(d.getMinutes()).padStart(2, '0');
        slots.push(`${hh}:${mm}`);
        d = new Date(d.getTime() + slotMinutes * 60 * 1000);
    }
    return slots;
}

export function toTimeString(date: Date) {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}