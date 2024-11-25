// frontend/src/components/tables/ReservationManagement.tsx
import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { Tab } from '@headlessui/react';

interface Reservation {
  id: number;
  tableId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  partySize: number;
  date: Date;
  duration: number;
  status: 'confirmed' | 'cancelled' | 'completed';
}

const locales = {
  'en-US': require('date-fns/locale/en-US')
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales
});

export const ReservationManagement: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    const response = await fetch('/api/reservations');
    const data = await response.json();
    setReservations(data.map((r: any) => ({
      ...r,
      date: new Date(r.date)
    })));
  };

  const updateReservationStatus = async (id: number, status: Reservation['status']) => {
    await fetch(`/api/reservations/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    await fetchReservations();
  };

  const filteredReservations = reservations.filter(r => 
    filter === 'all' || r.status === filter
  );

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <Tab.Group>
          <Tab.List className="flex space-x-4">
            <Tab className={({ selected }) =>
              `px-4 py-2 rounded-lg ${
                selected ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`
            }>
              List View
            </Tab>
            <Tab className={({ selected }) =>
              `px-4 py-2 rounded-lg ${
                selected ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`
            }>
              Calendar View
            </Tab>
          </Tab.List>
        </Tab.Group>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded p-2"
        >
          <option value="all">All Reservations</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <Tab.Panels>
        <Tab.Panel>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Table
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReservations.map(reservation => (
                  <tr key={reservation.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {format(reservation.date, 'PPp')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {reservation.customerName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {reservation.customerEmail}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      Table {reservation.tableId}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs
                        ${reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          reservation.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'}
                      `}>
                        {reservation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={reservation.status}
                        onChange={(e) => updateReservationStatus(
                          reservation.id,
                          e.target.value as Reservation['status']
                        )}
                        className="border rounded p-1"
                      >
                        <option value="confirmed">Confirm</option>
                        <option value="cancelled">Cancel</option>
                        <option value="completed">Complete</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Tab.Panel>

        <Tab.Panel>
          <Calendar
            localizer={localizer}
            events={reservations.map(r => ({
              title: `Table ${r.tableId} - ${r.customerName}`,
              start: r.date,
              end: new Date(r.date.getTime() + r.duration * 60 * 60 * 1000),
              resource: r
            }))}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
          />
        </Tab.Panel>
      </Tab.Panels>
    </div>
  );
};