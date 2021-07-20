import * as fs from 'fs'
import { errorProperties } from '../Constants/Constants'
import { generateModelImport } from '../Constants/ModelConstants'
import ActionTypeController from '../Controllers/ActionTypeController'
import ParsedModel from '../Models/ParsedModel'
import { camelToSnakeCase, capitalize } from '../Utils/utils'

export default function createActionType(
    actionTypeController: ActionTypeController,
    parsedModel: ParsedModel
): void {
    let fd = actionTypeController.createFile(parsedModel.interfaceName)

    const actionName =
        camelToSnakeCase(parsedModel.actionName || 'ADD').toUpperCase() +
        camelToSnakeCase(capitalize(parsedModel.interfaceName)).toUpperCase()
    const data = fs.readFileSync(fd)

    if (data.length) {
        const dataString = data.toString()
        fs.closeSync(fd)

        fd = actionTypeController.createFile(parsedModel.interfaceName)

        fs.ftruncateSync(fd, 0)

        actionTypeController.addLine('\n')

        actionTypeController.addActionType(
            parsedModel.interfaceName,
            actionName,
            parsedModel.propertiesSend || []
        )
        actionTypeController.addActionType(
            parsedModel.interfaceName,
            actionName,
            parsedModel.propertiesSuccess || [],
            true
        )
        actionTypeController.addActionType(
            parsedModel.interfaceName,
            actionName,
            errorProperties,
            false
        )

        actionTypeController.appendActionTypes(fd, dataString)
    } else {
        actionTypeController.addLine(
            generateModelImport(parsedModel.interfaceName)
        )

        actionTypeController.addActionType(
            parsedModel.interfaceName,
            actionName,
            parsedModel.propertiesSend || []
        )
        actionTypeController.addActionType(
            parsedModel.interfaceName,
            actionName,
            parsedModel.propertiesSuccess || [],
            true
        )
        actionTypeController.addActionType(
            parsedModel.interfaceName,
            actionName,
            errorProperties,
            false
        )

        actionTypeController.exportsActionTypeLines(parsedModel.interfaceName)

        actionTypeController.writeFile(fd)
    }

    fs.closeSync(fd)
}
