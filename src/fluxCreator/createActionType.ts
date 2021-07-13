import * as fs from 'fs'
import { ActionTypeContent, exportActionTypes } from '../Constants/ActionTypeConstants';
import { errorProperties } from '../Constants/Constants';
import { generateModelImport } from '../Constants/ModelConstants';
import ActionTypeController from "../Controllers/ActionTypeController";
import ParsedModel from "../Models/ParsedModel";
import { camelToSnakeCase, capitalize } from '../Utils/utils';

function fillFile(parsedModel: ParsedModel, actionName: string, fd: number) {
    const lines: string[] = []
    const actionTypeNames: string[] = []

    lines.push(generateModelImport(parsedModel.interfaceName))

    const actionType = ActionTypeContent(parsedModel.interfaceName, actionName, parsedModel.propertiesSend || [])
    lines.push(actionType.content)
    actionTypeNames.push(actionType.actionTypeName)

    const actionTypeSuccess = ActionTypeContent(parsedModel.interfaceName, actionName, parsedModel.propertiesSuccess || [], true)
    lines.push(actionTypeSuccess.content)
    actionTypeNames.push(actionTypeSuccess.actionTypeName)

    const actionTypeFailure = ActionTypeContent(parsedModel.interfaceName, actionName, errorProperties, false)
    lines.push(actionTypeFailure.content)
    actionTypeNames.push(actionTypeFailure.actionTypeName)

    const exportTypes = exportActionTypes(parsedModel.interfaceName, actionTypeNames, false)
    lines.push(exportTypes)

    fs.appendFileSync(fd, lines.join('\n'))
}

export default function createActionType(actionTypeController: ActionTypeController, parsedModel: ParsedModel) {
    const fd = actionTypeController.createFile(parsedModel.interfaceName)

    const actionName = 'ADD' + camelToSnakeCase(capitalize(parsedModel.interfaceName)).toUpperCase()
    const data = fs.readFileSync(fd)

    if (data.length) {
        // TODO Append to file
    } else {
        fillFile(parsedModel, actionName, fd)
    }
}