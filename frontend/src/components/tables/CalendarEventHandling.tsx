// frontend/src/components/tables/CalendarEventHandling.tsx
import React, { useState } from 'react';
import { Calendar, CalendarProps, SlotInfo, EventProps } from 'react-big-calendar';
import { ReservationModal } from './ReservationModal';
import { Popover } from '@headlessui/react';

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  resource: Reservation;
}

export const CalendarWithEvents: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleSelectSlot = ({ start, end }: SlotInfo) => {
    setSelectedEvent({
      id: 0,
      title: 'New Reservation',
      start,
      end,
      resource: {
        tableId: 0,
        date: start,
        duration: Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60))
      } as Reservation
    });
    setShowModal(true);
  };

  const handleEventDrop = async ({ event, start, end }: any) => {
    try {
      await fetch(`/api/reservations/${event.resource.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: start,
          duration: Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60))
        })
      });
      // Refresh calendar
    } catch (error) {
      console.error('Failed to reschedule reservation:', error);
    }
  };

  const EventComponent: React.FC<EventProps<CalendarEvent>> = ({ event }) => (
    <Popover className="relative">
      <Popover.Button className="w-full text-left p-1">
        {event.title}
      </Popover.Button>

      <Popover.Panel className="absolute z-10 w-64 p-4 bg-white rounded-lg shadow-lg">
        <div className="space-y-2">
          <h3 className="font-bold">{event.resource.customerName}</h3>
          <p>Table: {event.resource.tableId}</p>
          <p>Party Size: {event.resource.partySize}</p>
          <p>Phone: {event.resource.customerPhone}</p>
          <button
            onClick={() => {
              setSelectedEvent(event);
              setShowModal(true);
            }}
            className="mt-2 w-full bg-blue-500 text-white px-4 py-2 rounded"
          >
            Edit Reservation
          </button>
        </div>
      </Popover.Panel>
    </Popover>
  );

  return (
    <>
      <Calendar
        selectable
        resizable
        localizer={localizer}
        events={reservations}
        onSelectSlot={handleSelectSlot}
        onEventDrop={handleEventDrop}
        components={{
          event: EventComponent
        }}
        style={{ height: 500 }}
      />

      {showModal && selectedEvent && (
        <ReservationModal
          reservation={selectedEvent.resource}
          onClose={() => setShowModal(false)}
          onSave={async (updatedReservation) => {
            // Handle save
            setShowModal(false);
          }}
        />
      )}
    </>
  );
};