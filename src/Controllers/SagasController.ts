import { readFileSync, writeFileSync } from 'fs'
import { SagasFolder } from '../Constants/FolderConstants'
import { fileNameExtension } from '../Constants/SagasConstants'
import ParsedProperty from '../Models/ParsedProperty'
import {
    capitalize,
    propertiesToReturnAction,
    toCamelCase,
} from '../Utils/utils'
import AbstractFluxController from './AbstractFluxController'
import ActionCreatorController from './ActionCreatorController'
import ActionTypeController from './ActionTypeController'
import ServiceController from './ServiceController'

export default class SagasController extends AbstractFluxController {
    private sagaMainFunction: string

    constructor(filePath: string) {
        super(SagasFolder, filePath)

        this.sagaMainFunction = ''
    }

    public createFile(
        modelName: string,
        fluxExtension: string = fileNameExtension
    ): number {
        return super.createFile(modelName, fluxExtension)
    }

    public generateSagaImports(
        actionTypeController: ActionTypeController,
        actionCreatorController: ActionCreatorController,
        serviceController: ServiceController
    ): void {
        const sagaImports =
            'import { put, call, all, fork, takeLatest } from \'redux-saga/effects\''
        const actionCreatorImport = `import * as actionCreators from '@/${actionCreatorController.getFolderName()}/${actionCreatorController.getFileName()}'`
        const actionTypeImport = `import * as actionTypes from '@/${actionTypeController.getFolderName()}/${actionTypeController.getFileName()}'`
        const serviceImport = `import {\n${serviceController.getServiceName()},\n} from '@/${serviceController.getFolderName()}/${serviceController
            .getFileName()
            .replace('.ts', '')}'`

        // TODO Set this variable to be configurable by the user
        const errorHandlerImport =
            'import { errorHandler } from \'@/Tools/ErrorHandler\''

        this.lines.push(
            [
                sagaImports,
                actionCreatorImport,
                actionTypeImport,
                serviceImport,
                errorHandlerImport,
            ].join('\n')
        )
    }

    public generateBaseFunctions(
        modelName: string,
        sagaFunctions: string[]
    ): void {
        const watchOnName = `watchOn${capitalize(toCamelCase(modelName))}`
        const watchOnFunction = `function* ${watchOnName}() {\n${sagaFunctions.join(
            '\n'
        )}\n}\n`
        this.sagaMainFunction = `${toCamelCase(modelName)}Sagas`
        const sagasMainFunction = `export default function* ${this.sagaMainFunction}() {\n    yield all([fork(${watchOnName})])\n}`

        this.lines.push([watchOnFunction, sagasMainFunction].join('\n'))
    }

    public generateSagaFunction(
        actionTypeController: ActionTypeController,
        propertiesSend: ParsedProperty[],
        propertiesSuccess: ParsedProperty[],
        serviceController: ServiceController
    ): { sagaFunctionName: string; content: string } {
        const params = propertiesToReturnAction(propertiesSend, '    ')

        const sagaFunctionName = `${actionTypeController.getActionTypeIdentifier()}Call`

        const sagaFunction = `function* ${sagaFunctionName}({\n${params}\n\
}: actionTypes.${actionTypeController.getActionTypeExportName()}) {\n\
    const params = {\n${propertiesToReturnAction(propertiesSend, '        ')}\n\
    }\n\
    try {\n\
        const { data } = yield call(${serviceController.getServiceName()}, params)\n\
        \n\
        yield put(actionCreators.${actionTypeController.getActionTypeIdentifier()}Success(${propertiesSuccess
    .map((el) => `data.${el.name}`)
    .join(', ')}))\n\
    } catch (error) {\n\
        errorHandler(error)\n\
        yield put(actionCreators.${actionTypeController.getActionTypeIdentifier()}Failure(error))\n\
    }\n}\n`

        // TODO Let the user choose if it has to have an error handler function by the configuration of the extension

        return {
            sagaFunctionName,
            content: sagaFunction,
        }
    }

    public generateSagaWatchers(
        sagaFunctionName: string,
        actionTypeVarName: string
    ): string {
        const sagaWatcher = `    yield takeLatest(actionTypes.${actionTypeVarName}, ${sagaFunctionName})`

        return sagaWatcher
    }

    public appendSagaFile(
        fd: number,
        sagaWatcher: string,
        sagaFunction: string,
        serviceController: ServiceController
    ): void {
        let rootLines = readFileSync(fd).toString().split('\n')
        let inSagaYields = false

        rootLines = rootLines.map((el) => {
            if (el.match(/^\} from '@\/Services\/(\w+)Service'/)) {
                return `    ${serviceController.getServiceName()},\n` + el
            }

            if (el.match(/^function\* watchOn(\w+)\(\) \{$/)) {
                return sagaFunction + '\n' + el
            }

            if (el.match(/yield takeLatest\(actionTypes\.(\w+), (\w+)\)/)) {
                inSagaYields = true
            } else if (inSagaYields) {
                inSagaYields = false

                return sagaWatcher + '\n' + el
            }

            return el
        })

        writeFileSync(fd, rootLines.join('\n'))
    }

    public generateSagaWatchRootAppend(): string {
        return `        fork(${this.sagaMainFunction})`
    }

    public generateSagaRootFile(fdRoot: number): void {
        const importSaga = 'import { all, fork } from \'redux-saga/effects\''
        const importSagaWatcher = `import ${
            this.sagaMainFunction
        } from './${this.fileName.replace('.ts', '')}'`
        const imports = [importSaga, importSagaWatcher].join('\n')

        const rootFunction = `export default function* rootSaga() {\n    yield all([\n${this.generateSagaWatchRootAppend()}\n    ])\n}`

        const content = [imports, rootFunction].join('\n')

        this.writeFile(fdRoot, content)
    }

    public appendRootFile(fd: number): void {
        let rootLines = readFileSync(fd).toString().split('\n')
        let inImport = false

        rootLines = rootLines.map((el) => {
            if (el.match(/^ {4}\]\)$/)) {
                return this.generateSagaWatchRootAppend() + '\n' + el
            }

            if (el.match(/^import /)) {
                inImport = true
            } else if (inImport) {
                inImport = false
                return (
                    `import ${this.sagaMainFunction} from './${this.fileName}'` +
                    '\n' +
                    el
                )
            }
            return el
        })

        writeFileSync(fd, rootLines.join('\n'))
    }
}
