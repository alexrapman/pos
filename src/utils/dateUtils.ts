// src/utils/dateUtils.ts
import { formatInTimeZone, zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';
import { isValid, parse, format as formatDate } from 'date-fns';

export class DateUtils {
    private static windowsToIANA: { [key: string]: string } = {
        'Pacific Standard Time': 'America/Los_Angeles',
        'Mountain Standard Time': 'America/Denver',
        'Central Standard Time': 'America/Chicago',
        'Eastern Standard Time': 'America/New_York'
    };

    static getCurrentWindowsTimeZone(): string {
        const output = require('child_process')
            .execSync('tzutil /g')
            .toString()
            .trim();
        return this.windowsToIANA[output] || 'UTC';
    }

    static formatEventDate(date: Date, timeZone?: string): string {
        const tz = timeZone || this.getCurrentWindowsTimeZone();
        return formatInTimeZone(date, tz, 'yyyy-MM-dd HH:mm:ss.SSS');
    }

    static parseWindowsEventDate(dateStr: string): Date {
        const parsed = parse(dateStr, 'M/d/yyyy h:mm:ss a', new Date());
        return isValid(parsed) ? parsed : new Date();
    }

    static convertToLocalTime(date: Date): Date {
        const tz = this.getCurrentWindowsTimeZone();
        return utcToZonedTime(date, tz);
    }

    static convertToUTC(date: Date): Date {
        const tz = this.getCurrentWindowsTimeZone();
        return zonedTimeToUtc(date, tz);
    }
}