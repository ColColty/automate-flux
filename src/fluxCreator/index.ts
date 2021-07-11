import ActionCreatorController from "../Controllers/ActionCreatorController";
import ActionTypeController from "../Controllers/ActionTypeController";
import ReducerController from "../Controllers/ReducerController";
import SagasController from "../Controllers/SagasController";
import ServiceController from "../Controllers/ServiceController";
import FileWatcher from "../fileWatcher/FileWatcher";
import ParsedModel from "../Models/ParsedModel";
import createActionType from "./createActionType";

export default function fluxCreator(fileWatcher: FileWatcher, parsedModel: ParsedModel) {

    fileWatcher.getFolderPaths().forEach((val, key) => {
        switch (val.constructor) {
            case ActionTypeController:
                createActionType(val, parsedModel)
                break;
            case ActionCreatorController:
                break;
            case ReducerController:
                break;
            case SagasController:
                break;
            case ServiceController:
                break;
        }
    })
}