import i18next from "i18next";
import { BasePopup } from "./BasePopup";

export class ConfirmationPopup extends BasePopup {
	constructor() {
		super(i18next.t("PPConfirmation.title"));
	}
}
