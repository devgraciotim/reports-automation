import { Request, Response } from "express";
import { ReportService } from "../services/ReportService"; 
import fs from "fs"

const reportService = new ReportService();

export class ReportController {
    static async getReport(req: Request, res: Response) {
        const { initialDate, finalDate } = req.query;

        try {
                const filePath = await reportService.getReport(
                initialDate ? initialDate as string : undefined,
                finalDate ? finalDate as string : undefined
            );

            if (!filePath) {
                return res.status(500).send('Erro ao baixar o relatório.');
            }

            res.download(filePath, (err: Error) => {
                if (err) {
                    console.error('Erro ao enviar o arquivo:', err);
                    return res.status(500).send('Erro ao enviar o arquivo.');
                }

                // fs.unlinkSync(filePath);
            });
        } catch (error) {
            console.error('Erro ao processar a solicitação:', error);
            res.status(500).send('Erro ao processar a solicitação.');
        }
    }
}