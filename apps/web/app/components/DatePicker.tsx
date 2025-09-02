import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerProps {
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
  disabledDates: Date[];
}

export default function CustomDatePicker({
  selectedDate,
  onChange,
  disabledDates,
}: DatePickerProps) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg mt-6">
      <DatePicker
        selected={selectedDate}
        onChange={onChange}
        inline
        minDate={new Date()}
        excludeDates={disabledDates}
        calendarClassName="rounded-xl border border-gray-200 shadow-md p-4"
        dayClassName={(date) =>
          disabledDates.some((d) => d.toDateString() === date.toDateString())
            ? "text-gray-400"
            : "hover:bg-blue-100 rounded-full transition-colors"
        }
      />
    </div>
  );
}