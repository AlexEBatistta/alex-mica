import type { Graphics, Sprite, Text } from "pixi.js";
import { Container } from "pixi.js";
import { GraphicsHelper } from "../../../engine/utils/GraphicsHelper";
import { Manager } from "../../..";
import { ColorDictionary, WIDTH_PARTS } from "../../../engine/utils/Constants";
import type { SDFBitmapText } from "../../../engine/sdftext/SDFBitmapText";
import { ScaleHelper } from "../../../engine/utils/ScaleHelper";
import type { Button } from "../../../engine/ui/button/Button";
import { Easing, Tween } from "tweedle.js";

export class BaseParts extends Container {
	protected background: Graphics;
	protected title: SDFBitmapText;
	protected text: Text;
	protected button: Button;
	protected icon: Sprite;
	protected btnTween: Tween<any>;
	constructor(alpha: number, color: number = ColorDictionary.black, heightPart?: number) {
		super();

		this.background = GraphicsHelper.pixel(color, alpha);
		this.background.pivot.set(0.5, 0);
		this.background.width = WIDTH_PARTS;
		this.background.height = heightPart ?? 100;
		this.addChild(this.background);
	}

	public onChangeOrientation(): void {
		if (this.text != undefined) {
			this.text.style.wordWrapWidth = ScaleHelper.IDEAL_WIDTH - (Manager.isPortrait ? 150 : 300);
		}
		if (this.button != undefined && this.btnTween == undefined) {
			this.btnTween = new Tween(this.button.scale).to({ x: 1.025, y: 1.025 }, 1000).yoyo(true).repeat(Infinity).easing(Easing.Sinusoidal.InOut).start();
		}
	}

	public onResize(): void {
		this.background.width = Manager.width;
	}
}
