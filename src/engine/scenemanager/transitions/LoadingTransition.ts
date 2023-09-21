import { Easing, Tween } from "tweedle.js";
import { Graphics, Sprite } from "pixi.js";
import { TransitionBase } from "./TransitionBase";
import type { ResolveOverride } from "../ITransition";
import { TweenUtils } from "../../tweens/tweenUtils";
import { ScaleHelper } from "../../utils/ScaleHelper";
import { Manager } from "../../..";
import { AdjustmentFilter } from "@pixi/filter-adjustment";
import { GraphicsHelper } from "../../utils/GraphicsHelper";
// import { ColorDictionary } from "../../utils/Constants";

export class LoadingTransition extends TransitionBase {
	private readonly color: number;
	private readonly fadeInTime: number;
	private readonly fadeOutTime: number;
	private readonly fade: Graphics;

	private background: Sprite;
	private photo: Sprite;

	public constructor() {
		super();

		this.background = Sprite.from("cover_photo");
		this.background.anchor.set(0.5);
		this.addChild(this.background);

		this.fade = new Graphics();
		this.fade.interactive = true;
		// this.addChild(this.fade);

		this.photo = Sprite.from("cover_photo");
		this.photo.anchor.set(0.5, 0);
		this.photo.filters = [new AdjustmentFilter({ saturation: 0.4 })];
		this.addChild(this.photo);

		const overPhoto = GraphicsHelper.pixel(0x000000, 0.35);
		overPhoto.pivot.x = 0.5;
		overPhoto.scale.set(this.photo.width, this.photo.height);
		this.photo.addChild(overPhoto);

		console.log("I EXISTS!");
	}

	public override startCovering(): Promise<void> {
		const directingTween = new Tween(this.fade, this.tweens).to({ alpha: 0.8 }, this.fadeInTime).easing(Easing.Linear.None).start();
		return TweenUtils.promisify(directingTween).then(); // then converts the promise to a void promise.
	}
	public override startResolving(): Promise<ResolveOverride> {
		return Promise.resolve(undefined);
	}
	public override startUncovering(): Promise<void> {
		this.tweens.removeAll();
		const directingTween = new Tween(this.fade, this.tweens).to({ alpha: 0.8 }, this.fadeOutTime).easing(Easing.Linear.None).start();
		return TweenUtils.promisify(directingTween).then(); // then converts the promise to a void promise.
	}

	public override onResize(newW: number, newH: number): void {
		ScaleHelper.setScaleRelativeToScreen(this.background, newW, newH, 1, 1, Math.max);
		this.background.position.set(newW / 2, newH / 2);

		const scale = ScaleHelper.screenScale(ScaleHelper.IDEAL_WIDTH, ScaleHelper.IDEAL_HEIGHT, newW, newH, 1, 1, Manager.isPortrait ? Math.min : Math.max);
		this.photo.scale.set(scale);
		this.photo.x = newW / 2;

		this.fade.clear();
		this.fade.beginFill(this.color, 0.8);
		this.fade.drawRect(0, 0, newW, newH);
		this.fade.endFill();
	}
}
