import { Point, utils } from "pixi.js";
import type { Container, ISize } from "pixi.js";
import { Graphics, Sprite, Texture } from "pixi.js";
import { BaseParts } from "./BaseParts";
import { SDFBitmapText } from "../../../engine/sdftext/SDFBitmapText";
import i18next from "i18next";
import { ColorDictionary, SDFTextStyleDictionary } from "../../../engine/utils/Constants";
import { setPivotToCenter } from "../../../engine/utils/MathUtils";
import { Grid } from "../../../engine/ui/grid/Grid";
import { Easing, Tween } from "tweedle.js";
import { Manager } from "../../..";
import { ScaleHelper } from "../../../engine/utils/ScaleHelper";
import { PhotoViewer } from "../PhotoViewer";

const spacing: number = 10;
export class Photos extends BaseParts {
	private photos: Array<Sprite>;
	private grid: Grid;
	private defaultScale: number;
	private maxScale: number;
	private tweens: Array<{ in: Tween<Container>; out: Tween<Container> }>;
	private auxPos: Point;
	private photoSize: ISize;
	private columns: number;
	private content: Container;
	constructor() {
		super(1, ColorDictionary.white);

		this.title = new SDFBitmapText(i18next.t("Photos.title"), SDFTextStyleDictionary.titleBlack);
		setPivotToCenter(this.title);
		this.title.y = 25;
		this.addChild(this.title);

		this.createGrid();

		this.background.height = this.grid.y + this.grid.height - (this.photoSize.height * this.defaultScale) / 2 + spacing * 2;
	}

	public override onChangeOrientation(): void {
		this.removeChild(this.content);

		if ((this.columns == 2 && !Manager.isPortrait) || (this.columns == 3 && Manager.isPortrait)) {
			this.removeChild(this.grid);
			this.grid.destroy();

			this.createGrid();
		}

		this.background.height = this.grid.y + this.grid.height - (this.photoSize.height * this.defaultScale) / 2 + spacing * 2;
	}

	private createGrid(): void {
		this.photos = new Array();
		this.tweens = new Array();
		this.columns = Manager.isPortrait ? 2 : 3;

		this.photoSize = { width: Texture.from("cover_photo").width, height: 1035 };
		const offsetMask: number[] = [210, 15, 430, 320, 520, 390];
		this.defaultScale = (ScaleHelper.IDEAL_WIDTH / this.columns - spacing * 2) / this.photoSize.width;
		this.maxScale = (ScaleHelper.IDEAL_WIDTH / this.columns + spacing * 2.5) / this.photoSize.width;
		for (let i = 0; i < 6; i++) {
			const photo: Sprite = Sprite.from(`photo${i + 1}`);
			photo.scale.set(this.defaultScale);

			const maskPhoto = new Graphics();
			maskPhoto.beginFill(0xff0000);
			maskPhoto.drawRect(0, offsetMask[i], this.photoSize.width, this.photoSize.height);
			maskPhoto.endFill();
			photo.mask = maskPhoto;
			photo.addChild(maskPhoto);
			photo.pivot.y = offsetMask[i] + this.photoSize.height / 2;
			photo.pivot.x = this.photoSize.width / 2;
			this.photos.push(photo);

			this.tweens.push({ in: new Tween(photo), out: new Tween(photo) });

			photo.interactive = true;
			photo.cursor = "pointer";

			if (!utils.isMobile.any) {
				photo.on("pointerenter", this.zoomIn.bind(this, photo, this.tweens[i]));
				photo.on("pointerover", this.zoomIn.bind(this, photo, this.tweens[i]));
				photo.on("pointerleave", this.zoomOut.bind(this, photo, this.tweens[i]));
				photo.on("pointerout", this.zoomOut.bind(this, photo, this.tweens[i]));
				photo.on("pointercancel", this.zoomOut.bind(this, photo, this.tweens[i]));
			}
			photo.on("pointerup", (e: PointerEvent) => this.onPointerUp(e, photo, this.tweens[i], i));
			photo.on("pointerdown", this.onPointerDown.bind(this));
		}
		this.grid = new Grid({
			elements: this.photos,
			orientation: "columns",
			colOrRowNumber: this.columns,
			spacingX: spacing,
			spacingY: spacing,
			fixedHeight: this.photoSize.height * this.defaultScale,
		});
		this.grid.x = (this.photoSize.width * this.defaultScale) / 2;
		this.grid.x -= this.grid.width / 2;
		this.grid.y = 120 + spacing + (this.photoSize.height * this.defaultScale) / 2;
		this.addChild(this.grid);
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
}
