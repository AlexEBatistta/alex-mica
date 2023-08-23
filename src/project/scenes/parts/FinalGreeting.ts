import i18next from "i18next";
import { Text } from "pixi.js";
import { ColorDictionary, TextStyleDictionary, WIDTH_PARTS } from "../../../engine/utils/Constants";
import { setPivotToCenter } from "../../../engine/utils/MathUtils";
import { BaseParts } from "./BaseParts";

export class FinalGreeting extends BaseParts {
	constructor() {
		super(1, ColorDictionary.black);
		this.setBackgroundSize(WIDTH_PARTS, 310);

		const text: Text = new Text(i18next.t("FinalGreeting"), TextStyleDictionary.textWhite);
		setPivotToCenter(text);
		text.y = 155;
		this.addChild(text);
	}
}
