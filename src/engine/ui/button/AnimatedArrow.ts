import { Container, Sprite } from "pixi.js";
import { Easing, Tween } from "tweedle.js";

export class AnimatedArrow extends Container {
	private sprites: Array<Sprite>;
	constructor(amount: number, callback: Function) {
		super();
		this.sprites = new Array();
		for (let i = 0; i < amount; i++) {
			const arrow: Sprite = Sprite.from("package-1/arrow.png");
			arrow.anchor.set(0.5);
			arrow.y = i + i * arrow.height;
			arrow.alpha = 0;
			this.addChild(arrow);
			this.sprites.push(arrow);
			new Tween(arrow)
				.to({ alpha: 1 }, 500)
				.easing(Easing.Sinusoidal.Out)
				.yoyo(true)
				.repeat(Infinity)
				.delay(0 + 250 * i)
				.start();
		}

		this.pivot.y = this.height / 2;

		this.interactive = true;
		this.cursor = "pointer";
		this.on("pointertap", () => callback());
	}
}
