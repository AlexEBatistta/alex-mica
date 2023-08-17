import i18next from "i18next";
import { Text } from "pixi.js";
import { ColorDictionary, TextStyleDictionary } from "../../../engine/utils/Constants";
import { setPivotToCenter } from "../../../engine/utils/MathUtils";
import { ScaleHelper } from "../../../engine/utils/ScaleHelper";
import { BaseParts } from "./BaseParts";

export class FinalGreeting extends BaseParts {
	constructor() {
		super(1, ColorDictionary.black);
		this.setBackgroundSize(ScaleHelper.IDEAL_WIDTH, 310);

		const text: Text = new Text(i18next.t("FinalGreeting"), TextStyleDictionary.textWhite);
		setPivotToCenter(text);
		text.y = 155;
		this.addChild(text);
	}
}
