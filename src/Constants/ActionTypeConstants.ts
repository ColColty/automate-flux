export const fileNameExtension = 'ActionType'

export const SuccessAppendType = '_SUCCESS'
export const FailureAppendType = '_FAILURE'

export const ModelActionType = (
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
