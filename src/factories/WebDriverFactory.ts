import { WebDriver, Builder } from "selenium-webdriver";
import * as chrome from "selenium-webdriver/chrome";

interface IWebOptions {
  headless: boolean;
  gpuUsage?: boolean;
  sandbox?: boolean;
  devShmUsage?: boolean;
  downloadDirectory: string;
}

interface IWebDriverFactory {
  createDriver(options?: IWebOptions): WebDriver;
}

export class ChromeDriverFactory implements IWebDriverFactory {
  private initOptions(options?: IWebOptions): chrome.Options {
    const chromeOptions = new chrome.Options();

    if (options?.headless) {
      chromeOptions.addArguments("--headless");
    }
    if (options?.gpuUsage) {
      chromeOptions.addArguments("--disable-gpu");
    }
    if (options?.sandbox) {
      chromeOptions.addArguments("--no-sandbox");
    }
    if (options?.devShmUsage) {
      chromeOptions.addArguments("--disable-dev-shm-usage");
    }

    chromeOptions.setUserPreferences({
      "download.default_directory": options?.downloadDirectory,
      "download.prompt_for_download": false,
      "safebrowsing.enabled": true,
      "download.directory_upgrade": true,
    });
    
    return chromeOptions;
  }

  createDriver(options?: IWebOptions): WebDriver {
    const chromeOptions = this.initOptions(options);
    return new Builder()
      .forBrowser("chrome")
      .setChromeOptions(chromeOptions)
      .build();
  }
}
