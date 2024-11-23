import { Router, Request, Response } from "express";
import { ReportService } from "./services/ReportService";
import fs from 'fs';

const router = Router();
const reportService = new ReportService();

// router.get('/getAllPeriod', async (req: Request, res: Response) => {
//     try {
//         const downloadedFilePath = await reportService.getAllPeriod();

//         if (downloadedFilePath) {
//             res.download(downloadedFilePath, (err) => {
//                 if (err) {
//                     console.error('Erro ao enviar o arquivo:', err);
//                     res.status(500).send('Erro ao enviar o arquivo');
//                 }

//                 fs.unlinkSync(downloadedFilePath);
//             });
//         } else {
//             res.status(404).send('Arquivo não encontrado');
//         }
//     } catch (error) {
//         console.error('Erro ao processar a solicitação:', error);
//         res.status(500).send('Erro ao processar a solicitação');
//     }
// });


router.get('/download', async (req: Request, res: any) => {
    const { initialDate, finalDate } = req.query;

    try {
        let filePath: string | undefined;

        if (initialDate && finalDate) {
            const initialDateStr = initialDate as string;
            const finalDateStr = finalDate as string;
            filePath = await reportService.getReport(initialDateStr, finalDateStr);
        } else {
            filePath = await reportService.getAllPeriod();
        }

        if (!filePath) {
            return res.status(500).send('Erro ao baixar o relatório.');
        }

        res.download(filePath, (err: Error) => {
            if (err) {
                console.error('Erro ao enviar o arquivo:', err);
                return res.status(500).send('Erro ao enviar o arquivo.');
            }

            fs.unlinkSync(filePath);
        });
    } catch (error) {
        console.error('Erro ao processar a solicitação:', error);
        res.status(500).send('Erro ao processar a solicitação.');
    }
});

export default router;