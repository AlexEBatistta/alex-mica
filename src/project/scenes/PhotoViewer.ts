import Hammer from "hammerjs";
import type { Graphics } from "pixi.js";
import { Point } from "pixi.js";
import { Sprite } from "pixi.js";
import { Easing, Tween } from "tweedle.js";
import { Manager } from "../..";
import { PixiScene } from "../../engine/scenemanager/scenes/PixiScene";
import { Timer } from "../../engine/tweens/Timer";
import { GraphicsHelper } from "../../engine/utils/GraphicsHelper";
import { ScaleHelper } from "../../engine/utils/ScaleHelper";

const enum HammerEvents {
	PANUP = "panup",
	PANDOWN = "pandown",
	PANLEFT = "panleft",
	PANRIGHT = "panright",
	PANEND = "panend",
	DOUBLETAP = "doubletap",
	PRESS = "press",
}

const ZOOM: number = 2;
const TIME_PHOTO: number = 2000;
export class PhotoViewer extends PixiScene {
	private background: Graphics;
	private photos: Array<Sprite>;
	private mainPhoto: Sprite;
	private hammer: HammerManager;
	private currentIndex: number;
	private inZoom: boolean;
	private defaultScale: Point;
	private zoomPosition: Point;
	private timer: Timer;
	constructor(photos: Array<Sprite>, index: number) {
		super();
		this.photos = photos;
		this.currentIndex = index;
		this.inZoom = false;

		this.background = GraphicsHelper.pixel(0x000000, 0.8);
		this.background.interactive = true;
		this.addChild(this.background);

		this.mainPhoto = Sprite.from(this.photos[index].texture.clone());
		this.mainPhoto.anchor.set(0.5);
		this.addChild(this.mainPhoto);

		this.timer = new Timer()
			.to(TIME_PHOTO)
			.onRepeat(() => {
				new Tween(this.mainPhoto)
					.to({ alpha: 0 }, 150)
					.easing(Easing.Sinusoidal.Out)
					.onComplete(() => {
						this.currentIndex = (this.currentIndex + 1) % this.photos.length;
						this.mainPhoto.texture = this.photos[this.currentIndex].texture.clone();
						new Tween(this.mainPhoto).to({ alpha: 1 }, 150).easing(Easing.Sinusoidal.In).start();
					})
					.start();
			})
			.repeat(Infinity)
			.start();
	}

	public override onShow(): void {
		const myElement = document.getElementById("pixi-content");

		this.hammer = new Hammer(myElement);
		this.hammer.get("pan").set({ direction: Hammer.DIRECTION_ALL, threshold: 10 });
		this.hammer.on("panleft panright panup pandown panend", this.handlePanEvents.bind(this));
		this.hammer.get("press").set({ time: 0 });
		this.hammer.on("doubletap press", this.handleZoom.bind(this));
	}

	public override onDestroy(): void {
		this.hammer.off("panleft panright panup pandown panend");
		this.hammer.off("doubletap press");
	}

	private handlePanEvents(ev: HammerInput): void {
		if (this.inZoom) {
			this.mainPhoto.x = this.zoomPosition.x + ev.deltaX;
			this.mainPhoto.y = this.zoomPosition.y + ev.deltaY;
			return;
		}

		const center: Point = new Point(Manager.width / 2, Manager.height / 2);
		if (ev.type == HammerEvents.PANEND) {
			if (this.mainPhoto.x != center.x) {
				const toLeft: boolean = this.mainPhoto.x < center.x;
				if (toLeft) {
					if (this.mainPhoto.x > center.x - this.mainPhoto.width / 3) {
						this.mainPhoto.x = center.x;
						return;
					}
					this.currentIndex = (this.currentIndex + 1) % this.photos.length;
				} else {
					if (this.mainPhoto.x < center.x + this.mainPhoto.width / 3) {
						this.mainPhoto.x = center.x;
						return;
					}
					this.currentIndex = (this.currentIndex - 1 + this.photos.length) % this.photos.length;
				}
				new Tween(this.mainPhoto)
					.to({ x: toLeft ? -this.mainPhoto.width / 2 : Manager.width + this.mainPhoto.width / 2, y: center.y }, 100)
					.onComplete(() => {
						this.mainPhoto.texture = this.photos[this.currentIndex].texture.clone();
						new Tween(this.mainPhoto)
							.to({ x: center.x }, 100)
							.from({
								x: toLeft ? Manager.width + this.mainPhoto.width / 2 : -this.mainPhoto.width / 2,
								y: center.y,
							})
							.onComplete(() => this.timer.restart())
							.start();
					})
					.start();
			}

			if (this.mainPhoto.y != center.y) {
				const toUp: boolean = this.mainPhoto.y < center.y;
				if (toUp) {
					if (this.mainPhoto.y > center.y - this.mainPhoto.height / 5) {
						this.mainPhoto.y = center.y;
						return;
					}
				} else {
					if (this.mainPhoto.y < center.y + this.mainPhoto.height / 5) {
						this.mainPhoto.y = center.y;
						return;
					}
				}

				new Tween(this.mainPhoto)
					.to({ x: center.x, y: this.mainPhoto.y < center.y ? -this.mainPhoto.height / 2 : Manager.height + this.mainPhoto.height / 2 }, 100)
					.onComplete(() => {
						this.closeHandler();
					})
					.start();
			}
		} else {
			if ((ev.type == HammerEvents.PANLEFT || ev.type == HammerEvents.PANRIGHT) && this.mainPhoto.y == center.y) {
				this.mainPhoto.x = center.x + ev.deltaX;
			} else if ((ev.type == HammerEvents.PANDOWN || ev.type == HammerEvents.PANUP) && this.mainPhoto.x == center.x) {
				this.mainPhoto.y = center.y + ev.deltaY;
			}
		}
	}

	private handleZoom(ev: HammerInput): void {
		if (ev.type == HammerEvents.DOUBLETAP) {
			if (this.inZoom) {
				this.inZoom = false;
				this.onResize(Manager.width, Manager.height);
			} else {
				this.inZoom = true;
				const localPos = this.mainPhoto.toLocal(ev.center);
				this.mainPhoto.x = this.mainPhoto.x - localPos.x;
				this.mainPhoto.y = this.mainPhoto.y - localPos.y;
				this.zoomPosition = this.mainPhoto.position.clone();
				this.mainPhoto.scale.set(this.defaultScale.x * ZOOM);
			}
		} else {
			this.timer.pause();
			console.log("timer paused");
			if (this.inZoom) {
				this.zoomPosition = this.mainPhoto.position.clone();
			}
		}
	}

	public override onResize(newW: number, newH: number): void {
		this.background.scale.set(newW, newH);

		ScaleHelper.setScaleRelativeToScreen(this.mainPhoto, newW, newH, 1, 1, Math.min);
		this.defaultScale = this.mainPhoto.scale;
		this.mainPhoto.position.set(newW / 2, newH / 2);
	}
}
