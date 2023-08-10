import { Sprite, Text, TextStyle } from "pixi.js";
import { BaseParts } from "./BaseParts";
import { setPivotToCenter } from "../../../engine/utils/MathUtils";
import { AdjustmentFilter } from "@pixi/filter-adjustment";
import { GraphicsHelper } from "../../../engine/utils/GraphicsHelper";
import i18next from "i18next";
import type { ISDFTextStyle } from "../../../engine/sdftext/SDFBitmapText";
import { SDFBitmapText } from "../../../engine/sdftext/SDFBitmapText";
import { DropShadowFilter } from "@pixi/filter-drop-shadow";
export class Names extends BaseParts {
	constructor() {
		super(0.8);
		const coverPhoto = Sprite.from("cover_photo");
		coverPhoto.anchor.set(0.5, 0);
		coverPhoto.filters = [new AdjustmentFilter({ saturation: 0.4 })];
		this.addChild(coverPhoto);

		const overPhoto = GraphicsHelper.pixel(0x000000, 0.35);
		overPhoto.pivot.x = 0.5;
		overPhoto.scale.set(coverPhoto.width, coverPhoto.height);
		this.addChild(overPhoto);

		const date = new SDFBitmapText(i18next.t("Names.date"), { fontName: "monbaiti", fontSize: 205, tint: 0xffffff } as ISDFTextStyle);
		setPivotToCenter(date);
		date.position.set(395, 400);
		this.addChild(date);

		const names = new SDFBitmapText(i18next.t("Names.names"), {
			fontName: "monbaiti",
			fontSize: 134,
			tint: 0xffffff,
		} as ISDFTextStyle);
		setPivotToCenter(names);
		names.position.set(0, 1490);
		names.filters = [new DropShadowFilter()];
		this.addChild(names);

		const style: TextStyle = new TextStyle({
			fontSize: 66,
			fontFamily: "Poppins",
			fill: 0xffffff,
		});
		const subtitle = new Text(i18next.t("Names.subtitle"), style);
		setPivotToCenter(subtitle);
		subtitle.position.set(0, 1632);
		this.addChild(subtitle);

		const heart = Sprite.from("package-1/heart.png");
		heart.anchor.set(0.5);
		heart.position.set(0, 1758);
		this.addChild(heart);

		this.setBackgroundSize(1080, this.height);
	}
}
