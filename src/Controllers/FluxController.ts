import * as fs from 'fs'
import * as path from 'path'
import { capitalize, toCamelCase } from '../Utils/utils'

export default abstract class FluxController {
    protected folderName: string
    protected folderPath: string
    protected lines: string[]

    constructor(folderName: string, folderPath: string) {
        this.folderName = folderName
        this.folderPath = folderPath
        this.lines = []
    }

    public createFile(modelName: string, fluxExtension: string): number {
        const filename =
            capitalize(toCamelCase(modelName)) + fluxExtension + '.ts'
        const filePath = path.join(this.folderPath, filename)

        const fd = fs.openSync(filePath, 'a+')

        return fd
    }

    // public appendFile(fd: number, content: string) {
    //     // TODO Append to file
    // }

    public writeFile(fd: number): void {
        fs.appendFileSync(fd, this.lines.join('\n') + '\n')
    }

    public addLine(line: string): void {
        this.lines.push(line)
    }
}
