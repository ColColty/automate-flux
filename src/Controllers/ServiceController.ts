import { ServicesFolder } from '../Constants/FolderConstants'
import { fileNameExtension } from '../Constants/ServiceConstants'
import AbstractFluxController from './AbstractFluxController'

export default class ServiceController extends AbstractFluxController {
    private serviceName: string

    constructor(filePath: string) {
        super(ServicesFolder, filePath)

        this.serviceName = ''
    }

    public getServiceName(): string {
        return this.serviceName
    }

    public createFile(
        modelName: string,
        fluxExtension: string = fileNameExtension
    ): number {
        return super.createFile(modelName, fluxExtension)
    }
}
