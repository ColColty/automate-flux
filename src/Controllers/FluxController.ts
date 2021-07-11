import * as fs from 'fs'
import * as path from 'path'
import { toCamelCase } from '../Utils/utils';

export default abstract class FluxController {
    protected folderName: string;
    protected folderPath: string;

    constructor(folderName: string, folderPath: string) {
        this.folderName = folderName
        this.folderPath = folderPath
    }

    public createFile(modelName: string, fluxExtension: string): number {
        const filename = toCamelCase(modelName) + fluxExtension + ".ts"
        const filePath = path.join(this.folderPath, filename)

        const fd = fs.openSync(filePath, 'w')

        return fd
    }

    // public appendFile(fd: number, content: string) {
    //     // TODO Append to file
    // }
}