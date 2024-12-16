import { WebDriver, By, until, WebElement } from "selenium-webdriver";
import { data } from "../data/xpath";

export class ElementInteractor {
    async findAndSendKeys(driver: WebDriver, xpath: string, keys: string, timeout: number = 10000): Promise<void> {
        try {
            await driver.wait(until.elementLocated(By.xpath(xpath)), timeout, `Elemento com xpath ${xpath} não encontrado dentro do tempo limite`);
            const element: WebElement = await driver.findElement(By.xpath(xpath));
            await element.clear();
            await element.sendKeys(keys);
        } catch (error) {
            console.error(`Erro ao enviar keys para o elemento com xpath ${xpath}:`, error);
        }
    }

    async findAndClick(driver: WebDriver, xpath: string, timeout: number = 10000): Promise<void> {
        try {
            await driver.wait(until.elementLocated(By.xpath(xpath)), timeout, `Elemento com xpath ${xpath} não encontrado dentro do tempo limite`);
            const element: WebElement = await driver.findElement(By.xpath(xpath));
            await element.click();
        } catch (error) {
            console.error(`Erro ao clicar no elemento com xpath ${xpath}:`, error);
        }
    }

    async login(driver: WebDriver, username: string, password: string): Promise<void> {
        try {
            await this.findAndSendKeys(driver, data.usernameInput, username);
            await this.findAndSendKeys(driver, data.passwordInput, password);
            await this.findAndClick(driver, data.loginButton);
        } catch (error) {
            console.error('Erro ao realizar login:', error);
        }
    }

    async elementExists(driver: WebDriver, xpath: string): Promise<boolean> {
        try {
            await driver.findElement(By.xpath(xpath));
            console.log("Element encontrado")
            return true;
        } catch (error) {
            return false;
        }
    }
}