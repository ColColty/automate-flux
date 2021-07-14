import { ServicesFolder } from '../Constants/FolderConstants'
import { fileNameExtension } from '../Constants/ServiceConstants'
import { capitalize } from '../Utils/utils'
import AbstractFluxController from './AbstractFluxController'
import ActionTypeController from './ActionTypeController'

export default class ServiceController extends AbstractFluxController {
    private serviceName: string

    constructor(filePath: string) {
        super(ServicesFolder, filePath)

        this.serviceName = ''
    }

    public getServiceName(): string {
        return this.serviceName
    }

    public createFile(
        modelName: string,
        fluxExtension: string = fileNameExtension
    ): number {
        return super.createFile(modelName, fluxExtension)
    }

    public generateServiceImports(): void {
        this.lines.push('import api from \'@/Services\'')
    }

    public generateFetchFunction(
        actionTypeController: ActionTypeController,
        apiURL: string,
        apiVerb: string
    ): void {
        const responseInterfaceName = `${actionTypeController.getActionTypeIdentifier()}Response`
        const responseInterface = `interface ${responseInterfaceName} {\n    data: Object\n}\n`

        this.serviceName = `fetch${capitalize(
            actionTypeController.getActionTypeIdentifier()
        )}`
        const fetchFunction = `export async function ${this.serviceName}(params: Object): Promise<${responseInterfaceName}> {\n\
    const response = await api.${apiVerb.toLowerCase}('${apiURL}', params)\n\n    return response\n}`

        this.lines.push([responseInterface, fetchFunction].join('\n'))
    }
}
