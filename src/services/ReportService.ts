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
