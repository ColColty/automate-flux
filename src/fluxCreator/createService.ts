import { closeSync, readFileSync } from 'fs'
import ActionTypeController from '../Controllers/ActionTypeController'
import ServiceController from '../Controllers/ServiceController'
import ParsedModel from '../Models/ParsedModel'

export default function createService(
    actionTypeController: ActionTypeController,
    serviceController: ServiceController,
    parsedModel: ParsedModel
): void {
    const fd = serviceController.createFile(parsedModel.interfaceName)

    const data = readFileSync(fd)

    if (!parsedModel.apiURL || !parsedModel.apiVerb) {
        throw new Error('Not all API information')
    }

    if (data.length) {
        // TODO Append to file
    } else {
        serviceController.generateServiceImports()

        serviceController.generateFetchFunction(
            actionTypeController,
            parsedModel.apiURL,
            parsedModel.apiVerb
        )

        serviceController.writeFile(fd)
    }

    closeSync(fd)
}
