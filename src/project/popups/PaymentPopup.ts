import i18next from "i18next";
import { Text } from "pixi.js";
import { Manager } from "../..";
import { TextStyleDictionary } from "../../engine/utils/Constants";
import { setPivotToCenter } from "../../engine/utils/MathUtils";
import { BasePopup } from "./BasePopup";

export class PaymentPopup extends BasePopup {
	private subtitle1: Text;
	private cvuText: Text;
	private subtitle2: Text;
	private aliasText: Text;
	constructor() {
		super(i18next.t("PPPayment.title"));

		this.subtitle1 = new Text(i18next.t("PPPayment.subtitle1"), TextStyleDictionary.textBlackBig);
		setPivotToCenter(this.subtitle1);
		this.centerContainer.addChild(this.subtitle1);

		this.cvuText = new Text(i18next.t("PPPayment.cvu"), TextStyleDictionary.textBlack);
		setPivotToCenter(this.cvuText);
		this.centerContainer.addChild(this.cvuText);

		this.subtitle2 = new Text(i18next.t("PPPayment.subtitle2"), TextStyleDictionary.textBlackBig);
		setPivotToCenter(this.subtitle2);
		this.centerContainer.addChild(this.subtitle2);

		this.aliasText = new Text(i18next.t("PPPayment.alias"), TextStyleDictionary.textBlack);
		setPivotToCenter(this.aliasText);
		this.centerContainer.addChild(this.aliasText);

		this.onChangeOrientation();
	}

	public override onChangeOrientation(): void {
		if (Manager.isPortrait) {
		} else {
		}
	}
}
