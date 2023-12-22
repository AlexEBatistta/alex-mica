import { get, ref, update } from "firebase/database";
import i18next from "i18next";
import type { Graphics } from "pixi.js";
import { NineSlicePlane, Texture } from "pixi.js";
import { Container, Text } from "pixi.js";
import { Easing, Tween } from "tweedle.js";
import { FB_DATABASE, Manager } from "../..";
import { DataManager } from "../../engine/datamanager/DataManager";
import { TextInput, TextInputEvents } from "../../engine/textinput/TextInput";
import { Button } from "../../engine/ui/button/Button";
import { ColorDictionary, CSSStyle, TextStyleDictionary } from "../../engine/utils/Constants";
import { GraphicsHelper } from "../../engine/utils/GraphicsHelper";
import { setPivotToCenter } from "../../engine/utils/MathUtils";
import { MainScene } from "../scenes/MainScene";
import { BasePopup } from "./BasePopup";

export class ConfirmationPopup extends BasePopup {
	private name1: Text;
	private name2: Text;
	private input1: TextInput;
	private boxInput1: NineSlicePlane;
	private input2: TextInput;
	private boxInput2: NineSlicePlane;
	private button: Button;
	private sendText: Text;
	constructor() {
		super(i18next.t("PPConfirmation.title"));

		this.name1 = new Text(i18next.t("PPConfirmation.name1"), TextStyleDictionary.textBlackBig);
		setPivotToCenter(this.name1);
		this.centerContainer.addChild(this.name1);

		this.name2 = new Text(i18next.t("PPConfirmation.name2"), TextStyleDictionary.textBlackBig);
		setPivotToCenter(this.name2);
		this.centerContainer.addChild(this.name2);

		this.input1 = new TextInput(
			{
				boxStyle: undefined,
				inputStyle: CSSStyle,
				type: "text",
				inputMode: "text",
				blurOnReturn: true,
			},
			this.events
		);
		this.input1.pivot.set(this.input1.width * 0.5, this.input1.height * 0.5);
		this.input1.cursor = "text";
		this.input1.events.on(TextInputEvents.ENTER_BLUR, this.onInputBlur.bind(this));
		this.input1.events.on(TextInputEvents.BLUR, this.onInputBlur.bind(this));
		this.input1.name = "input1";
		this.input1.text = MainScene.guestNames[0] ?? "";
		this.input1.inputVisibility(false);
		this.centerContainer.addChild(this.input1);

		this.boxInput1 = new NineSlicePlane(Texture.from("package-1/frame.png"), 25, 25, 25, 25);
		this.boxInput1.width = 775;
		this.boxInput1.height = 90;
		this.boxInput1.pivot.set(775 / 2, 90 / 2);
		this.centerContainer.addChild(this.boxInput1);

		this.input2 = new TextInput(
			{
				boxStyle: undefined,
				inputStyle: CSSStyle,
				type: "text",
				inputMode: "text",
				blurOnReturn: true,
			},
			this.events
		);
		this.input2.pivot.set(this.input2.width * 0.5, this.input2.height * 0.5);
		this.input2.cursor = "text";
		this.input2.events.on(TextInputEvents.ENTER_BLUR, this.onInputBlur.bind(this));
		this.input2.events.on(TextInputEvents.BLUR, this.onInputBlur.bind(this));
		this.input2.name = "input2";
		this.input2.text = MainScene.guestNames[1] ?? "";
		this.input2.inputVisibility(false);
		this.centerContainer.addChild(this.input2);

		this.boxInput2 = new NineSlicePlane(Texture.from("package-1/frame.png"), 25, 25, 25, 25);
		this.boxInput2.width = 775;
		this.boxInput2.height = 90;
		this.boxInput2.pivot.set(775 / 2, 90 / 2);
		this.centerContainer.addChild(this.boxInput2);

		const btnContent: Container = new Container();
		const btnBack: Graphics = GraphicsHelper.pixel(ColorDictionary.black);
		btnBack.pivot.x = 0.5;
		btnBack.scale.set(520, 90);
		btnContent.addChild(btnBack);
		const btnText: Text = new Text(i18next.t("PPConfirmation.button"), TextStyleDictionary.buttonWhite);
		setPivotToCenter(btnText);
		btnText.y = btnBack.height / 2;
		btnContent.addChild(btnText);

		this.sendText = new Text(i18next.t("PPConfirmation.send"), TextStyleDictionary.textBlack);
		setPivotToCenter(this.sendText);
		this.centerContainer.addChild(this.sendText);

		this.button = new Button({
			defaultState: { content: btnContent, scale: 1 },
			highlightState: { scale: 1.05, tween: true },
			onClick: this.onConfirmation.bind(this),
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
						this.input1.inputVisibility(true);
						this.input2.inputVisibility(true);
					})
					.start();
			})
			.start();
	}

	protected override closePopup(): void {
		this.centerContainer.visible = false;
		this.input1.inputVisibility(false);
		this.input2.inputVisibility(false);
		new Tween(this.backgroundContainer.scale)
			.to({ x: 0 }, 250)
			.onComplete(() => {
				new Tween(this.overlay).to({ alpha: 0 }, 250).onComplete(this.closeHandler.bind(this)).start();
			})
			.start();
	}

	private onInputBlur(input: string, text: string): void {
		if (input == "input1") {
			MainScene.guestNames[0] = text;
		} else {
			MainScene.guestNames[1] = text;
		}
	}

	public override onChangeOrientation(): void {
		if (Manager.isPortrait) {
			this.title.maxWidth = 1000;
			this.name1.scale.set(1);
			this.name2.scale.set(1);
			this.name1.position.set(0, 688);
			this.name2.position.set(0, 1028);
			this.input1.position.set(0, 792);
			this.boxInput1.position.set(0, 792);
			this.input2.position.set(0, 1183);
			this.boxInput2.position.set(0, 1183);
			this.button.position.set(0, 1354);
			this.sendText.position.set(0, this.button.y + this.button.height / 2);
		} else {
			this.title.maxWidth = 2000;
			this.name1.scale.set(0.8);
			this.name2.scale.set(0.8);
			this.name1.position.set(-500, 390);
			this.name2.position.set(-500, 680);
			this.input1.position.set(-500, 478);
			this.input2.position.set(-500, 812);
			this.button.position.set(540, 605);
			this.boxInput1.position.set(-500, 478);
			this.boxInput2.position.set(-500, 812);
			this.sendText.position.set(this.button.x, this.button.y + this.button.height / 2);
		}
	}

	private onConfirmation(): void {
		const tween = new Tween(this.sendText)
			.to({ y: "+100" }, 500)
			.easing(Easing.Exponential.Out)
			.onComplete(() => this.closePopup());

		if (MainScene.guestNames[0] != undefined && MainScene.guestNames[0] != "") {
			DataManager.setValue("guest 0", MainScene.guestNames[0]);
		}
		if (MainScene.guestNames[1] != undefined && MainScene.guestNames[1] != "") {
			DataManager.setValue("guest 1", MainScene.guestNames[1]);
		}
		DataManager.save();

		get(ref(FB_DATABASE, "guests")).then((snapshot) => {
			const data = snapshot.val();

			if (data == undefined) {
				let index = 0;
				if (MainScene.guestNames[0] != undefined) {
					update(ref(FB_DATABASE, "guests"), { [`guest ${index}`]: `${MainScene.guestNames[0]}` });
					index += 1;
				}
				if (MainScene.guestNames[1] != undefined) {
					update(ref(FB_DATABASE, "guests"), { [`guest ${index}`]: `${MainScene.guestNames[1]}` });
				}

				tween.start();
				this.button.enabled = false;
				return;
			}

			const inviList = Object.values<string>(data).filter((_value, index) => {
				return data.hasOwnProperty(`guest ${index}`);
			});

			let index: number = inviList.length;
			if (
				!inviList.find((value: string) => {
					return value == MainScene.guestNames[0];
				}) &&
				MainScene.guestNames[0] != undefined &&
				MainScene.guestNames[0] != ""
			) {
				update(ref(FB_DATABASE, "guests"), { [`guest ${index}`]: `${MainScene.guestNames[0]}` });
				index += 1;
			}
			if (
				!inviList.find((value: string) => {
					return value == MainScene.guestNames[1];
				}) &&
				MainScene.guestNames[1] != undefined &&
				MainScene.guestNames[1] != ""
			) {
				update(ref(FB_DATABASE, "guests"), { [`guest ${index}`]: `${MainScene.guestNames[1]}` });
			}
		});

		tween.start();
		this.button.enabled = false;
	}

	public override onResize(newW: number, newH: number): void {
		super.onResize(newW, newH);
		this.input1.updateScale(this.boxInput1, this.centerContainer.scale.x);
		this.input2.updateScale(this.boxInput2, this.centerContainer.scale.y);
	}
}
