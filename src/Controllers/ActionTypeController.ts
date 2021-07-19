import { ActionTypesFolder } from '../Constants/FolderConstants'
import ParsedProperty from '../Models/ParsedProperty'
import { capitalize, propertiesToInterface, toCamelCase } from '../Utils/utils'
import AbstractFluxController from './AbstractFluxController'

export const fileNameExtension = 'ActionType'
export const SuccessAppendType = '_SUCCESS'
export const FailureAppendType = '_FAILURE'

export default class ActionTypeController extends AbstractFluxController {
    private actionTypeInterfacesNames: string[]
    private actionTypeNames: string[]
    private actionTypeExportName: string
    private actionTypeIdentifiers: string[]

    constructor(folderPath: string) {
        super(ActionTypesFolder, folderPath)

        this.actionTypeInterfacesNames = []
        this.actionTypeNames = []
        this.actionTypeExportName = ''
        this.actionTypeIdentifiers = []
    }

    public createFile(
        modelName: string,
        fluxExtension: string = fileNameExtension
    ): number {
        return super.createFile(modelName, fluxExtension)
    }

    public getActionTypeExportName(): string {
        return this.actionTypeExportName
    }

    public getActionTypeIdentifiers(): string[] {
        return this.actionTypeIdentifiers
    }

    public getActionTypeNames(): string[] {
        return this.actionTypeNames
    }

    public getActionTypeInterfacesNames(): string[] {
        return this.actionTypeInterfacesNames
    }

    private modelActionType = (
        modelName: string,
        actionType: string,
        isSuccess?: boolean
    ): string =>
        `${modelName}ActionTypes/${actionType.toUpperCase()}${
            isSuccess !== undefined
                ? isSuccess
                    ? SuccessAppendType
                    : FailureAppendType
                : ''
        }`

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

        this.actionTypeIdentifiers.push(
            toCamelCase(actionTypeVarName.toLowerCase())
        )

        const actionTypeName = `${toCamelCase(
            actionTypeVarName.toLowerCase()
        )}Action`

        const actionTypeLine = `export const ${actionTypeVarName} = '${this.modelActionType(
            modelName,
            actionType,
            isSuccess
        )}'`
        const actionInterfaceLine = `export interface ${actionTypeName} {\n    type: typeof ${actionTypeVarName}\n${propertiesToInterface(
            properties
        )}\n}`

        this.lines.push(`${actionTypeLine}\n${actionInterfaceLine}\n`)
        this.actionTypeInterfacesNames.push(actionTypeName)
        this.actionTypeNames.push(actionTypeVarName)
    }

    public exportsActionTypeLines(modelName: string, isAppend = false): void {
        const exportActionTypes: string[] = []

        this.actionTypeExportName = `${capitalize(modelName)}Actions`

        if (!isAppend) {
            const exportVariable = `export type ${this.actionTypeExportName} =`

            exportActionTypes.push(exportVariable)
        }

        this.actionTypeInterfacesNames.forEach((el) => {
            exportActionTypes.push(`    | ${el}`)
        })

        this.lines.push(exportActionTypes.join('\n'))
    }

    public reset(): void {
        super.reset()

        this.actionTypeInterfacesNames = []
        this.actionTypeNames = []
        this.actionTypeExportName = ''
        this.actionTypeIdentifiers = []
    }
}
