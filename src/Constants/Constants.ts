import ParsedProperty from '../Models/ParsedProperty'

export const baseFileWatch = 'App.tsx'

export const errorProperties: ParsedProperty[] = [
    {
        name: 'error',
        type: 'Error | string',
        optional: false,
    },
]
