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
    const fd = actionTypeController.createFile(parsedModel.interfaceName)

    const actionName =
        'ADD' +
        camelToSnakeCase(capitalize(parsedModel.interfaceName)).toUpperCase()
    const data = fs.readFileSync(fd)

    if (data.length) {
        // TODO Append to file
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
}
