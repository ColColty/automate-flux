import ParsedProperty from './ParsedProperty'

export default interface ParsedModel {
    interfaceName: string
    properties: ParsedProperty[]
    propertiesSend?: ParsedProperty[] | undefined
    propertiesSuccess?: ParsedProperty[] | undefined
    apiURL?: string
    apiVerb?: string
    actionName?: string
}
