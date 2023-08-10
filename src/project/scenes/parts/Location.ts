import type { Graphics } from "pixi.js";
import { Text } from "pixi.js";
import { Container, Sprite } from "pixi.js";
import { BaseParts } from "./BaseParts";
import { Button } from "../../../engine/ui/button/Button";
import { GraphicsHelper } from "../../../engine/utils/GraphicsHelper";
import { ScaleHelper } from "../../../engine/utils/ScaleHelper";
import { SDFBitmapText } from "../../../engine/sdftext/SDFBitmapText";
import i18next from "i18next";
import { ColorDictionary, SDFTextStyleDictionary, TextStyleDictionary } from "../../../engine/utils/Constants";
import { setPivotToCenter } from "../../../engine/utils/MathUtils";

export class Location extends BaseParts {
	constructor() {
		super(1, ColorDictionary.white);
		this.setBackgroundSize(ScaleHelper.IDEAL_WIDTH, 1542);

		const backTitle: Graphics = GraphicsHelper.pixel(ColorDictionary.black);
		backTitle.pivot.set(0.5, 0);
		backTitle.scale.set(ScaleHelper.IDEAL_WIDTH, 238);
		this.addChild(backTitle);

		const title: SDFBitmapText = new SDFBitmapText(i18next.t("Location.title"), SDFTextStyleDictionary.titleWhite);
		setPivotToCenter(title);
		title.y = 120;
		this.addChild(title);

		const icon: Sprite = Sprite.from("package-1/alliances.png");
		icon.anchor.set(0.5);
		icon.tint = ColorDictionary.black;
		icon.y = 525;
		this.addChild(icon);

		const subtitle: SDFBitmapText = new SDFBitmapText(i18next.t("Location.subtitle"), SDFTextStyleDictionary.titleBlack);
		setPivotToCenter(subtitle);
		subtitle.y = 835;
		this.addChild(subtitle);

		const text: Text = new Text(i18next.t("Location.text"), TextStyleDictionary.text);
		setPivotToCenter(text);
		text.y = 1150;
		this.addChild(text);

		const btnContent: Container = new Container();
		const btnBack: Graphics = GraphicsHelper.pixel(ColorDictionary.black);
		btnBack.pivot.set(0.5);
		btnBack.scale.set(520, 90);
		btnContent.addChild(btnBack);
		const btnText: Text = new Text(i18next.t("Location.button"), TextStyleDictionary.buttons);
		setPivotToCenter(btnText);
		btnContent.addChild(btnText);

		const button = new Button({
			defaultState: { content: btnContent, scale: 1 },
			highlightState: { scale: 1.05, tween: true },
			onClick: () => {
				window.location.href = "geo:-32.2195033,-58.2212609?q=Salon+Zoraida";
				window.open(
					"https://www.google.com/maps/place/Salon+Zoraida/@-32.2195033,-58.2212609,17.87z/data=!4m6!3m5!1s0x95ae2dbbb6f25f83:0x162e2001545b65c5!8m2!3d-32.2194934!4d-58.2201643!16s%2Fg%2F11c62c_jfd?entry=ttu"
				);
			},
			fixedCursor: "pointer",
		});
		button.y = 1425;
		this.addChild(button);
	}
}
