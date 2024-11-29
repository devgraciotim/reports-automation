import { WebDriver, Builder } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';

interface WebOptions {
  headless: boolean;
  userPreferences: {};
}

interface WebDriverFactory {
  createDriver(options?: chrome.Options): WebDriver;
  initOptions(options?: WebOptions): chrome.Options;
}

export class ChromeDriverFactory implements WebDriverFactory  {

    initOptions(options?: WebOptions): chrome.Options {
      const chromeOptions = new chrome.Options();
    
    chromeOptions.addArguments('--disable-gpu');
    chromeOptions.addArguments('--no-sandbox');
    chromeOptions.addArguments('--disable-dev-shm-usage');

    if (options?.headless) {
      chromeOptions.addArguments('--headless');
    }
    if (options?.userPreferences) {
      chromeOptions.setUserPreferences(options.userPreferences);
    } else {
      // const downloadPath = '/path/to/download';
      // chromeOptions.setUserPreferences('prefs', {
      //   'download.default_directory': downloadPath,
      //   'download.prompt_for_download': false,
      //   'safebrowsing.enabled': true,
      //   'download.directory_upgrade': true
      // });
    }

    return chromeOptions;
  }

  createDriver(options?: chrome.Options): WebDriver {
    const chromeOptions = options || this.initOptions();
    return new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
}

}