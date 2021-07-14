import { SagasFolder } from '../Constants/FolderConstants'
import { fileNameExtension } from '../Constants/SagasConstants'
import AbstractFluxController from './AbstractFluxController'

export default class SagasController extends AbstractFluxController {
    constructor(filePath: string) {
        super(SagasFolder, filePath)
    }

    public createFile(
        modelName: string,
        fluxExtension: string = fileNameExtension
    ): number {
        return super.createFile(modelName, fluxExtension)
    }
}
