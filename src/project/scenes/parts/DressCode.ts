import { Text } from "pixi.js";
import { Sprite } from "pixi.js";
import { BaseParts } from "./BaseParts";
import { SDFBitmapText } from "../../../engine/sdftext/SDFBitmapText";
import i18next from "i18next";
import { ColorDictionary, Offsets, SDFTextStyleDictionary, TextStyleDictionary } from "../../../engine/utils/Constants";

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

		this.onChangeOrientation();
	}

	public override onChangeOrientation(): void {
		super.onChangeOrientation();
		this.title.y = Offsets.top;
		this.icon.y = this.title.y + this.title.height + Offsets.icon;
		this.text.y = this.icon.y + this.icon.height + Offsets.text;
		this.background.height = this.text.y + this.text.height + Offsets.bottom;
	}
}
