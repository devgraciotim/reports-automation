const { Builder, Browser, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const fs = require('fs');
import { data } from "../data/xpath";


// Definir o caminho do diretório de downloads
const downloadPath = path.resolve(__dirname, '../../downloads');

// Configurar preferências do Chrome
const options = new chrome.Options();
    options.addArguments('--headless'); // Define o modo headless
    options.addArguments('--disable-gpu'); // Recomendado para compatibilidade no modo headless
    options.addArguments('--no-sandbox'); // Necessário em alguns ambientes (ex.: CI/CD)
    options.addArguments('--disable-dev-shm-usage'); // Melhora o uso de memória compartilhada em containers
    options.setUserPreferences({
        "download.default_directory": downloadPath, // Define o diretório de download
        "download.prompt_for_download": false, // Evita prompts de download
        "safebrowsing.enabled": true, // Evita avisos de segurança
        "download.directory_upgrade": true // Atualiza o diretório automaticamente
    });


export class ReportService {

    async getReport(initialDate: string, finalDate: string) {
        const driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build();

        try {
            await driver.get("https://mabu.requestia.com/");

            // Espera explícita para garantir que o campo de usuário esteja presente
            await driver.wait(until.elementLocated(By.xpath(data.usernameInput)), 10000);
            await driver.findElement(By.xpath(data.usernameInput)).sendKeys("export");

            // Input de senha
            await driver.findElement(By.xpath(data.passwordInput)).sendKeys("#Requestia@123");

            // Botão de login
            await driver.findElement(By.xpath(data.loginButton)).click();
            await driver.wait(until.elementLocated(By.xpath(data.analystSearchExport)), 10000);

            // Botão de pesquisar em contexto analista
            await driver.findElement(By.xpath(data.analystSearchExport)).click();
            await driver.wait(until.elementLocated(By.xpath(data.searchIn)), 10000);

            // Input "Pesquisar em:"
            await driver.findElement(By.xpath(data.searchIn)).click();

            // Status do chamado (abertos e fechados) - Seleção do input "Pesquisar em:"
            await driver.findElement(By.xpath(data.requestStatus)).click();

            // Periodo desejado - input "Data Abertura:"
            await driver.findElement(By.xpath(data.openingDate)).click();

            // Input data inicial do periodo desejado
            await driver.findElement(By.xpath(data.initialDate)).clear();
            await driver.findElement(By.xpath(data.initialDate)).sendKeys(initialDate);
            
            // Input data final do periodo desejado
            await driver.findElement(By.xpath(data.finalDate)).clear();
            await driver.findElement(By.xpath(data.finalDate)).sendKeys(finalDate);

            // Botão aplicar
            await driver.findElement(By.xpath(data.applyButton)).click();

            // Botão pesquisar
            await driver.findElement(By.xpath(data.searchButton)).click();
            await driver.wait(until.elementLocated(By.xpath(data.downloadButton)), 10000);
            await driver.sleep(1000)


            // Botão de download de relatório
            await driver.findElement(By.xpath(data.downloadButton)).click();

            // Espera o arquivo ser baixado
            const downloadedFilePath = await this.waitForDownloadToFinish(downloadPath);

            return downloadedFilePath;  // Retorna o caminho do arquivo baixado

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
    };
}