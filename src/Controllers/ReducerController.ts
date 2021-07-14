import { ReducersFolder } from '../Constants/FolderConstants'
import { fileNameExtension } from '../Constants/ReducerConstants'
import AbstractFluxController from './AbstractFluxController'

export default class ReducerController extends AbstractFluxController {
    constructor(filePath: string) {
        super(ReducersFolder, filePath)
    }

    public createFile(
        modelName: string,
        fluxExtension: string = fileNameExtension
    ): number {
        return super.createFile(modelName, fluxExtension)
    }
}
