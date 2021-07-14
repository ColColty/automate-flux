import { fileNameExtension } from '../Constants/ActionCreatorConstants'
import { ActionCreatorsFolder } from '../Constants/FolderConstants'
import ParsedProperty from '../Models/ParsedProperty'
import {
    propertiesToInterface,
    propertiesToReturnAction,
    toCamelCase,
} from '../Utils/utils'
import AbstractFluxController from './AbstractFluxController'

export default class ActionCreatorController extends AbstractFluxController {
    private actionCreatorNames: string[]
    constructor(filePath: string) {
        super(ActionCreatorsFolder, filePath)

        this.actionCreatorNames = []
    }

    public createFile(
        modelName: string,
        fluxExtension: string = fileNameExtension
    ): number {
        return super.createFile(modelName, fluxExtension)
    }

    public addActionCreator(
        actionTypeName: string,
        actionTypeVarName: string,
        actionName: string,
        properties: ParsedProperty[]
    ): void {
        const creatorName = `${toCamelCase(actionName)}`
        this.actionCreatorNames.push(creatorName)

        const creatorFunction = `export function ${creatorName}(\n${propertiesToInterface(
            properties,
            true
        )}\n): actions.${actionTypeName} {\n    return {\n        type: actions.${actionTypeVarName},\n${propertiesToReturnAction(
            properties
        )}\n    }\n}\n`

        this.lines.push(creatorFunction)
    }
}
