import { Text } from "pixi.js";
import { Sprite } from "pixi.js";
import { BaseParts } from "./BaseParts";
import { SDFBitmapText } from "../../../engine/sdftext/SDFBitmapText";
import i18next from "i18next";
import { ColorDictionary, SDFTextStyleDictionary, TextStyleDictionary } from "../../../engine/utils/Constants";
import { setPivotToCenter } from "../../../engine/utils/MathUtils";
import { ScaleHelper } from "../../../engine/utils/ScaleHelper";

export class DressCode extends BaseParts {
	constructor() {
		super(1, ColorDictionary.black);
		this.setBackgroundSize(ScaleHelper.IDEAL_WIDTH, 888);

		const title: SDFBitmapText = new SDFBitmapText(i18next.t("DressCode.title"), SDFTextStyleDictionary.titleWhite);
		setPivotToCenter(title);
		title.y = 95;
		this.addChild(title);

		const icon: Sprite = Sprite.from("package-1/dressCode.png");
		icon.anchor.set(0.5);
		icon.y = 335;
		this.addChild(icon);

		const text: Text = new Text(i18next.t("DressCode.text"), TextStyleDictionary.textWhite);
		setPivotToCenter(text);
		text.y = 688;
		this.addChild(text);
	}
}
