import { Router, Request, Response } from "express";
import { ReportService } from "./services/ReportService";

const router = Router();
const reportService = new ReportService();

router.get('/download-report', async (req, res) => {
    try {
        const downloadedFilePath = await reportService.getAllPeriod();

        if (downloadedFilePath) {
            res.download(downloadedFilePath, (err) => {
                if (err) {
                    console.error('Erro ao enviar o arquivo:', err);
                    res.status(500).send('Erro ao enviar o arquivo');
                }
            });
        } else {
            res.status(404).send('Arquivo não encontrado');
        }
    } catch (error) {
        console.error('Erro ao gerar o relatório:', error);
        res.status(500).send('Erro ao gerar o relatório');
    }
});
export default router;