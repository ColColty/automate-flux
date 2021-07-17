import * as vscode from 'vscode'
import * as fs from 'fs'
import * as path from 'path'
import { requiredFolders } from '../Constants/FolderConstants'
import { baseFileWatch } from '../Constants/Constants'
import AbstractFluxController from '../Controllers/AbstractFluxController'
import fluxControllerFactory from '../Controllers/FluxControllerFactory'

class FileWatcher {
    private requiredDirsMapped: Map<string, AbstractFluxController>
    private basePath: string
    private chan: vscode.OutputChannel

    constructor(chan: vscode.OutputChannel) {
        this.basePath = ''
        this.requiredDirsMapped = new Map<string, AbstractFluxController>()
        this.chan = chan

        try {
            this.findFolders()
        } catch (err) {
            vscode.window.showInformationMessage(err)
        }
    }

    public findFolders(): void {
        vscode.workspace
            .findFiles('**/' + baseFileWatch, '**/node_modules/**', 1)
            .then((res) => {
                if (res.length) {
                    const reREs = res[0].path.match(/[\w-/]*\/src/)

                    if (reREs) {
                        this.basePath = reREs[0]

                        const dir = fs.readdirSync(this.basePath)

                        requiredFolders.forEach((folder) => {
                            const folderPath = path.join(this.basePath, folder)

                            if (!dir.includes(folder)) {
                                // TODO Ask to the user if he want to create the related folders
                                // fs.mkdir(folderPath, (err) => {
                                //     if (err) throw err
                                //     const controller = fluxControllerFactory(folder, folderPath)
                                //     if (controller) {
                                //         this.requiredDirsMapped.set(folder, controller)
                                //         vscode.window.showInformationMessage(`Automate-flux create folder: ${folder}`)
                                //     }
                                // })
                            } else {
                                const dirStat = fs.statSync(folderPath)

                                if (!dirStat.isDirectory) {
                                    throw new Error(
                                        'Required folder name used as file: ' +
                                            folder
                                    )
                                }

                                const controller = fluxControllerFactory(
                                    folder,
                                    folderPath
                                )

                                if (controller) {
                                    this.chan.appendLine(
                                        `Folder ${folder} found`
                                    )

                                    this.requiredDirsMapped.set(
                                        folder,
                                        controller
                                    )
                                }
                            }
                        })
                    }
                }
            })

        vscode.window.showInformationMessage('All folders found !')
    }

    public getFolderPath(name: string): AbstractFluxController | undefined {
        return this.requiredDirsMapped.get(name)
    }

    public getFolderPaths(): Map<string, AbstractFluxController> {
        return this.requiredDirsMapped
    }
}

export default FileWatcher
