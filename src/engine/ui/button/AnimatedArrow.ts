import { Container, Rectangle, Sprite } from "pixi.js";
import { Easing, Tween } from "tweedle.js";

export class AnimatedArrow extends Container {
	private arrow: Sprite;
	constructor(callback: Function) {
		super();

		this.arrow = Sprite.from("package-1/arrow.png");
		this.arrow.anchor.set(0.5);
		this.arrow.alpha = 0;

		this.addChild(this.arrow);
		new Tween(this.arrow).to({ alpha: 1 }, 1000).easing(Easing.Sinusoidal.InOut).yoyo(true).repeat(Infinity).start();
		new Tween(this.arrow).to({ y: this.arrow.height }, 2000).repeat(Infinity).from({ y: 0 }).easing(Easing.Sinusoidal.InOut).start();

		this.hitArea = new Rectangle(-this.arrow.width, -this.arrow.height, this.arrow.width * 2, this.arrow.height * 3);
		this.interactive = true;
		this.cursor = "pointer";
		this.on("pointertap", () => callback());
	}
}
