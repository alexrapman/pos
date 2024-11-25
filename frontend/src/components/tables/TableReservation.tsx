// frontend/src/components/tables/TableReservation.tsx
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { format, addHours, isAfter, isBefore } from 'date-fns';

interface Reservation {
  id?: number;
  tableId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  partySize: number;
  date: Date;
  duration: number;
}

export const TableReservation: React.FC<{ tableId: number }> = ({ tableId }) => {
  const [reservation, setReservation] = useState<Partial<Reservation>>({
    tableId,
    duration: 2,
    date: addHours(new Date(), 1)
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Reservation, string>>>({});

  const validateReservation = (): boolean => {
    const newErrors: Partial<Record<keyof Reservation, string>> = {};
    
    if (!reservation.customerName?.trim()) {
      newErrors.customerName = 'Name is required';
    }
    if (!reservation.customerEmail?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.customerEmail = 'Valid email is required';
    }
    if (!reservation.customerPhone?.match(/^\+?[\d\s-]{10,}$/)) {
      newErrors.customerPhone = 'Valid phone number is required';
    }
    if (!reservation.partySize || reservation.partySize < 1) {
      newErrors.partySize = 'Party size must be at least 1';
    }
    if (!reservation.date || isBefore(reservation.date, new Date())) {
      newErrors.date = 'Please select a future date/time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateReservation()) return;

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservation)
      });

      if (!response.ok) throw new Error('Reservation failed');

      // Reset form and show success message
      setReservation({ tableId, duration: 2, date: addHours(new Date(), 1) });
    } catch (error) {
      setErrors({ ...errors, submit: 'Failed to create reservation' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Reserve Table {tableId}</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={reservation.customerName || ''}
          onChange={e => setReservation(prev => ({ ...prev, customerName: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.customerName && (
          <p className="mt-1 text-sm text-red-600">{errors.customerName}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Date & Time</label>
          <DatePicker
            selected={reservation.date}
            onChange={date => setReservation(prev => ({ ...prev, date: date || new Date() }))}
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
            minDate={new Date()}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Party Size</label>
          <input
            type="number"
            min="1"
            value={reservation.partySize || ''}
            onChange={e => setReservation(prev => ({ ...prev, partySize: parseInt(e.target.value) }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
          {errors.partySize && (
            <p className="mt-1 text-sm text-red-600">{errors.partySize}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Confirm Reservation
      </button>
    </form>
  );
};