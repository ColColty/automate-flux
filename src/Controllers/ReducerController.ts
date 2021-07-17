import { readFileSync, writeFileSync } from 'fs'
import { ReducersFolder } from '../Constants/FolderConstants'
import { fileNameExtension } from '../Constants/ReducerConstants'
import ParsedProperty from '../Models/ParsedProperty'
import {
    capitalize,
    propertiesToInterface,
    propertiesToObjectValues,
    toCamelCase,
} from '../Utils/utils'
import AbstractFluxController from './AbstractFluxController'
import ActionTypeController from './ActionTypeController'

export default class ReducerController extends AbstractFluxController {
    private stateName: string
    private reducerName: string
    private defaultProperties: ParsedProperty[] = [
        {
            name: 'isLoading',
            type: 'boolean',
            optional: false,
            defaultValue: 'false',
        },
        {
            name: 'error',
            type: 'Error | string',
            optional: true,
            defaultValue: 'undefined',
        },
    ]

    constructor(filePath: string) {
        super(ReducersFolder, filePath)

        this.stateName = ''
        this.reducerName = ''
    }

    public createFile(
        modelName: string,
        fluxExtension: string = fileNameExtension
    ): number {
        return super.createFile(modelName, fluxExtension)
    }

    public getReducerName(): string {
        return this.reducerName
    }

    public getStateName(): string {
        return this.stateName
    }

    public generateStateInterface(
        modelName: string,
        properties: ParsedProperty[]
    ): void {
        const allProperties = this.defaultProperties.concat(properties)
        this.stateName = `${capitalize(toCamelCase(modelName))}State`

        this.lines.unshift('/* eslint-disable prettier/prettier */')

        const interfaceContent = `export interface ${
            this.stateName
        } {\n${propertiesToInterface(allProperties)}\n}\n`

        const initialState = `const initialState: ${
            this.stateName
        } = {\n${propertiesToObjectValues(allProperties)}\n}\n`

        this.lines.push([interfaceContent, initialState].join('\n'))
    }

    public generateReducerFunction(
        modelName: string,
        actionTypeController: ActionTypeController,
        reducers: string[]
    ): void {
        this.reducerName = `${toCamelCase(modelName)}Reducer`

        const reducer = `export default function ${
            this.reducerName
        }(\n    state: ${
            this.stateName
        } = initialState,\n    action: actions.${actionTypeController.getActionTypeExportName()},\n): ${
            this.stateName
        } {\n    switch (action.type) {\n${reducers.join(
            '\n'
        )}\n    default:\n        return state\n    }\n}\n`

        this.lines.push(reducer)
    }

    public generateReducer(
        actionTypeVarName: string,
        properties: ParsedProperty[]
    ): string {
        let userProperties = [...properties]

        const allProperties = this.defaultProperties
            .map((el) => {
                const prop = userProperties.find((elP) => el.name === elP.name)

                if (prop) {
                    userProperties = userProperties.filter(
                        (el) => el.name !== prop.name
                    )
                    return {
                        ...el,
                        defaultValue: prop.defaultValue,
                    }
                }
                return el
            })
            .concat(userProperties)

        const reducerContent = `    case actions.${actionTypeVarName}:\n        return {\n            ...state,\n${propertiesToObjectValues(
            allProperties,
            '            '
        )}\n        }`

        return reducerContent
    }

    public appendReducers(fd: number, reducers: string[]): void {
        let rootLines = readFileSync(fd).toString().split('\n')

        rootLines = rootLines.map((el) => {
            if (el.match(/^ {4}default:$/)) {
                return reducers.join('\n') + '\n' + el
            }

            return el
        })

        this.writeFile(fd, rootLines.join('\n'))
    }

    public generateReducerRootCombiner(modelName: string): string {
        return `    ${toCamelCase(modelName)}: ${this.reducerName},`
    }

    public generateRootFile(fdRoot: number, modelName: string): void {
        const importRedux = 'import { combineReducers } from \'redux\''
        const importReducer = `import ${
            this.reducerName
        } from './${this.fileName.replace('.ts', '')}`
        const imports = [importRedux, importReducer].join('\n')

        const rootReducerFunction = `const RootReducer = combineReducers({\n${this.generateReducerRootCombiner(
            modelName
        )}\n})\n\nexport type AppState = ReturnType<typeof RootReducer>\n\nexport default RootReducer`

        this.writeFile(fdRoot, [imports, rootReducerFunction].join('\n'))
    }

    public appendRootFile(
        fdRoot: number,
        modelName: string,
        fileData: string
    ): void {
        let rootLines = fileData.split('\n')
        let inImport = false

        rootLines = rootLines.map((el) => {
            if (el.match(/^\}\)$/)) {
                return this.generateReducerRootCombiner(modelName) + '\n' + el
            }

            if (el.match(/^import /)) {
                inImport = true
            } else if (inImport) {
                inImport = false

                return (
                    `import ${this.reducerName} from './${this.fileName.replace(
                        '.ts',
                        ''
                    )}'` +
                    '\n' +
                    el
                )
            }

            return el
        })

        writeFileSync(fdRoot, rootLines.join('\n'))
    }

    public reset(): void {
        this.stateName = ''
        this.reducerName = ''
    }
}
