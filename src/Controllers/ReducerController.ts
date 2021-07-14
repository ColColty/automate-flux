import { ReducersFolder } from '../Constants/FolderConstants'
import { fileNameExtension } from '../Constants/ReducerConstants'
import FluxController from './FluxController'

export default class ReducerController extends FluxController {
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
