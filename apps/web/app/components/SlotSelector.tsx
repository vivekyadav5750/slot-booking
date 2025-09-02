interface SlotSelectorProps {
  slots: string[];
  selectedSlot: string | null;
  onSelect: (slot: string) => void;
}

export default function SlotSelector({
  slots,
  selectedSlot,
  onSelect,
}: SlotSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-white rounded-xl shadow-lg mt-6">
      {slots.length === 0 ? (
        <p className="col-span-2 text-gray-500 text-center font-medium">No slots available</p>
      ) : (
        slots.map((slot) => {
          const isSelected = selectedSlot === slot;
          return (
            <span
              key={slot}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(slot)}
              onKeyDown={(e) => e.key === "Enter" && onSelect(slot)}
              className={`p-2 m-2 flex items-center justify-center cursor-pointer select-none
                w-32 h-12 rounded-full border-2 shadow-sm font-semibold transition-all
                ${
                  isSelected
                    ? "p-4 bg-blue-600 text-white border-blue-600 shadow-md scale-105"
                    : "p-4 bg-gray-50 text-blue-700 border-blue-300 hover:bg-blue-100 hover:border-blue-400"
                }
              `}
              style={{ transition: "all 0.3s ease-in-out" }}
            >
              {slot} – {getSlotEndTime(slot)}
            </span>
          );
        })
      )}
    </div>
  );
}

function getSlotEndTime(slot: string) {
  const [hourStr, minuteStr] = slot.split(":");
  const hour = Number(hourStr);
  const minute = Number(minuteStr);
  if (isNaN(hour) || isNaN(minute)) {
    return "Invalid slot";
  }
  const date = new Date();
  date.setHours(hour, minute + 30, 0, 0);
  const endHour = date.getHours().toString().padStart(2, "0");
  const endMinute = date.getMinutes().toString().padStart(2, "0");
  return `${endHour}:${endMinute}`;
}