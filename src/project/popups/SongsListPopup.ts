import i18next from "i18next";
import type { Graphics } from "pixi.js";
import { utils } from "pixi.js";
import { Container, NineSlicePlane, Rectangle, Sprite, Text, Texture } from "pixi.js";
import { FB_DATABASE, Manager } from "../..";
import { TextInput, TextInputEvents } from "../../engine/textinput/TextInput";
import { ScrollView } from "../../engine/ui/scrollview/ScrollView";
import { ColorDictionary, CSSStyleLeft, TextStyleDictionary } from "../../engine/utils/Constants";
import { setPivotToCenter } from "../../engine/utils/MathUtils";
import { BasePopup } from "./BasePopup";
import { Button } from "../../engine/ui/button/Button";
import { GraphicsHelper } from "../../engine/utils/GraphicsHelper";
import { Tween } from "tweedle.js";
import { ref, update } from "firebase/database";
import { MainScene } from "../scenes/MainScene";

const space: number = 50;
export class SongsListPopup extends BasePopup {
	private subtitle: Text;
	private text: Text;
	private scrollView: ScrollView;
	private input: TextInput;
	private contentView: Container;
	private boxView: NineSlicePlane;
	private boxInput: NineSlicePlane;
	private btnArrow: Button;
	constructor(list: Array<string>) {
		super(i18next.t("PPSongsList.title"));

		const style = TextStyleDictionary.textBlackBig.clone();
		style.wordWrapWidth = 980;
		this.subtitle = new Text(i18next.t("PPSongsList.subtitle"), style);
		setPivotToCenter(this.subtitle);
		this.centerContainer.addChild(this.subtitle);

		this.contentView = new Container();
		this.boxView = new NineSlicePlane(Texture.from("package-1/frame.png"), 25, 25, 25, 25); // new Graphics().lineStyle(5, ColorDictionary.black).drawRect(-775 / 2, 0, 775, 464);
		this.boxView.width = 775;
		this.boxView.height = 464;
		this.boxView.pivot.x = 775 / 2;
		this.centerContainer.addChild(this.boxView);

		list?.forEach((title) => this.addSong(title, false));

		this.scrollView = new ScrollView(this.boxView.width - space, this.boxView.height - space, {
			addToContent: this.contentView,
			useInnertia: true,
			scrollLimits: new Rectangle(0, 0, this.contentView.width + space, this.contentView.height + space / 2),
			useMouseWheel: false,
			events: this.events,
		});
		this.centerContainer.addChild(this.scrollView);

		this.boxInput = new NineSlicePlane(Texture.from("package-1/frame.png"), 25, 25, 25, 25); // new Graphics().lineStyle(5, ColorDictionary.black).drawRect(-775 / 2, -90 / 2, 775, 90);
		this.boxInput.width = 775;
		this.boxInput.height = 90;
		this.boxInput.pivot.set(775 / 2, 90 / 2);
		this.centerContainer.addChild(this.boxInput);

		this.input = new TextInput(
			{
				inputStyle: CSSStyleLeft,
				boxStyle: undefined,
				type: "text",
				inputMode: "text",
				blurOnReturn: true,
			},
			this.events
		);
		setPivotToCenter(this.input);
		this.input.text = i18next.t("PPSongsList.input");
		this.input.inputVisibility(false);
		this.events.on(TextInputEvents.BLUR, this.onInputBlur.bind(this));
		this.events.on(TextInputEvents.FOCUS, this.onInputFocus.bind(this));
		this.centerContainer.addChild(this.input);

		const btnContainer: Container = new Container();
		const btnBack: Graphics = GraphicsHelper.pixel(ColorDictionary.black);
		setPivotToCenter(btnBack);
		btnBack.scale.set(76, 60);
		btnContainer.addChild(btnBack);
		const btnSprite: Sprite = Sprite.from("package-1/arrow.png");
		setPivotToCenter(btnSprite);
		btnSprite.scale.set(53 / btnSprite.texture.width);
		btnSprite.angle = 180;
		btnContainer.addChild(btnSprite);

		this.btnArrow = new Button({
			defaultState: { content: btnContainer },
			onClick: this.onBtnArrow.bind(this),
			highlightState: { scale: 1.05, tween: true },
			fixedCursor: "pointer",
		});
		this.boxInput.addChild(this.btnArrow);

		this.text = new Text(i18next.t("PPSongsList.text"), TextStyleDictionary.textBlack);
		setPivotToCenter(this.text);
		this.centerContainer.addChild(this.text);

		this.onChangeOrientation();

		this.interactive = true;
		this.on("pointertap", this.onInputBlur.bind(this, true));
	}

