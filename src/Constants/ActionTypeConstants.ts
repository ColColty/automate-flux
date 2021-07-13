import ParsedProperty from "../Models/ParsedProperty"
import { capitalize, propertiesToInterface, toCamelCase } from "../Utils/utils"

export const fileNameExtension = "ActionType"

export const SuccessAppendType = "_SUCCESS"
export const FailureAppendType = "_FAILURE"

export const ModelActionType = (modelName: string, actionType: string, isSuccess?: boolean): string => `${modelName}ActionTypes/${actionType.toUpperCase()}${isSuccess !== undefined ? (isSuccess ? SuccessAppendType : FailureAppendType) : ''}`

type ActionTypeContentReturn = {
    content: string
    actionTypeName: string
}
export const ActionTypeContent = (modelName: string, actionType: string, properties: ParsedProperty[], isSuccess?: boolean): ActionTypeContentReturn => {
    const actionTypeVarName = actionType.toUpperCase().replace(" ", "_") + (isSuccess !== undefined ? (isSuccess ? SuccessAppendType : FailureAppendType) : '')

    const actionTypeName = `${toCamelCase(actionTypeVarName.toLowerCase())}Action`

    const actionTypeLine = `export const ${actionTypeVarName} = '${ModelActionType(modelName, actionType, isSuccess)}'`
    const actionInterfaceLine = `export interface ${actionTypeName} {\n    type: typeof ${actionTypeVarName}\n${propertiesToInterface(properties)}\n}`

    return {
        content: `${actionTypeLine}\n${actionInterfaceLine}\n`,
        actionTypeName
    }
}

export const exportActionTypes = (modelName: string, actionTypeNames: string[], isAppend: boolean = false) => {
    const exportActionTypes: string[] = []

    actionTypeNames.forEach(el => {
        exportActionTypes.push(`    | ${el}`)
    })

    if (!isAppend) {
        const exportVariable = `export type ${capitalize(modelName)}Actions =`

        exportActionTypes.unshift(exportVariable)
    }

    return exportActionTypes.join('\n')
}