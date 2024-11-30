import path from 'path';
import fs from "fs";

import { NameUtils } from "./NameUtils";

export class FileUtils {

    nameUtils: NameUtils = new NameUtils();

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


    formatPath(pathParam: string) {
        return path.resolve(__dirname, pathParam);
    }
}