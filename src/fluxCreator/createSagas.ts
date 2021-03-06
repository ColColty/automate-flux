import { closeSync, ftruncateSync, readFileSync } from 'fs'
import ActionCreatorController from '../Controllers/ActionCreatorController'
import ActionTypeController from '../Controllers/ActionTypeController'
import SagasController, { rootFileName } from '../Controllers/SagasController'
import ServiceController from '../Controllers/ServiceController'
import ParsedModel from '../Models/ParsedModel'

function createRootFile(sagasController: SagasController): void {
    let fdRoot = sagasController.createFile(rootFileName)

    const rootData = readFileSync(fdRoot)

    if (rootData.length) {
        const dataString = rootData.toString()
        closeSync(fdRoot)

        fdRoot = sagasController.createFile(rootFileName)

        ftruncateSync(fdRoot, 0)

        sagasController.appendRootFile(fdRoot, dataString)
    } else {
        sagasController.generateSagaRootFile(fdRoot)
    }

    closeSync(fdRoot)
}

export default function createSagas(
    actionTypeController: ActionTypeController,
    actionCreatorController: ActionCreatorController,
    serviceController: ServiceController,
    sagasController: SagasController,
    parsedModel: ParsedModel
): void {
    let fd = sagasController.createFile(parsedModel.interfaceName)

    const data = readFileSync(fd)

    if (data.length) {
        const dataString = data.toString()
        closeSync(fd)

        fd = sagasController.createFile(parsedModel.interfaceName)

        ftruncateSync(fd, 0)

        const sagaFunction = sagasController.generateSagaFunction(
            actionTypeController,
            parsedModel.propertiesSend || [],
            parsedModel.propertiesSuccess || [],
            serviceController
        )

        const sagaWatcher = sagasController.generateSagaWatcher(
            sagaFunction.sagaFunctionName,
            actionTypeController.getActionTypeNames()[0]
        )

        sagasController.appendSagaFile(
            fd,
            sagaWatcher,
            sagaFunction.content,
            serviceController,
            dataString
        )
    } else {
        sagasController.generateSagaImports(
            actionTypeController,
            actionCreatorController,
            serviceController
        )

        const sagaFunction = sagasController.generateSagaFunction(
            actionTypeController,
            parsedModel.propertiesSend || [],
            parsedModel.propertiesSuccess || [],
            serviceController
        )

        sagasController.addLine(sagaFunction.content)

        const sagaWatcher = sagasController.generateSagaWatcher(
            sagaFunction.sagaFunctionName,
            actionTypeController.getActionTypeNames()[0]
        )

        sagasController.generateBaseFunctions(parsedModel.interfaceName, [
            sagaWatcher,
        ])

        sagasController.writeFile(fd)

        createRootFile(sagasController)
    }

    closeSync(fd)
}
