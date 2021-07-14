import {
    ActionCreatorsFolder,
    ActionTypesFolder,
    ReducersFolder,
    SagasFolder,
    ServicesFolder,
} from '../Constants/FolderConstants'
import ActionCreatorController from './ActionCreatorController'
import ActionTypeController from './ActionTypeController'
import AbstractFluxController from './AbstractFluxController'
import ReducerController from './ReducerController'
import SagasController from './SagasController'
import ServiceController from './ServiceController'

export default function fluxControllerFactory(
    folderName: string,
    filePath: string
): AbstractFluxController | undefined {
    switch (folderName) {
    case ActionCreatorsFolder:
        return new ActionCreatorController(filePath)
    case ActionTypesFolder:
        return new ActionTypeController(filePath)
    case SagasFolder:
        return new SagasController(filePath)
    case ReducersFolder:
        return new ReducerController(filePath)
    case ServicesFolder:
        return new ServiceController(filePath)
    default:
        return undefined
    }
}
