import { writeFileSync } from 'fs'
import { StoreFolder } from '../Constants/FolderConstants'
import { toCamelCase } from '../Utils/utils'
import AbstractFluxController from './AbstractFluxController'
import ReducerController from './ReducerController'

export const fileNameExtension = 'Store'
export const fileNameAppend = 'configure'

export default class StoreController extends AbstractFluxController {
    constructor(filePath: string) {
        super(StoreFolder, filePath)
    }

    public createFile(
        modelName: string,
        fluxExtension: string = fileNameExtension
    ): number {
        return super.createFile(modelName, fluxExtension)
    }

    public generateImportState(reducerController: ReducerController): string {
        return `import { ${reducerController.getStateName()} } from '@/${reducerController.getFolderName()}/${reducerController
            .getFileName()
            .replace(/\.ts$/, '')}'`
    }

    public generateStateLine(
        reducerController: ReducerController,
        modelName: string
    ): string {
        return `    ${toCamelCase(
            modelName
        )}: ${reducerController.getStateName()}`
    }

    public appendStores(
        fd: number,
        storeImport: string,
        stateLine: string,
        storeContent: string
    ): void {
        let rootLines = storeContent.split('\n')
        let inImports = false
        let inInterface = false

        rootLines = rootLines.map((el) => {
            if (el.match(/^import /)) {
                inImports = true
            } else if (inImports) {
                inImports = false
                return storeImport + '\n' + el
            }

            if (
                el.match(/^export interface (\w+) {$/) ||
                el.match(/^ {4}(\w+): (\w+)$/)
            ) {
                inInterface = true
            } else if (inInterface) {
                inInterface = false
                return stateLine + '\n' + el
            }
            return el
        })

        writeFileSync(fd, rootLines.join('\n'))
    }
}
