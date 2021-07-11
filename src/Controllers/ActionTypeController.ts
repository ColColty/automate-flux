import { fileNameExtension } from "../Constants/ActionTypeConstants"
import { ActionTypesFolder } from "../Constants/FolderConstants"
import FluxController from "./FluxController"

export default class ActionTypeController extends FluxController {
    constructor(folderPath: string) {
        super(ActionTypesFolder, folderPath)
    }

    public newFile(modelName: string): number {
        return super.createFile(modelName, fileNameExtension)
    }
}