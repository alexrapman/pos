// backend/src/services/ReportScheduler.ts
import { CronJob } from 'cron';
import { ReportGenerator } from './ReportGenerator';
import { EmailService } from './EmailService';
import { MetricsCollector } from './MetricsCollector';

export class ReportScheduler {
    private jobs: Map<string, CronJob> = new Map();

    constructor(
        private reportGenerator: ReportGenerator,
        private emailService: EmailService,
        private metricsCollector: MetricsCollector
    ) { }

    scheduleReport(cronPattern: string, recipients: string[]) {
        const job = new CronJob(cronPattern, async () => {
            const metrics = this.metricsCollector.getDailyMetrics();
            const report = await this.reportGenerator.generateReport(metrics);

            await this.emailService.sendReport(
                recipients,
                'Daily Analytics Report',
                report
            );
        });

        this.jobs.set(cronPattern, job);
        job.start();
    }
}