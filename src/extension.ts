// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log(`Activating paste-and-compare extension ${Date.now()}`);
	vscode.window.showInformationMessage('Paste and Compare extension is now active');

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "paste-and-compare" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.pasteAndCompare', async () => {
		console.log(`pasteAndCompare command triggered ${Math.random()}`);
		vscode.window.showInformationMessage('Paste and Compare command started');

		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			console.log('No active editor');
			vscode.window.showErrorMessage('No active editor!');
			return;
		}

		try {
			// Get the clipboard content
			console.log('Getting clipboard content');
			const clipboardText = await vscode.env.clipboard.readText();
			const selection = editor.selection;
			const selectedText = editor.document.getText(selection);

			console.log('Selected text:', selectedText);
			console.log('Clipboard text:', clipboardText);
			vscode.window.showInformationMessage(`Selected text: ${selectedText.substring(0, 20)}...`);
			vscode.window.showInformationMessage(`Clipboard text: ${clipboardText.substring(0, 20)}...`);

			if (selectedText) {
				// Create a new document with the selected text
				const selectedDocument = await vscode.workspace.openTextDocument({ content: selectedText });
				// Create a new document with the clipboard content
				const clipboardDocument = await vscode.workspace.openTextDocument({ content: clipboardText });

			// Compare the two documents
				await vscode.commands.executeCommand('vscode.diff',
					selectedDocument.uri,
					clipboardDocument.uri,
					'Selected <-> Pasted'
				);
			} else {
				// If no selection, compare the entire document
				const document = await vscode.workspace.openTextDocument({ content: clipboardText });
				await vscode.commands.executeCommand('vscode.diff',
					editor.document.uri,
					document.uri,
					'Original <-> Pasted'
				);
			}
		} catch (error) {
			console.error('Error in pasteAndCompare:', error);
			vscode.window.showErrorMessage(`An error occurred: ${error}`);
		}
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
