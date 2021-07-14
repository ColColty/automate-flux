import { fileNameExtension } from '../Constants/ActionCreatorConstants'
import { ActionCreatorsFolder } from '../Constants/FolderConstants'
import AbstractFluxController from './AbstractFluxController'

export default class ActionCreatorController extends AbstractFluxController {
    constructor(filePath: string) {
        super(ActionCreatorsFolder, filePath)
    }

    public createFile(
        modelName: string,
        fluxExtension: string = fileNameExtension
    ): number {
        return super.createFile(modelName, fluxExtension)
    }
}
