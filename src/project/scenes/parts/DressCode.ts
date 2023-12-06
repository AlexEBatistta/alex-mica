import type { Graphics } from "pixi.js";
import { Container, Text } from "pixi.js";
import { Sprite } from "pixi.js";
import { BaseParts } from "./BaseParts";
import { SDFBitmapText } from "../../../engine/sdftext/SDFBitmapText";
import i18next from "i18next";
import { ColorDictionary, Offsets, SDFTextStyleDictionary, TextStyleDictionary } from "../../../engine/utils/Constants";
import { GraphicsHelper } from "../../../engine/utils/GraphicsHelper";
import { setPivotToCenter } from "../../../engine/utils/MathUtils";
import { Button } from "../../../engine/ui/button/Button";
import { Manager } from "../../..";
import { DressCodePopup } from "../../popups/DressCodePopup";

export class DressCode extends BaseParts {
	constructor() {
		super(1, ColorDictionary.white, 888);

		this.title = new SDFBitmapText(i18next.t("DressCode.title"), SDFTextStyleDictionary.titleBlack);
		this.title.anchor.x = 0.5;
		this.addChild(this.title);

		this.icon = Sprite.from("package-1/dressCode.png");
		this.icon.anchor.x = 0.5;
		this.icon.tint = ColorDictionary.black;
		this.addChild(this.icon);

		this.text = new Text(i18next.t("DressCode.text"), TextStyleDictionary.textBlack);
		this.text.anchor.x = 0.5;
		this.addChild(this.text);

		const btnContent: Container = new Container();
		const btnBack: Graphics = GraphicsHelper.pixel(ColorDictionary.black);
		btnBack.pivot.x = 0.5;
		btnBack.scale.set(520, 90);
		btnContent.addChild(btnBack);
		const btnText: Text = new Text(i18next.t("DressCode.button"), TextStyleDictionary.buttonWhite);
		setPivotToCenter(btnText);
		btnText.y = btnBack.height / 2;
		btnContent.addChild(btnText);

		this.button = new Button({
			defaultState: { content: btnContent, scale: 1 },
			highlightState: { scale: 1.05, tween: true },
			onClick: () => {
				Manager.openPopup(DressCodePopup);
			},
			fixedCursor: "pointer",
		});
		this.addChild(this.button);

		this.onChangeOrientation();
	}

	public override onChangeOrientation(): void {
		super.onChangeOrientation();
		this.title.y = Offsets.top;
		this.icon.y = this.title.y + this.title.height + Offsets.icon;
		this.text.y = this.icon.y + this.icon.height + Offsets.text;
		this.button.y = this.text.y + this.text.height + Offsets.button;
		this.background.height = this.button.y + this.button.height + Offsets.bottom;
	}
}
