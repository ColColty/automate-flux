import ParsedProperty from "../Models/ParsedProperty";

export function toCamelCase(str: string): string {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

export function propertiesToInterface(properties: ParsedProperty[]) {
    const propertiesParsed: string[] = []

    properties.forEach(el => {
        const propertyLine = `    ${toCamelCase(el.name)}${el.optional ? "?" : ""}: ${el.type}\n`

        propertiesParsed.push(propertyLine)
    })
}