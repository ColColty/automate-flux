import { fileNameExtension } from '../Constants/ActionTypeConstants'
import {
    FailureAppendType,
    ModelActionType,
    SuccessAppendType,
} from '../Constants/ActionTypeConstants'
import { ActionTypesFolder } from '../Constants/FolderConstants'
import ParsedProperty from '../Models/ParsedProperty'
import { capitalize, propertiesToInterface, toCamelCase } from '../Utils/utils'
import FluxController from './FluxController'

export default class ActionTypeController extends FluxController {
    private actionTypeNames: string[]

    constructor(folderPath: string) {
        super(ActionTypesFolder, folderPath)

        this.actionTypeNames = []
    }

    public createFile(
        modelName: string,
        fluxExtension: string = fileNameExtension
    ): number {
        return super.createFile(modelName, fluxExtension)
    }

    public addActionType(
        modelName: string,
        actionType: string,
        properties: ParsedProperty[],
        isSuccess?: boolean
    ): void {
        const actionTypeVarName =
            actionType.toUpperCase().replace(/\s/g, '_') +
            (isSuccess !== undefined
                ? isSuccess
                    ? SuccessAppendType
                    : FailureAppendType
                : '')

        const actionTypeName = `${toCamelCase(
            actionTypeVarName.toLowerCase()
        )}Action`

        const actionTypeLine = `export const ${actionTypeVarName} = '${ModelActionType(
            modelName,
            actionType,
            isSuccess
        )}'`
        const actionInterfaceLine = `export interface ${actionTypeName} {\n    type: typeof ${actionTypeVarName}\n${propertiesToInterface(
            properties
        )}\n}`

        this.lines.push(`${actionTypeLine}\n${actionInterfaceLine}\n`)
        this.actionTypeNames.push(actionTypeName)
    }

    public exportsActionTypeLines(modelName: string, isAppend = false): void {
        const exportActionTypes: string[] = []

        if (!isAppend) {
            const exportVariable = `export type ${capitalize(
                modelName
            )}Actions =`

            exportActionTypes.push(exportVariable)
        }

        this.actionTypeNames.forEach((el) => {
            exportActionTypes.push(`    | ${el}`)
        })

        this.lines.push(exportActionTypes.join('\n'))
    }
}
