import { get, ref, update } from "firebase/database";
import i18next from "i18next";
import type { Graphics } from "pixi.js";
import { NineSlicePlane, Texture } from "pixi.js";
import { Container, Text } from "pixi.js";
import { FB_DATABASE, Manager } from "../..";
import { TextInput, TextInputEvents } from "../../engine/textinput/TextInput";
import { Button } from "../../engine/ui/button/Button";
import { ColorDictionary, CSSStyle, TextStyleDictionary } from "../../engine/utils/Constants";
import { GraphicsHelper } from "../../engine/utils/GraphicsHelper";
import { setPivotToCenter } from "../../engine/utils/MathUtils";
import { BasePopup } from "./BasePopup";

export class ConfirmationPopup extends BasePopup {
	private name1: Text;
	private name2: Text;
	private input1: TextInput;
	private boxInput1: NineSlicePlane;
	private input2: TextInput;
	private boxInput2: NineSlicePlane;
	private button: Button;
	private names: Array<string> = new Array(2);
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
			},
			this.events
		);
		this.input1.pivot.set(this.input1.width * 0.5, this.input1.height * 0.5);
		this.input1.cursor = "text";
		this.input1.events.on(TextInputEvents.ENTER_BLUR, this.onInputBlur.bind(this));
		this.input1.events.on(TextInputEvents.BLUR, this.onInputBlur.bind(this));
		this.input1.events.on(TextInputEvents.FOCUS, this.onInputFocus.bind(this));
		this.input1.name = "input1";
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
			},
			this.events
		);
		this.input2.pivot.set(this.input2.width * 0.5, this.input2.height * 0.5);
		this.input2.cursor = "text";
		this.input2.events.on(TextInputEvents.ENTER_BLUR, this.onInputBlur.bind(this));
		this.input2.events.on(TextInputEvents.BLUR, this.onInputBlur.bind(this));
		this.input2.events.on(TextInputEvents.FOCUS, this.onInputFocus.bind(this));
		this.input2.name = "input2";
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

		this.button = new Button({
			defaultState: { content: btnContent, scale: 1 },
			highlightState: { scale: 1.05, tween: true },
			onClick: this.onConfirmation.bind(this),
			fixedCursor: "pointer",
		});
		this.centerContainer.addChild(this.button);

		this.onChangeOrientation();
	}
	private onInputFocus(): void {}

	private onInputBlur(input: string, text: string): void {
		if (input == "input1") {
			this.names[0] = text;
		} else {
			this.names[1] = text;
		}
		console.log(input, this.names);
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
		} else {
			this.title.maxWidth = 2000;
			this.name1.scale.set(0.8);
			this.name2.scale.set(0.8);
			this.name1.position.set(-500, 390);
			this.name2.position.set(-500, 680);
			this.input1.position.set(-500, 478);
			this.input2.position.set(-500, 812);
			this.button.position.set(540, 605);
		}
	}

	private onConfirmation(): void {
		console.log(this.names);
		get(ref(FB_DATABASE, "invitados")).then((data: any) => {
			const inviList = Object.values<string>(data).filter((_value, index) => {
				return data.hasOwnProperty(`invitado ${index}`);
			});
			console.log(inviList);

			update(ref(FB_DATABASE, "invitados"), { [`invitado ${1}`]: `${this.names[0]} ${this.names[1]}` });
		});
	}
}
