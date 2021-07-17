import { closeSync, ftruncateSync, readFileSync } from 'fs'
import { rootFileName } from '../Constants/ReducerConstants'
import ActionTypeController from '../Controllers/ActionTypeController'
import ReducerController from '../Controllers/ReducerController'
import ParsedModel from '../Models/ParsedModel'
import ParsedProperty from '../Models/ParsedProperty'

function createRootFile(
    reducerController: ReducerController,
    parsedModel: ParsedModel
): void {
    let fdRoot = reducerController.createFile(rootFileName)

    const rootData = readFileSync(fdRoot)

    if (rootData.length) {
        const dataString = rootData.toString()
        closeSync(fdRoot)

        fdRoot = reducerController.createFile(rootFileName)

        ftruncateSync(fdRoot, 0)

        reducerController.appendRootFile(
            fdRoot,
            parsedModel.interfaceName,
            dataString
        )
    } else {
        reducerController.generateRootFile(fdRoot, parsedModel.interfaceName)
    }

    closeSync(fdRoot)
}

export default function createReducer(
    actionTypeController: ActionTypeController,
    reducerController: ReducerController,
    parsedModel: ParsedModel
): void {
    const fd = reducerController.createFile(parsedModel.interfaceName)

    const data = readFileSync(fd)

    const allProperties: ParsedProperty[][] = [
        [],
        parsedModel.propertiesSuccess
            ? parsedModel.propertiesSuccess.map((el) => ({
                ...el,
                defaultValue: `action.${el.name}`,
            }))
            : [],
        [
            {
                name: 'error',
                type: 'Error | string',
                optional: false,
                defaultValue: 'action.error',
            },
        ],
    ]

    if (data.length) {
        // TODO Append to file
    } else {
        reducerController.generateImports(
            actionTypeController,
            parsedModel.interfaceName
        )

        const reducers: string[] = []
        reducerController.generateStateInterface(
            parsedModel.interfaceName,
            parsedModel.propertiesSuccess ? parsedModel.propertiesSuccess : []
        )

        actionTypeController.getActionTypeNames().forEach((el, i) => {
            reducers.push(
                reducerController.generateReducer(el, allProperties[i])
            )
        })
        reducerController.generateReducerFunction(
            parsedModel.interfaceName,
            actionTypeController,
            reducers
        )

        reducerController.writeFile(fd)

        createRootFile(reducerController, parsedModel)
    }

    closeSync(fd)
}
