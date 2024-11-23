import { Options } from 'selenium-webdriver/chrome';
import path from 'path';

const chrome: { Options: typeof Options } = require('selenium-webdriver/chrome');

export const downloadPath = path.resolve(__dirname, '../../downloads');

export const chromeOptions: Options = new chrome.Options();
    chromeOptions.addArguments('--headless');
    chromeOptions.addArguments('--disable-gpu');
    chromeOptions.addArguments('--no-sandbox');
    chromeOptions.addArguments('--disable-dev-shm-usage');
    chromeOptions.setUserPreferences({
        "download.default_directory": downloadPath,
        "download.prompt_for_download": false,
        "safebrowsing.enabled": true,
        "download.directory_upgrade": true
    });