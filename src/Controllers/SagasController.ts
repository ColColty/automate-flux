import { SagasFolder } from "../Constants/FolderConstants";
import { fileNameExtension } from "../Constants/SagasConstants";
import FluxController from "./FluxController";

export default class SagasController extends FluxController {
    constructor(filePath: string) {
        super(SagasFolder, filePath)
    }

    public createFile(modelName: string, fluxExtension: string = fileNameExtension): number {
        return super.createFile(modelName, fluxExtension)
    }
}