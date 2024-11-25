// frontend/src/components/tables/ReservationModal.tsx
import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import DatePicker from 'react-datepicker';
import { addHours, format } from 'date-fns';

interface ReservationModalProps {
  reservation: Partial<Reservation>;
  onClose: () => void;
  onSave: (reservation: Reservation) => Promise<void>;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  reservation,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState(reservation);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.customerName?.trim()) {
      newErrors.customerName = 'Name is required';
    }
    if (!formData.customerEmail?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.customerEmail = 'Valid email is required';
    }
    if (!formData.tableId) {
      newErrors.tableId = 'Table selection is required';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onSave(formData as Reservation);
      onClose();
    } catch (error) {
      setErrors({ submit: 'Failed to save reservation' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onClose={onClose} className="fixed inset-0 z-50">
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <Dialog.Title className="text-lg font-bold mb-4">
            {reservation.id ? 'Edit Reservation' : 'New Reservation'}
          </Dialog.Title>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={formData.customerName || ''}
                onChange={e => setFormData(prev => ({ 
                  ...prev, 
                  customerName: e.target.value 
                }))}
                className="w-full border rounded p-2"
              />
              {errors.customerName && (
                <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={formData.customerEmail || ''}
                onChange={e => setFormData(prev => ({ 
                  ...prev, 
                  customerEmail: e.target.value 
                }))}
                className="w-full border rounded p-2"
              />
              {errors.customerEmail && (
                <p className="text-red-500 text-sm mt-1">{errors.customerEmail}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date & Time</label>
                <DatePicker
                  selected={formData.date}
                  onChange={date => setFormData(prev => ({ 
                    ...prev, 
                    date: date || new Date() 
                  }))}
                  showTimeSelect
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="w-full border rounded p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Duration (hours)</label>
                <input
                  type="number"
                  min="1"
                  max="4"
                  value={formData.duration || 2}
                  onChange={e => setFormData(prev => ({ 
                    ...prev, 
                    duration: parseInt(e.target.value) 
                  }))}
                  className="w-full border rounded p-2"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};