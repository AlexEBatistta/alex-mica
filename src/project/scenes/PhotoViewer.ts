import Hammer from "hammerjs";
import type { Graphics } from "pixi.js";
import { Sprite } from "pixi.js";
import { PixiScene } from "../../engine/scenemanager/scenes/PixiScene";
import { GraphicsHelper } from "../../engine/utils/GraphicsHelper";
import { ScaleHelper } from "../../engine/utils/ScaleHelper";
export class PhotoViewer extends PixiScene {
	private background: Graphics;
	private photos: Array<Sprite>;
	private mainPhoto: Sprite;
	private lastPan: string;
	private hammer: HammerManager;
	constructor(photos: Array<Sprite>, index: number) {
		super();
		this.photos = photos;

		this.background = GraphicsHelper.pixel(0x000000, 0.8);
		this.background.interactive = true;
		this.background.on("pointertap", () => this.closeHandler());
		this.addChild(this.background);

		this.mainPhoto = Sprite.from(this.photos[index].texture);
		this.mainPhoto.anchor.set(0.5);
		this.addChild(this.mainPhoto);
	}

	public override onShow(): void {
		const myElement = document.getElementById("pixi-content");

		this.hammer = new Hammer(myElement);
		this.hammer.get("pan").set({ direction: Hammer.DIRECTION_ALL, threshold: 0 });
		this.hammer.on("panleft panright panup pandown panend", this.handleEvents.bind(this));
	}

	public override onDestroy(): void {
		this.hammer.off("panleft panright panup pandown panend");
	}

	private handleEvents(ev: HammerInput): void {
		if (ev.type == "panend") {
			console.log(this.lastPan);
		} else if (ev.type.includes("pan")) {
			this.lastPan = ev.type;
		}
	}

	public override onResize(newW: number, newH: number): void {
		this.background.scale.set(newW, newH);

		ScaleHelper.setScaleRelativeToScreen(this.mainPhoto, newW, newH, 1, 1, Math.min);
		this.mainPhoto.position.set(newW / 2, newH / 2);
	}
}
