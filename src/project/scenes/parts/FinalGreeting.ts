import i18next from "i18next";
import { Text } from "pixi.js";
import { ColorDictionary, Offsets, TextStyleDictionary } from "../../../engine/utils/Constants";
import { BaseParts } from "./BaseParts";

export class FinalGreeting extends BaseParts {
	constructor() {
		super(1, ColorDictionary.black, 310);

		this.text = new Text(i18next.t("FinalGreeting"), TextStyleDictionary.textWhite);
		this.text.anchor.x = 0.5;
		this.text.y = 155;
		this.addChild(this.text);

		this.onChangeOrientation();
	}

	public override onChangeOrientation(): void {
		super.onChangeOrientation();
		this.text.y = Offsets.top;
		this.background.height = this.text.y + this.text.height + Offsets.bottom;
	}
}
