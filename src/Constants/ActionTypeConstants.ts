import ParsedProperty from "../Models/ParsedProperty"
import { propertiesToInterface, toCamelCase } from "../Utils/utils"

export const fileNameExtension = "ActionType"

export const SuccessAppendType = "_SUCCESS"
export const FailureAppendType = "_FAILURE"

export const ModelActionType = (modelName: string, actionType: string, isSuccess?: boolean): string => `${modelName}ActionTypes/${actionType.toUpperCase()}${isSuccess !== undefined ? (isSuccess ? SuccessAppendType : FailureAppendType) : ''}`

export const ActionTypeContent = (modelName: string, actionType: string, properties: ParsedProperty[], isSuccess?: boolean): string => {
    const actionTypeVarName = actionType.toUpperCase().replace(" ", "_") + (isSuccess !== undefined ? (isSuccess ? SuccessAppendType : FailureAppendType) : '')

    const actionTypeLine = `export const ${actionTypeVarName} = ${ModelActionType(modelName, actionType, isSuccess)}`
    const actionInterfaceLine = `export interface ${toCamelCase(actionType)}Action {\n    type: typeof ${actionTypeVarName}\n${propertiesToInterface(properties)}}\n`

    return `${actionTypeLine}\n${actionInterfaceLine}`
}