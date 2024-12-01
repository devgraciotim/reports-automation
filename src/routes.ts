import { Router, Request, Response } from 'express';
import { ReportController } from './controllers/ReportController';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Relatórios
 *     description: Operações relacionadas a relatórios
 */

/**
 * @swagger
 * /download:
 *   get:
 *     summary: Realiza o download do relatório
 *     tags: [Relatórios]
 *     parameters:
 *       - in: query
 *         name: initialDate
 *         schema:
 *           type: string
 *           default: "01/01/2023"
 *         description: Data inicial do período desejado (formato DD/MM/AAAA)
 *       - in: query
 *         name: finalDate
 *         schema:
 *           type: string
 *         description: Data final do período desejado (formato DD/MM/AAAA). Se não fornecida, será usada a data atual.
 *         example: "01/12/2024"
 *     responses:
 *       200:
 *         description: Download realizado com sucesso
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/download', async (req: Request, res: Response) => {
  await ReportController.getReport(req, res);
});

export default router;
