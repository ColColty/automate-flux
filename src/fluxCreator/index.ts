import {
    ActionCreatorsFolder,
    ActionTypesFolder,
} from '../Constants/FolderConstants'
import ActionCreatorController from '../Controllers/ActionCreatorController'
import ActionTypeController from '../Controllers/ActionTypeController'
import FileWatcher from '../fileWatcher/FileWatcher'
import ParsedModel from '../Models/ParsedModel'
import ParsedProperty from '../Models/ParsedProperty'
import { getSendProperty, toCamelCase } from '../Utils/utils'
import createActionCreator from './createActionCreator'
import createActionType from './createActionType'

export default function fluxCreator(
    fileWatcher: FileWatcher,
    parsedModel: ParsedModel
): void {
    const propertiesSuccess: ParsedProperty[] = [
        {
            name: toCamelCase(parsedModel.interfaceName),
            type: parsedModel.interfaceName,
            optional: false,
        },
    ]
    const propertiesSend: ParsedProperty[] = []

    getSendProperty(propertiesSend).then((res) => {
        parsedModel.propertiesSuccess = propertiesSuccess
        parsedModel.propertiesSend = res

        const actionTypeController =
            fileWatcher.getFolderPath(ActionTypesFolder)
        const actionCreatorController =
            fileWatcher.getFolderPath(ActionCreatorsFolder)

        if (actionTypeController && actionCreatorController) {
            createActionType(
                <ActionTypeController>actionTypeController,
                parsedModel
            )
            createActionCreator(
                <ActionTypeController>actionTypeController,
                <ActionCreatorController>actionCreatorController,
                parsedModel
            )
        }

        // fileWatcher.getFolderPaths().forEach((val) => {
        //     switch (val.constructor) {
        //     case ActionTypeController:
        //         createActionType(<ActionTypeController>val, parsedModel)
        //         break
        //     case ActionCreatorController:
        //         break
        //     case ReducerController:
        //         break
        //     case SagasController:
        //         break
        //     case ServiceController:
        //         break
        //     }
        // })
    })
}
