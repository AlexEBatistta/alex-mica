import type { Rectangle } from "pixi.js";
import { Point } from "pixi.js";
import { Container } from "pixi.js";
import { Sprite, Text } from "pixi.js";
import { BaseParts } from "./BaseParts";
import { setPivotToCenter } from "../../../engine/utils/MathUtils";
import i18next from "i18next";
import { SDFBitmapText } from "../../../engine/sdftext/SDFBitmapText";
import { AnimatedArrow } from "../../../engine/ui/button/AnimatedArrow";
import { ColorDictionary, SDFTextStyleDictionary, TextStyleDictionary } from "../../../engine/utils/Constants";
import { Manager } from "../../..";
export class Names extends BaseParts {
	private arrow: AnimatedArrow;
	private bottomContent: Container;
	private rightContent: Container;
	constructor() {
		super(0.001, ColorDictionary.black);

		this.bottomContent = new Container();
		this.addChild(this.bottomContent);

		this.rightContent = new Container();
		this.addChild(this.rightContent);

		const date = new SDFBitmapText(i18next.t("Names.date"), SDFTextStyleDictionary.namesDate);
		setPivotToCenter(date);
		this.rightContent.addChild(date);

		const names = new SDFBitmapText(i18next.t("Names.names"), SDFTextStyleDictionary.namesTitle);
		setPivotToCenter(names);
		names.y = 0;
		this.bottomContent.addChild(names);

		const subtitle = new Text(i18next.t("Names.subtitle"), TextStyleDictionary.namesSubtitle);
		setPivotToCenter(subtitle);
		subtitle.y = 142;
		this.bottomContent.addChild(subtitle);

		const heart = Sprite.from("package-1/heart.png");
		heart.anchor.set(0.5);
		heart.y = 268;
		this.bottomContent.addChild(heart);

		this.arrow = new AnimatedArrow();
		this.arrow.y = 340;
		this.bottomContent.addChild(this.arrow);

		this.background.height = 1920;
	}

	public getArrowBounds(): Rectangle {
		return this.arrow.getLocalBounds();
	}

	public override onChangeOrientation(): void {
		super.onChangeOrientation();
		this.scale.set(Math.min(0.5, this.scale.x));
		const offset = new Point(this.rightContent.width / 1.25, Manager.isPortrait ? 5 : 2.75);
		const pos = this.toLocal(new Point(Manager.width, Manager.height / offset.y));
		this.rightContent.position.set(pos.x - offset.x, pos.y);
		this.bottomContent.y = this.toLocal(new Point(0, Manager.height)).y - this.bottomContent.height * 1.2;
		console.log(this.scale);
	}
}
