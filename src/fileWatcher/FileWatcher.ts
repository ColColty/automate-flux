import * as vscode from 'vscode'
import * as fs from 'fs'
import * as path from 'path'
import { requiredFolders } from '../Constants/FolderConstants';
import { baseFileWatch } from '../Constants/Constants';
import FluxController from '../Controllers/FluxController';
import fluxControllerFactory from '../Controllers/FluxControllerFactory';

class FileWatcher {
    private requiredDirsMapped: Map<string, FluxController>;
    private basePath: string;

    constructor() {
        this.basePath = ""
        this.requiredDirsMapped = new Map<string, FluxController>()

        try {
            this.findFolders()
        } catch (err) {
            vscode.window.showInformationMessage(err)
        }
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

                                const controller = fluxControllerFactory(folder, folderPath)

                                if (controller) {
                                    this.requiredDirsMapped.set(folder, controller)

                                    vscode.window.showInformationMessage(`Automate-flux create folder: ${folder}`)
                                }
                            })
                        } else {
                            const dirStat = fs.statSync(folderPath)

                            if (!dirStat.isDirectory) {
                                throw new Error('Required folder name used as file: ' + folder)
                            }

                            const controller = fluxControllerFactory(folder, folderPath)

                            if (controller) {
                                this.requiredDirsMapped.set(folder, controller)
                            }
                        }
                    })
                }
            }
        })

        vscode.window.showInformationMessage('All folders found !')
    }

    public getFolderPath(name: string): FluxController | undefined {
        return this.requiredDirsMapped.get(name)
    }

    public getFolderPaths(): Map<string, FluxController> {
        return this.requiredDirsMapped
    }
}

export default FileWatcher