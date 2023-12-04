import { Easing, Tween } from "tweedle.js";
import { Container, Graphics, Sprite, Text } from "pixi.js";
import { TransitionBase } from "./TransitionBase";
import type { ResolveOverride } from "../ITransition";
import { TweenUtils } from "../../tweens/tweenUtils";
import { GraphicsHelper } from "../../utils/GraphicsHelper";
import { ColorDictionary, SDFTextStyleDictionary, TextStyleDictionary } from "../../utils/Constants";
import { ScaleHelper } from "../../utils/ScaleHelper";
import { Button } from "../../ui/button/Button";
import { SDFBitmapText } from "../../sdftext/SDFBitmapText";
import i18next from "i18next";
import { setPivotToCenter } from "../../utils/MathUtils";
import { Manager } from "../../..";

export class LoadingTransition extends TransitionBase {
	private readonly color: number;
	private readonly fadeInTime: number;
	private readonly fadeOutTime: number;
	private readonly fade: Graphics;

	private background: Graphics;
	private centerContainer: Container;
	private logo: Sprite;
	private title: SDFBitmapText;
	private button: Button;

	public constructor() {
		super();

		this.fade = new Graphics();
		this.fade.interactive = true;

		this.background = GraphicsHelper.pixel(ColorDictionary.black);
		this.background.pivot.set(0.5);
		this.addChild(this.background);

		this.centerContainer = new Container();
		this.addChild(this.centerContainer);

		this.logo = Sprite.from("logo");
		this.logo.anchor.set(0.5);
		this.logo.y = -145;
		this.centerContainer.addChild(this.logo);

		this.title = new SDFBitmapText(i18next.t("Loader.title"), SDFTextStyleDictionary.titleWhite);
		setPivotToCenter(this.title);
		this.title.y = 130;
		this.centerContainer.addChild(this.title);

		const btnContent: Container = new Container();
		const btnBack: Graphics = GraphicsHelper.pixel(ColorDictionary.white);
		btnBack.pivot.x = 0.5;
		btnBack.scale.set(520, 90);
		btnContent.addChild(btnBack);
		const btnText: Text = new Text(i18next.t("Loader.button"), TextStyleDictionary.buttonBlack);
		setPivotToCenter(btnText);
		btnText.y = btnBack.height / 2;
		btnContent.addChild(btnText);

		this.button = new Button({
			defaultState: { content: btnContent, scale: 1 },
			highlightState: { scale: 1.05, tween: true },
			onClick: () => {
				Manager.resumeTransition();
			},
			fixedCursor: "pointer",
		});
		this.button.y = 270;
		this.button.visible = false;
		this.centerContainer.addChild(this.button);

		this.fadeOutTime = 1000;

		this.interactive = true;
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
		new Tween(this.centerContainer, this.tweens).to({ alpha: 0 }, this.fadeOutTime).easing(Easing.Exponential.Out).start();
		const directingTween = new Tween(this.background, this.tweens).to({ alpha: 0 }, this.fadeOutTime).easing(Easing.Linear.None).start();
		return TweenUtils.promisify(directingTween).then(); // then converts the promise to a void promise.
	}
	public override onDownloadProgress(_progress: number, bundlesProgress: Record<string, number>): void {
		if (bundlesProgress["package-1"] == 1) {
			this.button.visible = true;
		}
	}

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
