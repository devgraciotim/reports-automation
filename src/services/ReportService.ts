import { WebDriver } from "selenium-webdriver";
import { data } from "../data/xpath";

import { DateUtils } from "../utils/DateUtils";
import { ElementInteractor } from "../interactors/ElementInteractor";
import { ChromeDriverFactory } from "../factories/WebDriverFactory"; 
import { FileUtils } from "../utils/FileUtils";

import dotenv from 'dotenv';
dotenv.config();

interface IReportService {
    getReport(initialDate?: string, finalDate?: string): Promise<string | void> 
}

export class ReportService implements IReportService {

    dateUtils = new DateUtils(); 
    fileUtils = new FileUtils();
    elementInteractor = new ElementInteractor();
    chromeDriverFactory = new ChromeDriverFactory();

    private host: string = process.env.HOST!;
    private username: string = process.env.USER!;
    private password: string = process.env.PASSWORD!;
    private downloadPath: string = process.env.DOWNLOAD_PATH!;


    async getReport(initialDate: string = "01/01/2023", finalDate: string = this.dateUtils.getFormattedDate()): Promise<string | void> {
        const driver: WebDriver = this.chromeDriverFactory.createDriver(
            {
                headless: false,
                gpuUsage: true,
                sandbox: true,
                devShmUsage: true,
                downloadDirectory: this.fileUtils.formatPath(this.downloadPath)
            }
        );

        try {
            if (!this.host || !this.username || !this.password) {
                throw new Error("Missing required environment variables.");
            }

            await driver.get(this.host);

            
            await this.elementInteractor.login(driver, this.username, this.password);

            // while(true) {
            //     if(await this.elementInteractor.elementExists(driver, data.noLicense)) {
            //         await this.elementInteractor.login(driver, this.username, this.password);
            //     } else {
            //         break;
            //     }
            // }

            await this.elementInteractor.findAndClick(driver, data.analystSearchExport);
            await this.elementInteractor.findAndClick(driver, data.searchIn);

            await this.elementInteractor.findAndClick(driver, data.requestStatus);
            await this.elementInteractor.findAndClick(driver, data.openingDate);

            await this.elementInteractor.findAndSendKeys(driver, data.initialDate, initialDate);
            await this.elementInteractor.findAndSendKeys(driver, data.finalDate, finalDate);
            await this.elementInteractor.findAndClick(driver, data.applyButton);

            await this.elementInteractor.findAndClick(driver, data.searchButton);
            await this.elementInteractor.findAndClick(driver, data.downloadButton);

            const downloadedFilePath = await this.fileUtils.waitForDownloadToFinish(this.downloadPath);

            return downloadedFilePath;

        } catch (error) {
            console.error(`An error occurred: ${error}`);
        } finally {
            await driver.quit();
        }
    }
}


const report = new ReportService();
report.getReport("01/01/2023", "31/03/2023");
report.getReport("01/04/2023", "30/06/2023");
report.getReport("01/07/2023", "30/09/2023");
report.getReport("01/10/2023", "31/12/2023");
report.getReport("01/01/2024", "31/03/2024");
report.getReport("01/04/2024", "30/06/2024");
report.getReport("01/07/2024", "30/09/2024");
report.getReport("01/10/2024", "31/12/2024");



// async function generateReportsSequentially() {
//     const report = new ReportService();

//     try {
//         await report.getReport("01/01/2023", "31/03/2023");
//         await report.getReport("01/04/2023", "30/06/2023");
//         await report.getReport("01/07/2023", "30/09/2023");
//         await report.getReport("01/10/2023", "31/12/2023");
//         await report.getReport("01/01/2024", "31/03/2024");
//         await report.getReport("01/04/2024", "30/06/2024");
//         await report.getReport("01/07/2024", "30/09/2024");
//         await report.getReport("01/10/2024", "31/12/2024");

//         console.log("Todos os relatórios foram gerados com sucesso.");
//     } catch (error) {
//         console.error("Erro ao gerar os relatórios:", error);
//     }
// }

// generateReportsSequentially();