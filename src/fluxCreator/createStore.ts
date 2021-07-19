import { closeSync, ftruncateSync, readFileSync } from 'fs'
import ReducerController from '../Controllers/ReducerController'
import StoreController, { fileNameAppend } from '../Controllers/StoreController'
import ParsedModel from '../Models/ParsedModel'

export default function createStore(
    storeController: StoreController,
    reducerController: ReducerController,
    parsedModel: ParsedModel
): void {
    let fd = storeController.createFile(fileNameAppend)

    const data = readFileSync(fd)

    if (data.length) {
        const dataString = data.toString()
        closeSync(fd)

        fd = storeController.createFile(fileNameAppend)

        ftruncateSync(fd, 0)

        const imports = storeController.generateImportState(reducerController)

        const stateLine = storeController.generateStateLine(
            reducerController,
            parsedModel.interfaceName
        )

        storeController.appendStores(fd, imports, stateLine, dataString)
    } else {
        // TODO Creation of the file
    }
}
