import { ServicesFolder } from '../Constants/FolderConstants'
import { fileNameExtension } from '../Constants/ServiceConstants'
import FluxController from './FluxController'

export default class ServiceController extends FluxController {
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
