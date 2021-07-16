import {
    ActionCreatorsFolder,
    ActionTypesFolder,
    ReducersFolder,
} from '../Constants/FolderConstants'
import ActionCreatorController from '../Controllers/ActionCreatorController'
import ActionTypeController from '../Controllers/ActionTypeController'
import ReducerController from '../Controllers/ReducerController'
import FileWatcher from '../fileWatcher/FileWatcher'
import ParsedModel from '../Models/ParsedModel'
import ParsedProperty from '../Models/ParsedProperty'
import { getSendProperty, toCamelCase } from '../Utils/utils'
import createActionCreator from './createActionCreator'
import createActionType from './createActionType'
import createReducer from './createReducer'

export default function fluxCreator(
    fileWatcher: FileWatcher,
    parsedModel: ParsedModel
): void {
    const propertiesSuccess: ParsedProperty[] = [
        {
            name: toCamelCase(parsedModel.interfaceName),
            type: parsedModel.interfaceName,
            optional: true,
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
        const reducerController = fileWatcher.getFolderPath(ReducersFolder)

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
            createReducer(
                <ReducerController>reducerController,
                <ActionTypeController>actionTypeController,
                parsedModel
            )
        }

        fileWatcher.getFolderPaths().forEach((val) => val.reset())
    })
}
