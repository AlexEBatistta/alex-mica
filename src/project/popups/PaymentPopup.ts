import i18next from "i18next";
import { Container, Sprite, Text } from "pixi.js";
import { Manager } from "../..";
import { Button } from "../../engine/ui/button/Button";
import { ColorDictionary, TextStyleDictionary } from "../../engine/utils/Constants";
import { GraphicsHelper } from "../../engine/utils/GraphicsHelper";
import { setPivotToCenter } from "../../engine/utils/MathUtils";
import { BasePopup } from "./BasePopup";

export class PaymentPopup extends BasePopup {
	private subtitle1: Text;
	private cvuContent: Container;
	private subtitle2: Text;
	private aliasContent: Container;
	constructor() {
		super(i18next.t("PPPayment.title"));

		this.subtitle1 = new Text(i18next.t("PPPayment.subtitle1"), TextStyleDictionary.textBlackBig);
		setPivotToCenter(this.subtitle1);
		this.centerContainer.addChild(this.subtitle1);

		this.cvuContent = new Container();
		this.centerContainer.addChild(this.cvuContent);

		const cvuBack = GraphicsHelper.pixel(ColorDictionary.black);
		setPivotToCenter(cvuBack);
		cvuBack.scale.set(760, 70);
		cvuBack.x = -50;
		this.cvuContent.addChild(cvuBack);

		const cvuText = new Text(i18next.t("PPPayment.cvu"), TextStyleDictionary.textWhite);
		setPivotToCenter(cvuText);
		cvuText.x = -50;
		this.cvuContent.addChild(cvuText);

		const btnCvuContent: Container = new Container();
		const btnCvuBack = GraphicsHelper.pixel(ColorDictionary.black);
		setPivotToCenter(btnCvuBack);
		btnCvuBack.scale.set(87, 70);
		btnCvuContent.addChild(btnCvuBack);
		const btnCvuSprite = Sprite.from("package-1/copy.png");
		setPivotToCenter(btnCvuSprite);
		btnCvuSprite.scale.set(40 / btnCvuSprite.texture.width);
		btnCvuContent.addChild(btnCvuSprite);

		const btnCvu = new Button({
			defaultState: { content: btnCvuContent },
			onClick: () => {
				const textarea = document.createElement("textarea");
				textarea.value = cvuText.text;
				document.body.appendChild(textarea);
				textarea.select();
				document.execCommand("copy");
				document.body.removeChild(textarea);
			},
			highlightState: { scale: 1.05, tween: true },
			fixedCursor: "pointer",
		});
		btnCvu.x = 386;
		this.cvuContent.addChild(btnCvu);

		this.subtitle2 = new Text(i18next.t("PPPayment.subtitle2"), TextStyleDictionary.textBlackBig);
		setPivotToCenter(this.subtitle2);
		this.centerContainer.addChild(this.subtitle2);

		this.aliasContent = new Container();
		this.centerContainer.addChild(this.aliasContent);

		const aliasBack = GraphicsHelper.pixel(ColorDictionary.black);
		setPivotToCenter(aliasBack);
		aliasBack.scale.set(760, 70);
		aliasBack.x = -50;
		this.aliasContent.addChild(aliasBack);

		const aliasText = new Text(i18next.t("PPPayment.alias"), TextStyleDictionary.textWhite);
		setPivotToCenter(aliasText);
		aliasText.x = -50;
		this.aliasContent.addChild(aliasText);

		const btnAliasContent: Container = new Container();
		const btnAliasBack = GraphicsHelper.pixel(ColorDictionary.black);
		setPivotToCenter(btnAliasBack);
		btnAliasBack.scale.set(87, 70);
		btnAliasContent.addChild(btnAliasBack);
		const btnAliasSprite = Sprite.from("package-1/copy.png");
		setPivotToCenter(btnAliasSprite);
		btnAliasSprite.scale.set(40 / btnAliasSprite.texture.width);
		btnAliasContent.addChild(btnAliasSprite);

		const btnAlias = new Button({
			defaultState: { content: btnAliasContent },
			onClick: () => {
				const textarea = document.createElement("textarea");
				textarea.value = aliasText.text;
				document.body.appendChild(textarea);
				textarea.select();
				document.execCommand("copy");
				document.body.removeChild(textarea);
			},
			highlightState: { scale: 1.05, tween: true },
			fixedCursor: "pointer",
		});
		btnAlias.x = 386;
		this.aliasContent.addChild(btnAlias);

		setPivotToCenter(this.cvuContent);
		setPivotToCenter(this.aliasContent);
		this.onChangeOrientation();
	}

	public override onChangeOrientation(): void {
		if (Manager.isPortrait) {
			this.subtitle1.y = 770;
			this.subtitle2.y = 1075;
		} else {
			this.subtitle1.y = 400;
			this.subtitle2.y = 680;
		}
		this.cvuContent.y = this.subtitle1.y + 115;
		this.aliasContent.y = this.subtitle2.y + 115;
	}
}
