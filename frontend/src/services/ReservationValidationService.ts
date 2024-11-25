// frontend/src/services/ReservationValidationService.ts
import { differenceInMinutes, addHours, isBefore, isAfter } from 'date-fns';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class ReservationValidationService {
  private static instance: ReservationValidationService;
  private readonly MAX_PARTY_SIZE = 12;
  private readonly MIN_ADVANCE_TIME = 60; // minutes
  private readonly MAX_DURATION = 4; // hours

  static getInstance(): ReservationValidationService {
    if (!this.instance) {
      this.instance = new ReservationValidationService();
    }
    return this.instance;
  }

  async validateReservation(reservation: Partial<Reservation>): Promise<ValidationResult> {
    const errors: string[] = [];

    // Basic validation
    if (!this.validateBasicFields(reservation, errors)) {
      return { isValid: false, errors };
    }

    // Time slot validation
    if (!await this.validateTimeSlot(reservation, errors)) {
      return { isValid: false, errors };
    }

    // Table capacity validation
    if (!await this.validateTableCapacity(reservation, errors)) {
      return { isValid: false, errors };
    }

    return { isValid: errors.length === 0, errors };
  }

  private validateBasicFields(reservation: Partial<Reservation>, errors: string[]): boolean {
    if (!reservation.customerName?.trim()) {
      errors.push('Customer name is required');
    }

    if (!reservation.customerEmail?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.push('Valid email address is required');
    }

    if (!reservation.customerPhone?.match(/^\+?[\d\s-]{10,}$/)) {
      errors.push('Valid phone number is required');
    }

    if (!reservation.partySize || reservation.partySize < 1) {
      errors.push('Party size must be at least 1');
    }

    if (reservation.partySize > this.MAX_PARTY_SIZE) {
      errors.push(`Party size cannot exceed ${this.MAX_PARTY_SIZE}`);
    }

    if (!reservation.duration || reservation.duration < 1) {
      errors.push('Duration must be at least 1 hour');
    }

    if (reservation.duration > this.MAX_DURATION) {
      errors.push(`Duration cannot exceed ${this.MAX_DURATION} hours`);
    }

    return errors.length === 0;
  }

  private async validateTimeSlot(
    reservation: Partial<Reservation>, 
    errors: string[]
  ): Promise<boolean> {
    if (!reservation.date) {
      errors.push('Reservation date is required');
      return false;
    }

    const now = new Date();
    const reservationTime = new Date(reservation.date);

    // Check minimum advance time
    if (differenceInMinutes(reservationTime, now) < this.MIN_ADVANCE_TIME) {
      errors.push(`Reservations must be made at least ${this.MIN_ADVANCE_TIME} minutes in advance`);
      return false;
    }

    // Check for time slot conflicts
    const conflicts = await this.checkTimeSlotConflicts(
      reservation.tableId!,
      reservationTime,
      reservation.duration!,
      reservation.id // Exclude current reservation if editing
    );

    if (conflicts) {
      errors.push('The selected time slot is not available');
      return false;
    }

    return true;
  }

  private async checkTimeSlotConflicts(
    tableId: number,
    startTime: Date,
    duration: number,
    excludeId?: number
  ): Promise<boolean> {
    const endTime = addHours(startTime, duration);

    const response = await fetch(`/api/reservations/check-conflicts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tableId,
        startTime,
        endTime,
        excludeId
      })
    });

    const { hasConflicts } = await response.json();
    return hasConflicts;
  }

  private async validateTableCapacity(
    reservation: Partial<Reservation>,
    errors: string[]
  ): Promise<boolean> {
    if (!reservation.tableId || !reservation.partySize) {
      errors.push('Table and party size are required');
      return false;
    }

    const response = await fetch(`/api/tables/${reservation.tableId}`);
    const table = await response.json();

    if (reservation.partySize > table.capacity) {
      errors.push(`Selected table cannot accommodate party of ${reservation.partySize}`);
      return false;
    }

    return true;
  }
}