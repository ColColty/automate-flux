import {
    ActionCreatorsFolder,
    ActionTypesFolder,
    ReducersFolder,
    SagasFolder,
    ServicesFolder,
    StoreFolder,
} from '../Constants/FolderConstants'
import ActionCreatorController from '../Controllers/ActionCreatorController'
import ActionTypeController from '../Controllers/ActionTypeController'
import ReducerController from '../Controllers/ReducerController'
import ServiceController from '../Controllers/ServiceController'
import FileWatcher from '../fileWatcher/FileWatcher'
import ParsedModel from '../Models/ParsedModel'
import ParsedProperty from '../Models/ParsedProperty'
import { getSendProperty, toCamelCase } from '../Utils/utils'
import createActionCreator from './createActionCreator'
import createActionType from './createActionType'
import createReducer from './createReducer'
import createService from './createService'
import * as vscode from 'vscode'
import createSagas from './createSagas'
import SagasController from '../Controllers/SagasController'
import createStore from './createStore'
import StoreController from '../Controllers/StoreController'

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

    getSendProperty(propertiesSend).then(async (res) => {
        parsedModel.propertiesSuccess = propertiesSuccess
        parsedModel.propertiesSend = res

        parsedModel.apiURL = await vscode.window.showInputBox({
            title: 'URL called by the service, if there is parameters, unse ${params.<name of the parameter>}',
        })
        parsedModel.apiVerb = await vscode.window.showQuickPick(
            ['post', 'get', 'put', 'delete', 'patch'],
            {
                title: 'API verb of the url',
            }
        )
        parsedModel.actionName = await vscode.window.showInputBox({
            title: 'Action name',
        })

        const actionTypeController =
            fileWatcher.getFolderPath(ActionTypesFolder)
        const actionCreatorController =
            fileWatcher.getFolderPath(ActionCreatorsFolder)
        const reducerController = fileWatcher.getFolderPath(ReducersFolder)
        const serviceController = fileWatcher.getFolderPath(ServicesFolder)
        const sagasController = fileWatcher.getFolderPath(SagasFolder)
        const storeController = fileWatcher.getFolderPath(StoreFolder)

        if (
            actionTypeController &&
            actionCreatorController &&
            reducerController &&
            serviceController
        ) {
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
                <ActionTypeController>actionTypeController,
                <ReducerController>reducerController,
                parsedModel
            )
            createService(
                <ActionTypeController>actionTypeController,
                <ServiceController>serviceController,
                parsedModel
            )
            createSagas(
                <ActionTypeController>actionTypeController,
                <ActionCreatorController>actionCreatorController,
                <ServiceController>serviceController,
                <SagasController>sagasController,
                parsedModel
            )
            createStore(
                <StoreController>storeController,
                <ReducerController>reducerController,
                parsedModel
            )
        }

        fileWatcher.getFolderPaths().forEach((val) => val.reset())
    })
}
