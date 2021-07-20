import * as vscode from 'vscode'
import FileWatcher from './fileWatcher/FileWatcher'
import fluxCreator from './fluxCreator'
import modelParsing from './parsing/modelParsing'

const chan = vscode.window.createOutputChannel('Automate Flux')

export function activate(context: vscode.ExtensionContext): void {
    const fileWatcher = new FileWatcher(chan)

    const generateFlux = vscode.commands.registerCommand(
        'automate-flux.generate-flux',
        () => {
            const editor = vscode.window.activeTextEditor

            if (editor) {
                const document = editor.document
                const selection = editor.selection

                if (!selection) {
                    vscode.window.showInformationMessage(
                        'You have to select a model'
                    )
                    return
                }

                const model = document.getText(selection)

                const parsedModel = modelParsing(model)

                fluxCreator(fileWatcher, parsedModel)
            }
        }
    )

    const generateActions = vscode.commands.registerCommand(
        'automate-flux.generate-action',
        () => {
            // const fileWatcher = new FileWatcher()
        }
    )

    context.subscriptions.push(generateFlux, generateActions)
}
