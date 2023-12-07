import { Sprite } from "pixi.js";
import { Graphics } from "pixi.js";
import { Container } from "pixi.js";
import { Tween } from "tweedle.js";
import { PixiScene } from "../../engine/scenemanager/scenes/PixiScene";
import type { SDFBitmapText } from "../../engine/sdftext/SDFBitmapText";
import type { Button } from "../../engine/ui/button/Button";
import { ColorDictionary } from "../../engine/utils/Constants";
import { GraphicsHelper } from "../../engine/utils/GraphicsHelper";
import { setPivotToCenter } from "../../engine/utils/MathUtils";
import { ScaleHelper } from "../../engine/utils/ScaleHelper";

export class BasePopup extends PixiScene {
	protected overlay: Graphics;
	protected background: Graphics;
	protected title: SDFBitmapText;
	protected centerContainer: Container;
	protected backTop: Graphics;
	protected backBottom: Graphics;
	protected logo: Sprite;
	protected btnClose: Button;
	protected backgroundContainer: Container;
	constructor() {
		super();

		this.overlay = GraphicsHelper.pixel(ColorDictionary.black, 1);
		this.overlay.alpha = 0;
		this.overlay.interactive = true;
		this.overlay.on("pointertap", this.closePopup.bind(this));
		setPivotToCenter(this.overlay);
		this.addChild(this.overlay);

		this.backgroundContainer = new Container();
		this.addChild(this.backgroundContainer);

		this.background = GraphicsHelper.pixel(ColorDictionary.white);
		this.background.pivot.x = 0.5;
		// setPivotToCenter(this.background);
		this.background.scale.set(1080, 1920);
		this.backgroundContainer.addChild(this.background);

		this.backTop = GraphicsHelper.pixel(ColorDictionary.black);
		this.backTop.pivot.x = 0.5;
		this.backTop.scale.set(1080, 222);
		this.backTop.y = 130;
		this.backgroundContainer.addChild(this.backTop);

		this.backBottom = GraphicsHelper.pixel(ColorDictionary.black);
		this.backBottom.pivot.set(0.5, 1);
		this.backBottom.scale.set(1080, 222);
		this.backBottom.y = 1920;
		this.backgroundContainer.addChild(this.backBottom);

		setPivotToCenter(this.backgroundContainer);

		this.centerContainer = new Container();
		this.addChild(this.centerContainer);

		this.logo = Sprite.from("logo");
		setPivotToCenter(this.logo);
		this.logo.height = 145;
		this.logo.scale.x = this.logo.scale.y;
		this.logo.y = this.backBottom.y - this.backBottom.height / 2;
		this.centerContainer.addChild(this.logo);

		const frame = new Graphics();
		frame.lineStyle(1, ColorDictionary.white, 0.001).drawRect(-1080 / 2, 0, 1080, 1920);
		this.centerContainer.addChild(frame);
		setPivotToCenter(this.centerContainer);
		this.centerContainer.visible = false;
	}

	public override onShow(): void {
		const scaleContainer = this.backgroundContainer.scale.x;
		this.backgroundContainer.scale.x = 0;
		new Tween(this.overlay)
			.to({ alpha: 0.8 }, 250)
			.onComplete(() => {
				new Tween(this.backgroundContainer.scale)
					.to({ x: scaleContainer }, 250)
					.onComplete(() => (this.centerContainer.visible = true))
					.start();
			})
			.start();
	}

	private closePopup(): void {
		this.centerContainer.visible = false;
		new Tween(this.backgroundContainer.scale)
			.to({ x: 0 }, 250)
			.onComplete(() => {
				new Tween(this.overlay).to({ alpha: 0 }, 250).onComplete(this.closeHandler.bind(this)).start();
			})
			.start();
	}

	public override onResize(newW: number, newH: number): void {
		this.overlay.scale.set(newW, newH);
		this.overlay.position.set(newW * 0.5, newH * 0.5);

		ScaleHelper.setScaleRelativeToScreen(this.backgroundContainer, newW, newH, 0.9, 0.9);
		this.backgroundContainer.position.set(newW * 0.5, newH * 0.5);

		this.centerContainer.scale = this.backgroundContainer.scale;
		this.centerContainer.position = this.backgroundContainer.position;
	}
}
