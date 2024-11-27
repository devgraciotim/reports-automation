import { WebDriver, Builder, Browser, By, until, WebElement } from "selenium-webdriver";
import { data } from "../data/xpath";
import { chromeOptions, downloadPath } from "../config/chromeConfig";
import path from "path";
import fs from "fs";
import dotenv from 'dotenv';

import { DateUtils } from "../utils/DateUtils";
import { NameUtils } from "../utils/NameUtils";
import { ElementInteractor } from "../interactors/ElementInteractor";

dotenv.config();

export class ReportService {

    dateUtils = new DateUtils(); 
    nameUtils = new NameUtils();
    elementInteractor = new ElementInteractor();

    private host: string = process.env.HOST!;
    private username: string = process.env.USER!;
    private password: string = process.env.PASSWORD!;

    async initDriver(): Promise<WebDriver> {
        return await new Builder().forBrowser(Browser.CHROME).setChromeOptions(chromeOptions).build();
    }

    

    async getReport(initialDate: string = "01/01/2023", finalDate: string = this.dateUtils.getFormattedDate()): Promise<string | undefined> {
        const driver: WebDriver = await this.initDriver();

        try {
            console.log({ host: this.host, username: this.username, password: this.password })

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

            const downloadedFilePath = await this.waitForDownloadToFinish(downloadPath);

            return downloadedFilePath;

        } catch (error) {
            console.error(`An error occurred: ${error}`);
        } finally {
            await driver.quit();
        }
    }

    async waitForDownloadToFinish(downloadPath: string, timeout = 1800000): Promise<string> {
        const startTime = Date.now();
        let downloaded = false;
        let downloadedFilePath = '';

        while (!downloaded) {
            const files = fs.readdirSync(downloadPath);

            // Verifica se o arquivo desejado foi baixado
            const file = files.find((file: string) => file === 'Caixa_de_Entrada.xlsx');

            if (file) {
                // Pega o caminho completo do arquivo
                downloadedFilePath = path.join(downloadPath, file);
                downloaded = true;

                // Renomeia o arquivo
                const newFilePath = path.join(downloadPath, this.nameUtils.getNewName());
                fs.renameSync(downloadedFilePath, newFilePath);
                console.log(`Arquivo renomeado com sucesso: ${newFilePath}`);
                downloadedFilePath = newFilePath;
            } else if (Date.now() - startTime > timeout) {
                throw new Error("O tempo de espera para o download expirou.");
            } else {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        console.log(`Arquivo baixado com sucesso: ${downloadedFilePath}`);
        return downloadedFilePath;
    }
}