import * as fs from 'fs'
import * as path from 'path'
import { generateModelImport } from '../Constants/ModelConstants'
import { capitalize, toCamelCase } from '../Utils/utils'
import ActionTypeController from './ActionTypeController'

export default abstract class AbstractFluxController {
    protected folderName: string
    protected folderPath: string
    protected fileName: string
    protected lines: string[]

    constructor(folderName: string, folderPath: string) {
        this.folderName = folderName
        this.folderPath = folderPath
        this.fileName = ''
        this.lines = []
    }

    public createFile(modelName: string, fluxExtension: string): number {
        let filename = ''

        if (modelName.toLowerCase().includes('root')) {
            filename =
                capitalize(toCamelCase(modelName)) + fluxExtension + '.ts'
        } else {
            this.fileName =
                capitalize(toCamelCase(modelName)) + fluxExtension + '.ts'
            filename = this.fileName
        }

        const filePath = path.join(this.folderPath, filename)

        let fd = 0

        try {
            fd = fs.openSync(filePath, 'r+')
        } catch {
            fd = fs.openSync(filePath, 'w+')
        }

        return fd
    }

    public generateImports(
        actionTypeController: ActionTypeController,
        modelName: string
    ): void {
        const actionsImport = `import * as actions from '@/${actionTypeController.getFolderName()}/${actionTypeController
            .getFileName()
            .replace(/.ts(x)?/, '')}'`
        const modelImport = generateModelImport(modelName)

        this.lines.push([actionsImport, modelImport].join('\n'))
    }

    public appendFile(
        fd: number,
        content: string = this.lines.join('\n')
    ): void {
        fs.appendFileSync(fd, content + '\n')
    }

    public writeFile(
        fd: number,
        content: string = this.lines.join('\n')
    ): void {
        fs.writeSync(fd, content + '\n')
    }

    public addLine(line: string): void {
        this.lines.push(line)
    }

    public getFolderName(): string {
        return this.folderName
    }

    public getFileName(): string {
        return this.fileName
    }

    public getFolderPath(): string {
        return this.folderPath
    }

    public reset(): void {
        this.lines = []
        this.fileName = ''
    }
}
