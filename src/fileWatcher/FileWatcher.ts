import * as vscode from 'vscode'
import * as fs from 'fs'
import * as path from 'path'
import { requiredFolders } from '../Constants/FolderConstants';
import { baseFileWatch } from '../Constants/Constants';

class FileWatcher {
    private requiredDirsMapped: Map<string, string>;
    private basePath: string;

    constructor() {
        this.basePath = ""
        this.requiredDirsMapped = new Map<string, string>()

        this.findFolders()
    }

    public findFolders() {
        vscode.workspace.findFiles('**/' + baseFileWatch, '**/node_modules/**', 1).then(res => {
            if (res.length) {
                const reREs = res[0].path.match(/[\w-\/]*\/src/)

                if (reREs) {
                    this.basePath = reREs[0]

                    const dir = fs.readdirSync(this.basePath)

                    requiredFolders.forEach(folder => {
                        const folderPath = path.join(this.basePath, folder)

                        if (!dir.includes(folder)) {
                            fs.mkdir(folderPath, (err) => {
                                if (err) throw err

                                this.requiredDirsMapped.set(folder, folderPath)

                                vscode.window.showInformationMessage(`Automate-flux create folder: ${folder}`)
                            })
                        } else {
                            const dirStat = fs.statSync(folderPath)

                            if (!dirStat.isDirectory) {
                                throw new Error('Required folder name used as file: ' + folder)
                            }

                            this.requiredDirsMapped.set(folder, folderPath)
                        }
                    })
                }
            }
        })
    }

    public getFolderPath(name: string): string | undefined {
        return this.requiredDirsMapped.get(name)
    }
}

export default FileWatcher