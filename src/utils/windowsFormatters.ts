// src/utils/windowsFormatters.ts
export class WindowsPerformanceFormatters {
    static formatCounterValue(value: number, counterType: string): string {
        switch (counterType) {
            case 'PERF_COUNTER_RAWCOUNT':
                return this.formatRawCount(value);
            case 'PERF_COUNTER_BULK_COUNT':
                return this.formatBulkCount(value);
            case 'PERF_100NSEC_TIMER':
                return this.formatTimerValue(value);
            case 'PERF_PRECISION_100NS_TIMER':
                return this.formatPrecisionTimer(value);
            default:
                return value.toString();
        }
    }

    static formatRawCount(value: number): string {
        return value.toLocaleString();
    }

    static formatBulkCount(value: number): string {
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(value) / Math.log(1024));
        return `${(value / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}/sec`;
    }

    static formatTimerValue(value: number): string {
        const ms = value / 10000; // Convert 100ns intervals to milliseconds
        if (ms < 1) return `${(ms * 1000).toFixed(2)}μs`;
        if (ms < 1000) return `${ms.toFixed(2)}ms`;
        return `${(ms / 1000).toFixed(2)}s`;
    }

    static formatPrecisionTimer(value: number): string {
        return `${(value / 10000000).toFixed(3)}s`; // Convert to seconds
    }

    static formatWindowsDateTime(fileTime: number): string {
        // Convert Windows FILETIME to JavaScript Date
        const windowsEpoch = new Date(1601, 0, 1);
        const milliseconds = fileTime / 10000;
        const date = new Date(windowsEpoch.getTime() + milliseconds);

        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }
}