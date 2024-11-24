import { Router, Request, Response } from "express";
import { ReportService } from "./services/ReportService";
import fs from 'fs';

const router = Router();
const reportService = new ReportService();

router.get('/download', async (req: Request, res: any) => {
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
});

export default router;