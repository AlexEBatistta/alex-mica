import i18next from "i18next";
import { Container, Graphics, Rectangle, Sprite, Text } from "pixi.js";
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

const space: number = 50;
export class SongsListPopup extends BasePopup {
	private subtitle: Text;
	private text: Text;
	private scrollView: ScrollView;
	private input: TextInput;
	private contentView: Container;
	private boxView: Graphics;
	private boxInput: Graphics;
	private btnArrow: Button;
	constructor(list: Array<string>) {
		super(i18next.t("PPSongsList.title"));

		this.subtitle = new Text(i18next.t("PPSongsList.subtitle"), TextStyleDictionary.textBlackBig);
		setPivotToCenter(this.subtitle);
		this.centerContainer.addChild(this.subtitle);

		this.contentView = new Container();
		this.boxView = new Graphics().lineStyle(5, ColorDictionary.black).drawRect(-775 / 2, 0, 775, 464);
		this.centerContainer.addChild(this.boxView);

		/* get(ref(FB_DATABASE, "songList"))
			.then((snapshot) => {
				if (snapshot.exists()) {
					const data = snapshot.val();
					console.log("Datos obtenidos:", data);
					list = Object.values<string>(data).filter((_value, index) => {
						return data.hasOwnProperty(`song ${index}`);
					});
				} else {
					console.log("La ubicación no contiene datos.");
				}
			})
			.catch((error) => {
				console.error("Error al obtener datos:", error);
			}); */
		list.forEach((title) => this.addSong(title));

		this.scrollView = new ScrollView(this.boxView.width - space, this.boxView.height - space, {
			addToContent: this.contentView,
			useInnertia: true,
			scrollLimits: new Rectangle(0, 0, this.contentView.width + space, this.contentView.height + space / 2),
			useMouseWheel: false,
			events: this.events,
		});
		this.centerContainer.addChild(this.scrollView);

		this.boxInput = new Graphics().lineStyle(5, ColorDictionary.black).drawRect(-775 / 2, -90 / 2, 775, 90);
		this.centerContainer.addChild(this.boxInput);
		this.input = new TextInput(
			{
				inputStyle: CSSStyleLeft,
				boxStyle: {
					default: { alpha: 0.9, fill: 0xffffff },
				},
				type: "text",
				inputMode: "text",
				blurOnReturn: true,
			},
			this.events
		);
		setPivotToCenter(this.input);
		this.input.placeholder = i18next.t("PPSongsList.input");
		this.input.placeholderColor = ColorDictionary.black;
		this.events.on(TextInputEvents.INPUT, this.onInput.bind(this));
		this.events.on(TextInputEvents.ENTER_BLUR, this.onInput.bind(this));
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
					})
					.start();
			})
			.start();
	}

	public override onChangeOrientation(): void {
		if (Manager.isPortrait) {
			this.subtitle.y = 580;
			this.boxView.y = 958 - this.boxView.height / 2;
			this.scrollView.y = this.boxView.y + space / 2;
			this.scrollView.x = -this.boxView.width / 2 + space;
			this.input.position.set(-50, 1277);
			this.boxInput.y = this.input.y;
			this.btnArrow.x = 330;
			this.text.y = 1471;
		} else {
			this.subtitle.y = 356;
			this.scrollView.y = 557;
			this.boxView.y = 557;
			this.input.position.set(-50, 762);
			this.boxInput.y = this.input.y;
			this.text.y = 863;
			this.btnArrow.x = 330;
		}
	}

	private onInputFocus(): void {
		this.input.placeholder = "";
	}

	private onInputBlur(): void {
		this.input.placeholder = i18next.t("PPSongsList.input");
	}

	private onInput(text: string): void {
		console.log(text);
	}

	private onBtnArrow(): void {
		this.addSong(this.input.text);
		this.input.text = "";
		this.input.placeholder = i18next.t("PPSongsList.input");
	}

	private addSong(title: string): void {
		console.log(title);
		const song: Text = new Text(title, TextStyleDictionary.textBlack);
		const index = this.contentView.children.length;
		song.y = 75 * index;
		this.contentView.addChild(song);
		if (this.scrollView != undefined) {
			this.scrollView.updateScrollLimits(this.contentView.width + space, this.contentView.height + space / 2);
			this.scrollView.scrollToBottom();
		}
		update(ref(FB_DATABASE, "songList"), { [`song ${index}`]: title });
	}
}
