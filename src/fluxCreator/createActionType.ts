import ActionTypeController from "../Controllers/ActionTypeController";
import ParsedModel from "../Models/ParsedModel";

export default function createActionType(actionTypeController: ActionTypeController, parsedModel: ParsedModel) {
    const fd = actionTypeController.createFile(parsedModel.interfaceName)
}