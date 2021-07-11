import ParsedModel from "../Models/ParsedModel";
import ParsedProperty from "../Models/ParsedProperty";

export default function modelParsing(model: string): ParsedModel {
    const modelArr = model.split('\n')
    const parsedModel: ParsedModel = {
        interfaceName: "",
        properties: []
    }

    const interfaceDef = modelArr.shift()

    if (interfaceDef) {
        const intRe = new RegExp(/interface (\w+) {/)
        const intReRes = intRe.exec(interfaceDef)

        if (intReRes) {
            parsedModel.interfaceName = intReRes[1]
        }
    }

    let interfaceOptions: ParsedProperty[] = []
    const elRe = new RegExp(/(\w+)(\?)?: *(\w+)/)

    modelArr.forEach(el => {
        const elReRes = elRe.exec(el)

        if (elReRes) {
            const parsedProperty: ParsedProperty = {
                name: elReRes[1],
                type: elReRes[3],
                optional: elReRes[2] ? true : false
            }

            interfaceOptions.push(parsedProperty)
        }
    })

    parsedModel.properties = interfaceOptions

    return parsedModel
}