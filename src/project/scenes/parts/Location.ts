import type { Graphics } from "pixi.js";
import { utils } from "pixi.js";
import { Text } from "pixi.js";
import { Container, Sprite } from "pixi.js";
import { BaseParts } from "./BaseParts";
import { Button } from "../../../engine/ui/button/Button";
import { GraphicsHelper } from "../../../engine/utils/GraphicsHelper";
import { SDFBitmapText } from "../../../engine/sdftext/SDFBitmapText";
import i18next from "i18next";
import { ColorDictionary, Offsets, SDFTextStyleDictionary, TextStyleDictionary, WIDTH_PARTS } from "../../../engine/utils/Constants";
import { setPivotToCenter } from "../../../engine/utils/MathUtils";

export class Location extends BaseParts {
	private backTitle: Graphics;
	private subtitle: SDFBitmapText;
	constructor() {
		super(1, ColorDictionary.white, 1542);

		this.backTitle = GraphicsHelper.pixel(ColorDictionary.black);
		this.backTitle.pivot.x = 0.5;
		this.backTitle.scale.set(WIDTH_PARTS, 238);
		this.addChild(this.backTitle);

		this.title = new SDFBitmapText(i18next.t("Location.title"), SDFTextStyleDictionary.titleWhite);
		this.title.anchor.set(0.5);
		this.addChild(this.title);

		this.icon = Sprite.from("package-1/alliances.png");
		this.icon.anchor.x = 0.5;
		this.icon.tint = ColorDictionary.black;
		this.addChild(this.icon);

		this.subtitle = new SDFBitmapText(i18next.t("Location.subtitle"), SDFTextStyleDictionary.titleBlack);
		this.subtitle.anchor.x = 0.5;
		this.addChild(this.subtitle);

		this.text = new Text(i18next.t("Location.text"), TextStyleDictionary.textBlack);
		this.text.anchor.x = 0.5;
		this.addChild(this.text);

		const btnContent: Container = new Container();
		const btnBack: Graphics = GraphicsHelper.pixel(ColorDictionary.black);
		btnBack.pivot.x = 0.5;
		btnBack.scale.set(520, 90);
		btnContent.addChild(btnBack);
		const btnText: Text = new Text(i18next.t("Location.button"), TextStyleDictionary.buttonWhite);
		setPivotToCenter(btnText);
		btnText.y = btnBack.height / 2;
		btnContent.addChild(btnText);

		this.button = new Button({
			defaultState: { content: btnContent, scale: 1 },
			highlightState: { scale: 1.05, tween: true },
			onClick: () => {
				if (utils.isMobile.any) {
					window.history.pushState({ page: "previous" }, "Página Anterior", window.location.href);
					window.location.href = "geo:-32.2195033,-58.2212609?q=Salon+Zoraida";
				} else {
					window.open(
						"https://www.google.com/maps/place/Salon+Zoraida/@-32.2195033,-58.2212609,17.87z/data=!4m6!3m5!1s0x95ae2dbbb6f25f83:0x162e2001545b65c5!8m2!3d-32.2194934!4d-58.2201643!16s%2Fg%2F11c62c_jfd?entry=ttu"
					);
				}
			},
			fixedCursor: "pointer",
		});
		this.addChild(this.button);

		this.onChangeOrientation();
	}

	public override onChangeOrientation(): void {
		super.onChangeOrientation();

		this.backTitle.height = Offsets.top * 2 + this.title.height;
		this.title.y = this.backTitle.height / 2;
		this.icon.y = this.backTitle.height + Offsets.icon;
		this.text.y = this.icon.y + this.icon.height + Offsets.text;
		this.button.y = this.text.y + this.text.height + Offsets.button;
		this.background.height = this.button.y + this.button.height + Offsets.bottom;
	}
}
