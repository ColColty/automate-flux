import ActionCreatorController from "../Controllers/ActionCreatorController";
import ActionTypeController from "../Controllers/ActionTypeController";
import ReducerController from "../Controllers/ReducerController";
import SagasController from "../Controllers/SagasController";
import ServiceController from "../Controllers/ServiceController";
import FileWatcher from "../fileWatcher/FileWatcher";
import ParsedModel from "../Models/ParsedModel";
import ParsedProperty from "../Models/ParsedProperty";
import { getSendProperty, toCamelCase } from "../Utils/utils";
import createActionType from "./createActionType";

export default function fluxCreator(fileWatcher: FileWatcher, parsedModel: ParsedModel) {
    const propertiesSuccess: ParsedProperty[] = [
        {
            name: toCamelCase(parsedModel.interfaceName),
            type: parsedModel.interfaceName,
            optional: false
        }
    ]
    let propertiesSend: ParsedProperty[] = []

    getSendProperty(propertiesSend).then(res => {
        parsedModel.propertiesSuccess = propertiesSuccess
        parsedModel.propertiesSend = res

        fileWatcher.getFolderPaths().forEach((val, key) => {
            switch (val.constructor) {
                case ActionTypeController:
                    createActionType(<ActionTypeController>val, parsedModel)
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
    })
}