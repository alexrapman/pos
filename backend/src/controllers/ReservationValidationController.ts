// backend/src/controllers/ReservationValidationController.ts
import { Request, Response } from 'express';
import { Order, Table, Reservation } from '../models';
import { Op } from 'sequelize';
import { addHours, isWithinInterval } from 'date-fns';

export class ReservationValidationController {
  async checkConflicts(req: Request, res: Response) {
    const { tableId, startTime, endTime, excludeId } = req.body;

    try {
      const conflicts = await Reservation.findOne({
        where: {
          tableId,
          id: { [Op.ne]: excludeId || 0 },
          [Op.or]: [
            {
              date: {
                [Op.between]: [startTime, endTime]
              }
            },
            {
              [Op.and]: [
                { date: { [Op.lte]: startTime } },
                {
                  date: {
                    [Op.gte]: sequelize.literal(
                      `DATE_ADD(date, INTERVAL duration HOUR)`
                    )
                  }
                }
              ]
            }
          ]
        }
      });

      return res.json({ hasConflicts: !!conflicts });
    } catch (error) {
      return res.status(500).json({ error: 'Error checking conflicts' });
    }
  }

  async validateCapacity(req: Request, res: Response) {
    const { tableId, partySize } = req.params;

    try {
      const table = await Table.findByPk(tableId);
      if (!table) {
        return res.status(404).json({ error: 'Table not found' });
      }

      const isValid = partySize <= table.capacity;
      return res.json({
        isValid,
        message: isValid ? 
          'Table can accommodate party' : 
          `Table capacity (${table.capacity}) cannot accommodate party of ${partySize}`
      });
    } catch (error) {
      return res.status(500).json({ error: 'Error validating capacity' });
    }
  }

  async validateBusinessRules(req: Request, res: Response) {
    const { date, duration, partySize } = req.body;

    const rules = {
      maxDuration: 4,
      maxPartySize: 12,
      minAdvanceTime: 60, // minutes
      operatingHours: {
        start: 11, // 11 AM
        end: 22   // 10 PM
      }
    };

    const violations = [];

    // Check duration
    if (duration > rules.maxDuration) {
      violations.push(`Duration cannot exceed ${rules.maxDuration} hours`);
    }

    // Check party size
    if (partySize > rules.maxPartySize) {
      violations.push(`Party size cannot exceed ${rules.maxPartySize}`);
    }

    // Check advance time
    const reservationTime = new Date(date);
    const now = new Date();
    const minutesInAdvance = (reservationTime.getTime() - now.getTime()) / (1000 * 60);
    if (minutesInAdvance < rules.minAdvanceTime) {
      violations.push(`Reservations must be made at least ${rules.minAdvanceTime} minutes in advance`);
    }

    // Check operating hours
    const hours = reservationTime.getHours();
    if (hours < rules.operatingHours.start || hours >= rules.operatingHours.end) {
      violations.push(`Reservations only available between ${rules.operatingHours.start}AM and ${rules.operatingHours.end}PM`);
    }

    return res.json({
      isValid: violations.length === 0,
      violations
    });
  }
}