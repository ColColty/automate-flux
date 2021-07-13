export function generateModelImport(modelName: string): string {
    return `import { ${modelName} } from '@/Models'\n`
}