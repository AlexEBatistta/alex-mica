import { Easing, Tween } from "tweedle.js";
import { Container, Graphics, Sprite } from "pixi.js";
import { TransitionBase } from "./TransitionBase";
import type { ResolveOverride } from "../ITransition";
import { TweenUtils } from "../../tweens/tweenUtils";
import { GraphicsHelper } from "../../utils/GraphicsHelper";
import { ColorDictionary } from "../../utils/Constants";
import { Timer } from "../../tweens/Timer";
import { ScaleHelper } from "../../utils/ScaleHelper";

export class LoadingTransition extends TransitionBase {
	private readonly color: number;
	private readonly fadeInTime: number;
	private readonly fadeOutTime: number;
	private readonly fade: Graphics;

	private background: Graphics;
	private centerContainer: Container;

	public constructor() {
		super();

		this.fade = new Graphics();
		this.fade.interactive = true;

		this.background = GraphicsHelper.pixel(ColorDictionary.black);
		this.background.pivot.set(0.5);
		this.addChild(this.background);

		this.centerContainer = new Container();
		this.addChild(this.centerContainer);

		/* const loading1 = Sprite.from("loading_1");
		loading1.anchor.set(0.5);
		loading1.scale.set(0.25);
		loading1.position.set(-400, 0);
		new Tween(loading1, this.tweens).to({ angle: 360 }, 1500).easing(Easing.Quadratic.InOut).repeat(Infinity).start();
		this.centerContainer.addChild(loading1); */

		const loading2 = Sprite.from("loading_2");
		loading2.anchor.set(0.5);
		loading2.scale.set(0.25);
		loading2.position.set(0, 300);
		new Timer(this.tweens)
			.to(1000 / 8)
			.repeat(Infinity)
			.onRepeat(() => (loading2.angle += 360 / 8))
			.start();
		this.centerContainer.addChild(loading2);

		this.fadeOutTime = 1000;

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
		this.centerContainer.visible = false;
		const directingTween = new Tween(this.background, this.tweens).to({ alpha: 0 }, this.fadeOutTime).easing(Easing.Linear.None).start();
		return TweenUtils.promisify(directingTween).then(); // then converts the promise to a void promise.
	}
	/* public override onDownloadProgress(progress: number, bundlesProgress: Record<string, number>): void {
		console.log(progress, bundlesProgress["package-1"]);
	} */

	public override onResize(newW: number, newH: number): void {
		this.background.scale.set(newW, newH);
		this.background.position.set(newW / 2, newH / 2);

		ScaleHelper.setScaleRelativeToIdeal(this.centerContainer, newW, newH);
		this.centerContainer.position.set(newW / 2, newH / 2);

		this.fade.clear();
		this.fade.beginFill(this.color, 0.8);
		this.fade.drawRect(0, 0, newW, newH);
		this.fade.endFill();
	}
}
