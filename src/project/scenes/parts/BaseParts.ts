import type { Graphics, Sprite, Text } from "pixi.js";
import { Container } from "pixi.js";
import { GraphicsHelper } from "../../../engine/utils/GraphicsHelper";
import { Manager } from "../../..";
import { ColorDictionary, WIDTH_PARTS } from "../../../engine/utils/Constants";
import type { SDFBitmapText } from "../../../engine/sdftext/SDFBitmapText";
import { ScaleHelper } from "../../../engine/utils/ScaleHelper";
import type { Button } from "../../../engine/ui/button/Button";

export class BaseParts extends Container {
	protected background: Graphics;
	protected title: SDFBitmapText;
	protected text: Text;
	protected button: Button;
	protected icon: Sprite;
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
	}

	public onResize(): void {
		this.background.width = Manager.width;
	}
}
