import { fileNameExtension } from "../Constants/ActionCreatorConstants";
import { ActionCreatorsFolder } from "../Constants/FolderConstants";
import FluxController from "./FluxController";

export default class ActionCreatorController extends FluxController {
    constructor(filePath: string) {
        super(ActionCreatorsFolder, filePath)
    }

    public newFile(modelName: string): number {
        return super.createFile(modelName, fileNameExtension)
    }
}