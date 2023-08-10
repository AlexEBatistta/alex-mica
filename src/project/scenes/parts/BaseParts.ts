import type { Graphics } from "pixi.js";
import { Container } from "pixi.js";
import { GraphicsHelper } from "../../../engine/utils/GraphicsHelper";
import { Manager } from "../../..";
import { ColorDictionary } from "../../../engine/utils/Constants";

export class BaseParts extends Container {
	protected background: Graphics;
	constructor(alpha: number, color: number = ColorDictionary.black) {
		super();

		this.background = GraphicsHelper.pixel(color, alpha);
		this.background.pivot.set(0.5, 0);
		this.addChild(this.background);
	}

	protected setBackgroundSize(width: number, height: number): void {
		this.background.width = width;
		this.background.height = height;
	}

	public onResize(): void {
		this.background.width = Manager.width;
	}
}
