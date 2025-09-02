"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import CustomDatePicker from "../components/DatePicker";
import SlotSelector from "../components/SlotSelector";

const API_BASE = "http://localhost:4000/api"; // backend API

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [openDate, setOpenDate] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      fetchSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchSlots = async (date: Date) => {
    try {
      setLoading(true);
      const formattedDate = date.toISOString().split("T")[0];
      const response = await axios.get(`${API_BASE}/slots?date=${formattedDate}`);
      setAvailableSlots(response.data.available);
    } catch (error) {
      console.error("Error fetching slots:", error);
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const bookSlot = async () => {
    if (!selectedDate || !selectedSlot) {
      setSuccessMessage("❌ Please select a date and slot before booking.");
      return;
    }
    try {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      const response = await axios.post(`${API_BASE}/book`, {
        date: formattedDate,
        time: selectedSlot,
      });
      setSuccessMessage(`✅ ${response.data.message}`);
      setSelectedSlot(null);
      fetchSlots(selectedDate);
    } catch (error) {
      console.error("Error booking slot:", error);
      setSuccessMessage("❌ Failed to book slot (already taken or error).");
    }
  };

  const disabledDates: Date[] = [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-blue-700 mb-8 shadow-text">Book a Slot</h1>

      <button
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
        onClick={() => setOpenDate(!openDate)}
      >
        {openDate ? "Close Date Picker" : "Select Date"}
      </button>

      {openDate && (
        <CustomDatePicker
          selectedDate={selectedDate}
          onChange={setSelectedDate}
          disabledDates={disabledDates}
        />
      )}

      {loading && <p className="mt-6 text-gray-600 font-medium animate-pulse">Loading slots...</p>}

      {!loading && selectedDate && (
        <SlotSelector
          slots={availableSlots}
          selectedSlot={selectedSlot}
          onSelect={setSelectedSlot}
        />
      )}

      {!loading && selectedDate && availableSlots.length > 0 && (
        <div className="flex justify-center mt-10">
          <button
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-xl text-xl shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedSlot}
            onClick={bookSlot}
          >
            Confirm Slot
          </button>
        </div>
      )}

      {successMessage && (
        <div className="mt-8 bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-lg shadow-md">
          {successMessage}
        </div>
      )}
    </div>
  );
}