import ParsedProperty from '../Models/ParsedProperty'
import * as vscode from 'vscode'

export function toCamelCase(str: string): string {
    return str
        .replace(/(?:^\w|[A-Z]|\b\w|_\w)/g, function (word, index) {
            console.log(word, index)
            return index === 0 ? word.toLowerCase() : word.toUpperCase()
        })
        .replace(/[\s_]+/g, '')
}

export function propertiesToInterface(
    properties: ParsedProperty[],
    isObject = false
): string {
    const propertiesParsed: string[] = []

    properties.forEach((el) => {
        const propertyLine = `    ${toCamelCase(el.name)}${
            el.optional ? '?' : ''
        }: ${el.type}${isObject ? ',' : ''}`

        propertiesParsed.push(propertyLine)
    })

    return propertiesParsed.join('\n')
}

export function propertiesToReturnAction(properties: ParsedProperty[]): string {
    const propertiesParsed: string[] = []

    properties.forEach((el) => {
        const propertyLine = `        ${toCamelCase(el.name)},`

        propertiesParsed.push(propertyLine)
    })

    return propertiesParsed.join('\n')
}

export function propertiesToObjectValues(
    properties: ParsedProperty[],
    indentation = '    '
): string {
    const propertiesParsed: string[] = []

    properties.forEach((el) => {
        const propertyLine = `${indentation}${el.name}: ${
            el.defaultValue || 'undefined'
        },`

        propertiesParsed.push(propertyLine)
    })

    return propertiesParsed.join('\n')
}

export function capitalize(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

export const camelToSnakeCase = (str: string): string =>
    str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)

export async function getSendProperty(
    propertiesSend: ParsedProperty[]
): Promise<ParsedProperty[]> {
    const resName = await vscode.window.showInputBox({
        title: 'Name of the property or <escape> to continue',
    })
    if (!resName) {
        return propertiesSend
    }

    const resType = await vscode.window.showInputBox({
        title: 'Type of the property or <escape> to continue',
    })
    if (!resType) {
        return propertiesSend
    }

    const resOptional = await vscode.window.showQuickPick(['Yes', 'No'], {
        title: 'Is it optional ?',
    })
    if (!resOptional) {
        return propertiesSend
    }

    const sendProperty: ParsedProperty = {
        name: resName,
        type: resType,
        optional: resOptional === 'Yes' ? true : false,
    }

    propertiesSend.push(sendProperty)

    return getSendProperty(propertiesSend)
}
