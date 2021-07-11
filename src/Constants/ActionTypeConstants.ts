export const fileNameExtension = "ActionType"

export const SuccessAppendType = "/Success"
export const FailureAppendType = "/Failure"

export const ModelActionType = (modelName: string, actionType: string, isSuccess?: string) => `${modelName}Types/${actionType.toUpperCase()}${isSuccess !== undefined ? (isSuccess ? SuccessAppendType : FailureAppendType) : ''}`
