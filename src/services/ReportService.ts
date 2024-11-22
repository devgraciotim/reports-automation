import { WebDriver, Builder, Browser, By, until, WebElement } from "selenium-webdriver";
import { data } from "../data/xpath";
import { chromeOptions, downloadPath } from "../config/chromeConfig";
import path from "path";
import fs from "fs";


export class ReportService {
    async initDriver() {
        return await new Builder().forBrowser(Browser.CHROME).setChromeOptions(chromeOptions).build();
    }

    private async findAndSendKeys(driver: WebDriver, xpath: string, keys: string) {
        await driver?.wait(until.elementLocated(By.xpath(xpath)), 10000);
        const element: WebElement = await driver?.findElement(By.xpath(xpath));
        await element?.clear();
        await element?.sendKeys(keys);
    }

    private async findAndClick(driver: WebDriver, xpath: string) {
        await driver?.wait(until.elementLocated(By.xpath(xpath)), 10000);
        const element: WebElement = await driver?.findElement(By.xpath(xpath));
        await element?.click();
    }

    async login(driver: WebDriver, username: string, password: string) {
        await this.findAndSendKeys(driver, data.usernameInput, username)
        await this.findAndSendKeys(driver, data.passwordInput, password)
        await this.findAndClick(driver, data.loginButton);
    }

    async getReport(initialDate: string, finalDate: string) {
        const driver: WebDriver = await this.initDriver();

        try {
            await driver.get("https://mabu.requestia.com/");

            await this.login(driver, "export", "#Requestia@123");

            await this.findAndClick(driver, data.analystSearchExport);
            await this.findAndClick(driver, data.searchIn);

            await this.findAndClick(driver, data.requestStatus);
            await this.findAndClick(driver, data.openingDate);
            await this.findAndSendKeys(driver, data.initialDate, initialDate);
            await this.findAndSendKeys(driver, data.finalDate, finalDate);

            await this.findAndClick(driver, data.applyButton);

            await driver.findElement(By.xpath(data.searchButton)).click();
            await this.findAndClick(driver, data.searchButton);

            await this.findAndClick(driver, data.downloadButton);

            const downloadedFilePath = await this.waitForDownloadToFinish(downloadPath);

            return downloadedFilePath;

        } catch (error) {
            console.error(`An error occurred: ${error}`);
        } finally {
            await driver.quit();
        }
    }

    async waitForDownloadToFinish(downloadPath: string, timeout = 1800000) {
        const startTime = Date.now();
        let downloaded = false;
        let downloadedFilePath = '';
    
        while (!downloaded) {
            const files = fs.readdirSync(downloadPath);
    
            // Verifica se ainda existem arquivos temporários (como .crdownload ou .tmp)
            const hasTempFiles = files.some((file: string) => file.endsWith('.crdownload') || file.endsWith('.tmp'));
    
            if (!hasTempFiles && files.length > 0) {
                // Pega o caminho completo do arquivo
                downloadedFilePath = path.join(downloadPath, files[0]);
                downloaded = true;
            } else if (Date.now() - startTime > timeout) {
                throw new Error("O tempo de espera para o download expirou.");
            } else {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    
        // Retorna o caminho completo do arquivo
        console.log(`Arquivo baixado com sucesso: ${downloadedFilePath}`);
        return downloadedFilePath;
    }
    
    async getAllPeriod() {  
        // Chama a função getReport e aguarda o caminho do arquivo
        return await this.getReport("11/11/2024", this.getFormattedDate());
    }

    getFormattedDate() {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
    
        return `${day}/${month}/${year}`;
    }
}

const report = new ReportService()
report.getAllPeriod()