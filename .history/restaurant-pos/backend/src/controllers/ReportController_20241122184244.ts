// backend/src/controllers/ReportController.ts
import { Request, Response } from 'express';
import { ReportService } from '../services/ReportService';

export class ReportController {
    private reportService: ReportService;

    constructor() {
        this.reportService = new ReportService();
    }

    async getSalesReport(req: Request, res: Response) {
        const { startDate, endDate } = req.query;
        const report = await this.reportService.generateSalesReport(new Date(startDate), new Date(endDate));
        res.json(report);
    }
}