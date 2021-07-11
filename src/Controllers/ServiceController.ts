import { ServicesFolder } from "../Constants/FolderConstants";
import { fileNameExtension } from "../Constants/ServiceConstants";
import FluxController from "./FluxController";

export default class ServiceController extends FluxController {
    constructor(filePath: string) {
        super(ServicesFolder, filePath)
    }

    public newFile(modelName: string): number {
        return super.createFile(modelName, fileNameExtension)
    }
}