	public override onShow(): void {
		const scaleContainer = this.backgroundContainer.scale.x;
		this.backgroundContainer.scale.x = 0;
		new Tween(this.overlay)
			.to({ alpha: 0.8 }, 250)
			.onComplete(() => {
				new Tween(this.backgroundContainer.scale)
					.to({ x: scaleContainer }, 250)
					.onComplete(() => {
						this.centerContainer.visible = true;
						this.scrollView.scrollToBottom(1000);
						this.input.inputVisibility(true);
					})
					.start();
			})
			.start();
	}

	protected override closePopup(): void {
		this.centerContainer.visible = false;
		this.input.inputVisibility(false);
		new Tween(this.backgroundContainer.scale)
			.to({ x: 0 }, 250)
			.onComplete(() => {
				new Tween(this.overlay).to({ alpha: 0 }, 250).onComplete(this.closeHandler.bind(this)).start();
			})
			.start();
	}

	public override onChangeOrientation(): void {
		this.input.blur(true);
		this.centerContainer.y = Manager.height / 2;
		this.backgroundContainer.y = Manager.height / 2;

		if (Manager.isPortrait) {
			this.subtitle.style.wordWrap = true;
			this.subtitle.scale.set(1);
			this.subtitle.y = 580;

			this.text.style.wordWrap = true;
			this.text.scale.set(1);
			this.text.y = 1471;

			this.boxInput.width = 775;
			this.boxInput.height = 90;
			this.boxInput.pivot.set(775 / 2, 90 / 2);
			this.boxInput.y = 1277;

			this.boxView.width = 775;
			this.boxView.height = 464;
			this.boxView.pivot.x = 775 / 2;
			this.boxView.y = 958 - this.boxView.height / 2;
			this.scrollView.position.set(-this.boxView.width / 2 + space, this.boxView.y + space / 2);
		} else {
			this.subtitle.scale.set(0.8);
			this.subtitle.style.wordWrap = false;
			this.subtitle.y = 356;

			this.text.scale.set(0.9);
			this.text.scale.y = this.text.scale.x;
			this.text.y = 863;

			this.boxInput.width = 1400;
			this.boxInput.height = 90;
			this.boxInput.pivot.set(1400 / 2, 90 / 2);
			this.boxInput.y = 752;

			this.boxView.width = 1400;
			this.boxView.height = 240;
			this.boxView.pivot.x = 1400 / 2;
			this.boxView.y = 557 - this.boxView.height / 2;

			this.scrollView.position.set(-this.boxView.width / 2 + space, this.boxView.y + space / 2);
		}
		setPivotToCenter(this.subtitle);
		setPivotToCenter(this.text);
		this.scrollView.scrollWidth = this.boxView.width - space * 2;
		this.scrollView.scrollHeight = this.boxView.height - space;
		this.btnArrow.position.set(this.boxInput.width - this.btnArrow.width / 2 - (this.boxInput.height - this.btnArrow.height) / 2, this.boxInput.height / 2);

		this.input.updateScale(this.boxInput, this.centerContainer.scale.x, this.boxInput.width - this.btnArrow.width * 2);
	}

	public override onChangeKeyboard(): void {
		if (!this.waitKeyboard) {
			this.onInputBlur(true);
		}
	}

	private onInputFocus(): void {
		this.backgroundContainer.y = Manager.height / 2 - 100;
		this.centerContainer.y = Manager.height / 2 - 100;
		Manager.onKeyboard = utils.isMobile.any;
		if (Manager.onKeyboard) {
			this.waitKeyboard = true;
			setTimeout(() => (this.waitKeyboard = false), 500);
		}

		if (this.input.text === i18next.t("PPSongsList.input")) {
			this.input.text = "";
		}
	}

	private onInputBlur(forced: boolean): void {
		if (forced) {
			this.input.blur(true);
		}
		Manager.onKeyboard = false;
		this.waitKeyboard = false;
		this.onChangeOrientation();

		if (this.input.text === "") {
			this.input.text = i18next.t("PPSongsList.input");
		}
	}

	private onBtnArrow(): void {
		if (this.input.text === i18next.t("PPSongsList.input") || this.input.text.length < 2) {
			return;
		}
		this.addSong(this.input.text, true);
		this.input.text = i18next.t("PPSongsList.input");
	}

	private addSong(title: string, updateList: boolean): void {
		const song: Text = new Text(title, TextStyleDictionary.textBlack);
		const index = this.contentView.children.length;
		song.y = 75 * index;
		this.contentView.addChild(song);
		if (this.scrollView != undefined) {
			this.scrollView.updateScrollLimits(this.contentView.width + space, this.contentView.height + space / 2);
			this.scrollView.scrollToBottom();
		}
		if (updateList) {
			MainScene.songList.push(title);
			update(ref(FB_DATABASE, "songList"), { [`song ${index}`]: title });
		}
	}

	public override onResize(newW: number, newH: number): void {
		super.onResize(newW, newH);
		this.input.updateScale(this.boxInput, this.centerContainer.scale.x);
	}
}
