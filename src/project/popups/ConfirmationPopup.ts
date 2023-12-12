import i18next from "i18next";
import type { Graphics } from "pixi.js";
import { Container, Text } from "pixi.js";
import { Manager } from "../..";
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
	private input2: TextInput;
	private button: Button;
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
				boxStyle: { default: { stroke: { color: ColorDictionary.black, width: 2, alpha: 1 }, rounded: 0, fill: ColorDictionary.white, alpha: 1 } },
				inputStyle: CSSStyle,
				type: "text",
			},
			this.events
		);
		this.input1.pivot.set(this.input1.width * 0.5, this.input1.height * 0.5);
		this.input1.cursor = "text";
		this.events.on(TextInputEvents.INPUT, this.onInputInput.bind(this));
		this.events.on(TextInputEvents.ENTER_BLUR, this.onInputInput.bind(this));
		this.events.on(TextInputEvents.BLUR, this.onInputBlur.bind(this));
		this.events.on(TextInputEvents.FOCUS, this.onInputFocus.bind(this));
		this.centerContainer.addChild(this.input1);

		this.input2 = new TextInput(
			{
				boxStyle: { default: { stroke: { color: ColorDictionary.black, width: 2, alpha: 1 }, rounded: 0, fill: ColorDictionary.white, alpha: 1 } },
				inputStyle: CSSStyle,
				type: "text",
			},
			this.events
		);
		this.input2.pivot.set(this.input2.width * 0.5, this.input2.height * 0.5);
		this.input2.cursor = "text";
		this.centerContainer.addChild(this.input2);

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
			onClick: () => {
				console.log("CONFIRMATION");
			},
			fixedCursor: "pointer",
		});
		this.centerContainer.addChild(this.button);

		this.onChangeOrientation();
	}
	private onInputFocus(): void {}

	private onInputBlur(): void {}

	private onInputInput(text: string): void {
		console.log(text);
	}

	public override onChangeOrientation(): void {
		if (Manager.isPortrait) {
			this.title.maxWidth = 1000;
			this.name1.scale.set(1);
			this.name2.scale.set(1);
			this.name1.position.set(0, 688);
			this.name2.position.set(0, 1028);
			this.input1.position.set(0, 792);
			this.input2.position.set(0, 1183);
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
}
