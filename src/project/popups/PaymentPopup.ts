import i18next from "i18next";
import { Manager } from "../..";
import { BasePopup } from "./BasePopup";

export class PaymentPopup extends BasePopup {
	constructor() {
		super(i18next.t("PPPayment.title"));

		this.onChangeOrientation();
	}

	public override onChangeOrientation(): void {
		if (Manager.isPortrait) {
		} else {
		}
	}
}
