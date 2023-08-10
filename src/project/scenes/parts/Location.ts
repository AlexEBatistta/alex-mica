import type { Graphics } from "pixi.js";
import { Container, Sprite } from "pixi.js";
import { BaseParts } from "./BaseParts";
import { Button } from "../../../engine/ui/button/Button";
import { GraphicsHelper } from "../../../engine/utils/GraphicsHelper";
import { ScaleHelper } from "../../../engine/utils/ScaleHelper";

export class Location extends BaseParts {
	constructor() {
		super(0.3);
		this.setBackgroundSize(ScaleHelper.IDEAL_WIDTH, 300);

		const icon: Sprite = Sprite.from("package-1/location.png");
		icon.scale.set(100 / icon.width);
		icon.anchor.set(0.5);
		icon.y = 100;
		this.addChild(icon);

		const btnContent: Container = new Container();
		const btnBack: Graphics = GraphicsHelper.pixel(0xff0000);
		btnBack.pivot.set(0.5);
		btnBack.scale.set(100, 50);
		btnContent.addChild(btnBack);

		const button = new Button({
			defaultState: { content: btnContent, scale: 1 },
			highlightState: { scale: 1.1 },
			onClick: () =>
				window.open(
					"https://www.google.com/maps/place/Berduc+1317,+San+Jos%C3%A9,+Entre+R%C3%ADos/@-32.2084445,-58.2129572,14.42z/data=!4m5!3m4!1s0x95ae2deb0c73b7d1:0x90b1fb0f3b4acd99!8m2!3d-32.2071111!4d-58.208099?entry=ttu"
				),
			fixedCursor: "pointer",
		});
		button.y = 225;
		this.addChild(button);
	}
}
