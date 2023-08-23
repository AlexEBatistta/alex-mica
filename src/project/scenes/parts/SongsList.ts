import i18next from "i18next";
import type { Graphics } from "pixi.js";
import { Container, Text } from "pixi.js";
import { SDFBitmapText } from "../../../engine/sdftext/SDFBitmapText";
import { Button } from "../../../engine/ui/button/Button";
import { ColorDictionary, SDFTextStyleDictionary, TextStyleDictionary, WIDTH_PARTS } from "../../../engine/utils/Constants";
import { GraphicsHelper } from "../../../engine/utils/GraphicsHelper";
import { setPivotToCenter } from "../../../engine/utils/MathUtils";
import { BaseParts } from "./BaseParts";

export class SongsList extends BaseParts {
	constructor() {
		super(1, ColorDictionary.white);
		this.setBackgroundSize(WIDTH_PARTS, 721);

		const title: SDFBitmapText = new SDFBitmapText(i18next.t("SongsList.title"), SDFTextStyleDictionary.titleBlack);
		setPivotToCenter(title);
		title.y = 133;
		this.addChild(title);

		const text: Text = new Text(i18next.t("SongsList.text"), TextStyleDictionary.textBlack);
		setPivotToCenter(text);
		text.y = 342;
		this.addChild(text);

		const btnContent: Container = new Container();
		const btnBack: Graphics = GraphicsHelper.pixel(ColorDictionary.black);
		btnBack.pivot.set(0.5);
		btnBack.scale.set(665, 90);
		btnContent.addChild(btnBack);
		const btnText: Text = new Text(i18next.t("SongsList.button"), TextStyleDictionary.buttonWhite);
		setPivotToCenter(btnText);
		btnContent.addChild(btnText);

		const button = new Button({
			defaultState: { content: btnContent, scale: 1 },
			highlightState: { scale: 1.05, tween: true },
			onClick: () => {
				/* if (utils.isMobile.any) {
					window.history.pushState({ page: "previous" }, "Página Anterior", window.location.href);
					window.location.href = "geo:-32.2195033,-58.2212609?q=Salon+Zoraida";
				} else {
					window.open(
						"https://www.google.com/maps/place/Salon+Zoraida/@-32.2195033,-58.2212609,17.87z/data=!4m6!3m5!1s0x95ae2dbbb6f25f83:0x162e2001545b65c5!8m2!3d-32.2194934!4d-58.2201643!16s%2Fg%2F11c62c_jfd?entry=ttu"
					);
				} */
			},
			fixedCursor: "pointer",
		});
		button.y = 533;
		this.addChild(button);
	}
}
