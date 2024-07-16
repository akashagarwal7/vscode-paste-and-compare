// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "paste-and-compare" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.pasteAndCompare', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showErrorMessage('No active editor!');
			return;
		}

		// Get the clipboard content
		vscode.env.clipboard.readText().then(text => {
			// Create a new untitled document
			vscode.workspace.openTextDocument({ content: text }).then(document => {
				vscode.window.showTextDocument(document, vscode.ViewColumn.Beside).then(() => {
					// Compare the two documents
					vscode.commands.executeCommand('vscode.diff',
						editor.document.uri,
						document.uri,
						'Original <-> Pasted'
					);
				});
			});
		});
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
