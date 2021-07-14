import { ServicesFolder } from '../Constants/FolderConstants'
import { fileNameExtension } from '../Constants/ServiceConstants'
import AbstractFluxController from './AbstractFluxController'

export default class ServiceController extends AbstractFluxController {
    constructor(filePath: string) {
        super(ServicesFolder, filePath)
    }

    public createFile(
        modelName: string,
        fluxExtension: string = fileNameExtension
    ): number {
        return super.createFile(modelName, fluxExtension)
    }
}
