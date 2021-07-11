// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import FileWatcher from './fileWatcher/FileWatcher';
import fileWatcher from './fileWatcher/FileWatcher';
import modelParsing from './parsing/modelParsing';

const chan = vscode.window.createOutputChannel('Automate Flux')
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	vscode.window.showInformationMessage('Hello World from Automate Flux Architecture!');
	// vscode.workspace.createFileSystemWatcher()


	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "automate-flux" is now active!');

	const fileWatcher = new FileWatcher()

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let generateFlux = vscode.commands.registerCommand('automate-flux.generate-flux', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user

		const editor = vscode.window.activeTextEditor

		if (editor) {
			const document = editor.document;
			const selection = editor.selection;

			if (!selection) {
				console.log("HERE")
				vscode.window.showErrorMessage('You have to select a model')
				return
			}

			const model = document.getText(selection)

			const parsedModel = modelParsing(model)

			console.log(parsedModel)
		}
	})

	let generateActions = vscode.commands.registerCommand('automate-flux.generate-action', () => {
		vscode.window.showInputBox()
	})

	context.subscriptions.push(generateFlux, generateActions);
}

// this method is called when your extension is deactivated
export function deactivate() { }
