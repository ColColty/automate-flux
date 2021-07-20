import { closeSync, readFileSync } from 'fs'
import ActionCreatorController from '../Controllers/ActionCreatorController'
import ActionTypeController from '../Controllers/ActionTypeController'
import ParsedModel from '../Models/ParsedModel'
import ParsedProperty from '../Models/ParsedProperty'

export default function createActionCreator(
    actionTypeController: ActionTypeController,
    actionCreatorController: ActionCreatorController,
    parsedModel: ParsedModel
): void {
    const fd = actionCreatorController.createFile(parsedModel.interfaceName)

    const data = readFileSync(fd)
    const properties: ParsedProperty[][] = [
        parsedModel.propertiesSend ? parsedModel.propertiesSend : [],
        parsedModel.propertiesSuccess ? parsedModel.propertiesSuccess : [],
        [
            {
                name: 'error',
                type: 'Error | string',
                optional: true,
            },
        ],
    ]

    if (data.length) {
        actionCreatorController.addLine('\n')

        actionTypeController.getActionTypeNames().forEach((el, i) => {
            actionCreatorController.addActionCreator(
                actionTypeController.getActionTypeInterfacesNames()[i],
                el,
                actionTypeController.getActionTypeIdentifiers()[i],
                properties[i].sort(
                    (a, b) => (a.optional && !b.optional && -1) || 1
                )
            )
        })

        actionCreatorController.appendFile(fd)
    } else {
        actionCreatorController.generateImports(
            actionTypeController,
            parsedModel.interfaceName
        )

        actionTypeController.getActionTypeNames().forEach((el, i) => {
            actionCreatorController.addActionCreator(
                actionTypeController.getActionTypeInterfacesNames()[i],
                el,
                actionTypeController.getActionTypeIdentifiers()[i],
                properties[i].sort(
                    (a, b) => (a.optional && !b.optional && -1) || 1
                )
            )
        })

        actionCreatorController.writeFile(fd)
    }

    closeSync(fd)
}
