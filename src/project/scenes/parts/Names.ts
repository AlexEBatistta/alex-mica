import type { Rectangle } from "pixi.js";
import { Sprite, Text } from "pixi.js";
import { BaseParts } from "./BaseParts";
import { setPivotToCenter } from "../../../engine/utils/MathUtils";
import { AdjustmentFilter } from "@pixi/filter-adjustment";
import { GraphicsHelper } from "../../../engine/utils/GraphicsHelper";
import i18next from "i18next";
import { SDFBitmapText } from "../../../engine/sdftext/SDFBitmapText";
import { AnimatedArrow } from "../../../engine/ui/button/AnimatedArrow";
import { ColorDictionary, SDFTextStyleDictionary, TextStyleDictionary } from "../../../engine/utils/Constants";
export class Names extends BaseParts {
	private arrow: AnimatedArrow;
	constructor() {
		super(0.8, ColorDictionary.black);

		const coverPhoto = Sprite.from("cover_photo");
		coverPhoto.anchor.set(0.5, 0);
		coverPhoto.filters = [new AdjustmentFilter({ saturation: 0.4 })];
		this.addChild(coverPhoto);

		const overPhoto = GraphicsHelper.pixel(0x000000, 0.35);
		overPhoto.pivot.x = 0.5;
		overPhoto.scale.set(coverPhoto.width, coverPhoto.height);
		this.addChild(overPhoto);

		const date = new SDFBitmapText(i18next.t("Names.date"), SDFTextStyleDictionary.namesDate);
		setPivotToCenter(date);
		date.position.set(395, 400);
		this.addChild(date);

		const names = new SDFBitmapText(i18next.t("Names.names"), SDFTextStyleDictionary.namesTitle);
		setPivotToCenter(names);
		names.position.set(0, 1490);
		// names.filters = [new DropShadowFilter({ quality: 5 })];
		this.addChild(names);

		const subtitle = new Text(i18next.t("Names.subtitle"), TextStyleDictionary.namesSubtitle);
		setPivotToCenter(subtitle);
		subtitle.position.set(0, 1632);
		this.addChild(subtitle);

		const heart = Sprite.from("package-1/heart.png");
		heart.anchor.set(0.5);
		heart.position.set(0, 1758);
		this.addChild(heart);

		this.arrow = new AnimatedArrow();
		this.arrow.y = coverPhoto.height - this.arrow.height * 3.5;
		this.addChild(this.arrow);

		this.background.height = coverPhoto.height;
		this.background.visible = false;
	}

	public getArrowBounds(): Rectangle {
		return this.arrow.getLocalBounds();
	}
}
