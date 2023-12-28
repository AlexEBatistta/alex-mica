import { get, ref, set, update } from "firebase/database";
import i18next from "i18next";
import type { Graphics } from "pixi.js";
import { NineSlicePlane, Texture } from "pixi.js";
import { Container, Text } from "pixi.js";
import { Easing, Tween } from "tweedle.js";
import { FB_DATABASE, Manager } from "../..";
import { TextInput, TextInputEvents } from "../../engine/textinput/TextInput";
import { Button } from "../../engine/ui/button/Button";
import { ColorDictionary, CSSStyleLeft, TextStyleDictionary } from "../../engine/utils/Constants";
import { GraphicsHelper } from "../../engine/utils/GraphicsHelper";
import { setPivotToCenter } from "../../engine/utils/MathUtils";
import { ScaleHelper } from "../../engine/utils/ScaleHelper";
import { BasePopup } from "./BasePopup";

export class MessagePopup extends BasePopup {
	private subtitle: Text;
	private sendText: Text;
	private button: Button;
	private boxInput: NineSlicePlane;
	private input: TextInput;
	constructor() {
		super(i18next.t("PPMessage.title"));

		this.subtitle = new Text(i18next.t("PPMessage.subtitle"), TextStyleDictionary.textBlackBig);
		setPivotToCenter(this.subtitle);
		this.centerContainer.addChild(this.subtitle);

		this.boxInput = new NineSlicePlane(Texture.from("package-1/frame.png"), 25, 25, 25, 25);
		this.centerContainer.addChild(this.boxInput);

		const cssStyle = Object.assign({ wordWrap: "775px", lineHeight: "125%" }, CSSStyleLeft);
		this.input = new TextInput(
			{
				boxStyle: undefined,
				inputStyle: cssStyle,
				type: "textarea",
				inputMode: "text",
				blurOnReturn: true,
			},
			this.events
		);
		setPivotToCenter(this.input);
		this.events.on(TextInputEvents.BLUR, this.onInputBlur.bind(this));
		this.events.on(TextInputEvents.FOCUS, this.onInputFocus.bind(this));
		this.addChild(this.input);

		const btnContent: Container = new Container();
		const btnBack: Graphics = GraphicsHelper.pixel(ColorDictionary.black);
		btnBack.pivot.x = 0.5;
		btnBack.scale.set(520, 90);
		btnContent.addChild(btnBack);
		const btnText: Text = new Text(i18next.t("PPMessage.button"), TextStyleDictionary.buttonWhite);
		setPivotToCenter(btnText);
		btnText.y = btnBack.height / 2;
		btnContent.addChild(btnText);

		this.sendText = new Text(i18next.t("PPMessage.send"), TextStyleDictionary.textBlack);
		this.sendText.scale.set(0.8);
		setPivotToCenter(this.sendText);
		this.centerContainer.addChild(this.sendText);

		this.button = new Button({
			defaultState: { content: btnContent, scale: 1 },
			highlightState: { scale: 1.05, tween: true },
			onClick: this.onSend.bind(this),
			fixedCursor: "pointer",
		});
		this.centerContainer.addChild(this.button);

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
		if (Manager.isPortrait) {
			this.title.maxWidth = ScaleHelper.IDEAL_WIDTH - 200;
			this.subtitle.scale.set(1);
			this.subtitle.y = 685;
			this.button.y = 1310;
			this.boxInput.width = 775;
			this.boxInput.height = 480;
			this.boxInput.pivot.set(775 / 2, 480 / 2);
			this.boxInput.y = 985;
		} else {
			this.title.maxWidth = ScaleHelper.IDEAL_WIDTH;
			this.subtitle.scale.set(0.8);
			this.subtitle.y = 375;
			this.button.y = 777;
			this.boxInput.width = 1400;
			this.boxInput.height = 300;
			this.boxInput.pivot.set(1400 / 2, 300 / 2);
			this.boxInput.y = 575;
		}
		this.sendText.y = this.button.y + this.button.height / 2;
		this.input.updateScale(this.boxInput, this.centerContainer.scale.x);
	}

	private onSend(): void {
		const tween = new Tween(this.sendText)
			.to({ y: "+100" }, 500)
			.easing(Easing.Exponential.Out)
			.onComplete(() => this.closePopup());

		get(ref(FB_DATABASE, "messageCount")).then((data) => {
			let index: number = 0;
			if (data.val() == undefined) {
				set(ref(FB_DATABASE, "messageCount"), index);
			} else {
				index = Number(data.val()) + 1;
				set(ref(FB_DATABASE, "messageCount"), index);
			}
			update(ref(FB_DATABASE, "messages"), { [`message ${index}`]: this.input.text });
		});

		tween.start();
		this.button.enabled = false;
	}

	private onInputFocus(): void {
		/* this.backgroundContainer.y = Manager.height / 2 - 100;
		this.centerContainer.y = Manager.height / 2 - 100;
		Manager.onKeyboard = utils.isMobile.any;
		if (Manager.onKeyboard) {
			this.waitKeyboard = true;
			setTimeout(() => (this.waitKeyboard = false), 500);
		}

		if (this.input.text === i18next.t("PPSongsList.input")) {
			this.input.text = "";
		} */
	}

	private onInputBlur(_forced: boolean): void {
		/* if (forced) {
			this.input.blur(true);
		}
		Manager.onKeyboard = false;
		this.waitKeyboard = false;
		this.onChangeOrientation();

		if (this.input.text === "") {
			this.input.text = i18next.t("PPSongsList.input");
		} */
	}

	public override onResize(newW: number, newH: number): void {
		super.onResize(newW, newH);
		this.input.updateScale(this.boxInput, this.centerContainer.scale.x, this.boxInput.width);
	}
}
