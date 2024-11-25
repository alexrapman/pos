// src/utils/dateRangeUtils.ts
import {
    isWithinInterval,
    areIntervalsOverlapping,
    startOfDay,
    endOfDay,
    subDays,
    subWeeks,
    subMonths
} from 'date-fns';

interface DateRange {
    start: Date;
    end: Date;
}

export class DateRangeUtils {
    static validateRange(range: DateRange): boolean {
        return range.start <= range.end &&
            isValid(range.start) &&
            isValid(range.end);
    }

    static getRelativeRange(type: 'day' | 'week' | 'month', count: number): DateRange {
        const end = endOfDay(new Date());
        let start: Date;

        switch (type) {
            case 'day':
                start = startOfDay(subDays(end, count));
                break;
            case 'week':
                start = startOfDay(subWeeks(end, count));
                break;
            case 'month':
                start = startOfDay(subMonths(end, count));
                break;
            default:
                throw new Error('Invalid range type');
        }

        return { start, end };
    }

    static isOverlapping(range1: DateRange, range2: DateRange): boolean {
        return areIntervalsOverlapping(
            { start: range1.start, end: range1.end },
            { start: range2.start, end: range2.end }
        );
    }

    static parseWindowsFileTime(fileTime: string): Date {
        // Windows FILETIME is in 100-nanosecond intervals since January 1, 1601
        const WINDOWS_EPOCH = new Date(1601, 0, 1).getTime();
        const time = parseInt(fileTime, 16);
        return new Date(WINDOWS_EPOCH + time / 10000);
    }
}