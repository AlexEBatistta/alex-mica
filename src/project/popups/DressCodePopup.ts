import i18next from "i18next";
import type { Container, ISize } from "pixi.js";
import { Point, Sprite, utils } from "pixi.js";
import { Easing, Tween } from "tweedle.js";
import { Manager } from "../..";
import { Grid } from "../../engine/ui/grid/Grid";
import { setPivotToCenter } from "../../engine/utils/MathUtils";
import { PhotoViewer } from "../scenes/PhotoViewer";
import { BasePopup } from "./BasePopup";

const spacing: number = 10;
export class DressCodePopup extends BasePopup {
	private photos: Array<Sprite>;
	private grid: Grid;
	private defaultScale: number;
	private maxScale: number;
	private tweensInOut: Array<{ in: Tween<Container>; out: Tween<Container> }>;
	private auxPos: Point;
	private columns: number;
	private photoSize: ISize;
	constructor() {
		super(i18next.t("PPDressCode.title"));

		this.createGrid();
	}

	private createGrid(): void {
		this.photos = new Array();
		this.tweensInOut = new Array();
		this.columns = Manager.isPortrait ? 3 : 6;

		this.photoSize = Manager.isPortrait ? { width: 325, height: 632 } : { width: 297, height: 580 };
		this.defaultScale = this.photoSize.width / 505;
		this.maxScale = this.defaultScale + 0.1;
		for (let i = 0; i < 6; i++) {
			const photo: Sprite = Sprite.from(`package-1/dressCode${i + 1}.png`);
			photo.pivot.set(photo.width / 2, photo.height / 2);
			photo.scale.set(this.defaultScale);
			this.photos.push(photo);

			this.tweensInOut.push({ in: new Tween(photo), out: new Tween(photo) });

			photo.interactive = true;
			photo.cursor = "pointer";

			if (!utils.isMobile.any) {
				photo.on("pointerenter", this.zoomIn.bind(this, photo, this.tweensInOut[i]));
				photo.on("pointerover", this.zoomIn.bind(this, photo, this.tweensInOut[i]));
				photo.on("pointerleave", this.zoomOut.bind(this, photo, this.tweensInOut[i]));
				photo.on("pointerout", this.zoomOut.bind(this, photo, this.tweensInOut[i]));
				photo.on("pointercancel", this.zoomOut.bind(this, photo, this.tweensInOut[i]));
			}
			photo.on("pointerup", (e: PointerEvent) => this.onPointerUp(e, photo, this.tweensInOut[i], i));
			photo.on("pointerdown", this.onPointerDown.bind(this));
		}
		this.grid = new Grid({
			elements: this.photos,
			orientation: "columns",
			colOrRowNumber: this.columns,
			spacingX: spacing,
			spacingY: spacing,
		});
		setPivotToCenter(this.grid);
		this.grid.y = this.background.height / 2 + this.backTop.y / 2;
		this.centerContainer.addChild(this.grid);

		setPivotToCenter(this.centerContainer);
		this.centerContainer.y = Manager.height / 2;
	}

	private zoomIn(photo: Sprite, tween: { in: Tween<Container>; out: Tween<Container> }): void {
		photo.zIndex = 1;
		this.grid.sortGrid();
		tween.out.stop();
		tween.in.stop();
		tween.in = new Tween(photo)
			.to({ scale: { x: this.maxScale, y: this.maxScale } }, 500)
			.easing(Easing.Back.Out)
			.start();
	}

	private zoomOut(photo: Sprite, tween: { in: Tween<Container>; out: Tween<Container> }): void {
		photo.zIndex = 0;
		this.grid.sortGrid();
		tween.in.stop();
		tween.out.stop();
		tween.out = new Tween(photo)
			.to({ scale: { x: this.defaultScale, y: this.defaultScale } }, 250)
			.easing(Easing.Cubic.Out)
			.start();
	}

	private onPointerDown(e: PointerEvent): void {
		this.auxPos = new Point(e.x, e.y);
	}

	private onPointerUp(e: PointerEvent, photo: Sprite, tween: { in: Tween<Container>; out: Tween<Container> }, index: number): void {
		if (this.auxPos?.y == e.y) {
			Manager.openPopup(PhotoViewer, [this.photos, index]);
		}
		if (!utils.isMobile) {
			this.zoomOut(photo, tween);
		}
	}

	public override onResize(newW: number, newH: number): void {
		super.onResize(newW, newH);

		if ((this.columns == 3 && !Manager.isPortrait) || (this.columns == 6 && Manager.isPortrait)) {
			this.centerContainer.removeChild(this.grid);
			this.grid.destroy();

			this.createGrid();
		}
	}
}
