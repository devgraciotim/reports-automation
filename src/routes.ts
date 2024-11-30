import { Router, Request, Response } from "express";
import { ReportController } from "./controllers/ReportController";

const router = Router();

router.get('/download', async (req, res) => { await ReportController.getReport(req, res) });

export default router;