import i18next from "i18next";
import type { Graphics } from "pixi.js";
import { utils } from "pixi.js";
import { Container, Sprite, Text } from "pixi.js";
import { Button } from "../../../engine/ui/button/Button";
import { ColorDictionary, Offsets, TextStyleDictionary } from "../../../engine/utils/Constants";
import { GraphicsHelper } from "../../../engine/utils/GraphicsHelper";
import { setPivotToCenter } from "../../../engine/utils/MathUtils";
import { BaseParts } from "./BaseParts";

export class Payment extends BaseParts {
	constructor() {
		super(1, ColorDictionary.black, 886);

		this.icon = Sprite.from("package-1/foodCover.png");
		this.icon.anchor.x = 0.5;
		this.addChild(this.icon);

		this.text = new Text(i18next.t("Payment.text"), TextStyleDictionary.textWhite);
		this.text.anchor.x = 0.5;
		this.addChild(this.text);

		const btnContent: Container = new Container();
		const btnBack: Graphics = GraphicsHelper.pixel(ColorDictionary.white);
		btnBack.pivot.x = 0.5;
		btnBack.scale.set(520, 90);
		btnContent.addChild(btnBack);
		const btnText: Text = new Text(i18next.t("Payment.button"), TextStyleDictionary.buttonBlack);
		setPivotToCenter(btnText);
		btnText.y = btnBack.height / 2;
		btnContent.addChild(btnText);

		this.button = new Button({
			defaultState: { content: btnContent, scale: 1 },
			highlightState: { scale: 1.05, tween: true },
			onClick: () => {
				if (utils.isMobile.any) {
					window.history.pushState({ page: "previous" }, "Página Anterior", window.location.href);
					window.location.href = "http://mpago.li/1TV1Hr8";
				} else {
					window.open("http://mpago.li/1TV1Hr8");
				}
			},
			fixedCursor: "pointer",
		});
		this.addChild(this.button);

		this.onChangeOrientation();
	}

	public override onChangeOrientation(): void {
		super.onChangeOrientation();

		this.icon.y = Offsets.top;
		this.text.y = this.icon.y + this.icon.height + Offsets.text;
		this.button.y = this.text.y + this.text.height + Offsets.button;
		this.background.height = this.button.y + this.button.height + Offsets.bottom;
	}
}
