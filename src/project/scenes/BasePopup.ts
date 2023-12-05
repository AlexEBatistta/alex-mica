import type { Graphics } from "pixi.js";
import type { Container } from "pixi.js";
import { Tween } from "tweedle.js";
import { PixiScene } from "../../engine/scenemanager/scenes/PixiScene";
import type { SDFBitmapText } from "../../engine/sdftext/SDFBitmapText";
import { ColorDictionary } from "../../engine/utils/Constants";
import { GraphicsHelper } from "../../engine/utils/GraphicsHelper";
import { setPivotToCenter } from "../../engine/utils/MathUtils";

export class BasePopup extends PixiScene {
	protected overlay: Graphics;
	protected background: Graphics;
	protected title: SDFBitmapText;
	protected centerContainer: Container;
	constructor(alpha: number = 1, color: number = ColorDictionary.white) {
		super();

		this.overlay = GraphicsHelper.pixel(ColorDictionary.black, 1);
		this.overlay.alpha = 0;
		this.overlay.interactive = true;
		this.overlay.on("pointertap", this.closePopup.bind(this));
		setPivotToCenter(this.overlay);
		this.addChild(this.overlay);

		this.background = GraphicsHelper.pixel(color, alpha);
		setPivotToCenter(this.background);
		this.addChild(this.background);
	}

	public override onShow(): void {
		const scaleBack = this.background.scale.x;
		this.background.scale.x = 0;
		new Tween(this.overlay)
			.to({ alpha: 0.8 }, 250)
			.onComplete(() => {
				new Tween(this.background.scale).to({ x: scaleBack }, 250).start();
			})
			.start();
	}

	private closePopup(): void {
		new Tween(this.background.scale)
			.to({ x: 0 }, 250)
			.onComplete(() => {
				new Tween(this.overlay).to({ alpha: 0 }, 250).onComplete(this.closeHandler.bind(this)).start();
			})
			.start();
	}

	public override onResize(newW: number, newH: number): void {
		this.overlay.scale.set(newW, newH);
		this.overlay.position.set(newW * 0.5, newH * 0.5);

		this.background.scale.set(newW * 0.8, newH * 0.8);
		this.background.position.set(newW * 0.5, newH * 0.5);
	}
}
