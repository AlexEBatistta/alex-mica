import type { Graphics } from "pixi.js";
import { Rectangle } from "pixi.js";
import { Container } from "pixi.js";
import { PixiScene } from "../../engine/scenemanager/scenes/PixiScene";
import { GraphicsHelper } from "../../engine/utils/GraphicsHelper";
import { ScaleHelper } from "../../engine/utils/ScaleHelper";
import { Button } from "../../engine/ui/button/Button";
import { CheckBox } from "../../engine/ui/button/CheckBox";
import { TextInput, TextInputEvents } from "../../engine/textinput/TextInput";
import { setPivotToCenter } from "../../engine/utils/MathUtils";
import { Names } from "./parts/Names";
import { ScrollView } from "../../engine/ui/scrollview/ScrollView";
import { Location } from "./parts/Location";
import { Photos } from "./parts/Photos";

// https://alexebatistta.github.io/invitations
// const size: ISize = { width: 1080, height: 1920 * 4 };
export class MainScene extends PixiScene {
	// public static readonly BUNDLES = ["package-1", "sfx", "music"];
	public static readonly BUNDLES = ["package-1"];
	private background: Graphics;
	private scrollView: ScrollView;
	private centerContainer: Container;
	private namesContainer: Names;

	private button: Button;
	private checkbox: CheckBox;
	private inputBox: TextInput;
	constructor() {
		super();

		if (Boolean(new URLSearchParams(window.location.search).get("main"))) {
			// ESTO ES PARA EL ADMIN
		}

		this.background = GraphicsHelper.pixel(0xffffff, 0.95);
		this.background.pivot.set(0.5);
		// this.addChild(this.background);

		this.centerContainer = new Container();
		// this.addChild(this.centerContainer);

		this.namesContainer = new Names(() => this.scrollView.scrollInnertia(0, -1920));
		this.centerContainer.addChild(this.namesContainer);

		const location: Location = new Location();
		location.y = this.namesContainer.height;
		this.centerContainer.addChild(location);

		const photos: Photos = new Photos();
		photos.y = location.y + location.height;
		this.centerContainer.addChild(photos);

		const btnContent: Container = new Container();
		const btnBack: Graphics = GraphicsHelper.pixel(0xff0000);
		btnBack.pivot.set(0.5);
		btnBack.scale.set(100, 50);
		btnContent.addChild(btnBack);

		this.button = new Button({
			defaultState: { content: btnContent, scale: 1 },
			highlightState: { scale: 1.1 },
			onClick: () => console.log("BOTON"),
			fixedCursor: "pointer",
		});
		this.button.x = -100;
		// this.centerContainer.addChild(this.button);

		this.checkbox = new CheckBox(false, (check: boolean) => console.log("CHECKED", check));
		this.checkbox.x = 100;
		// this.centerContainer.addChild(this.checkbox);

		this.inputBox = new TextInput(
			{
				inputStyle: {
					fontSize: `50px`,
					width: `500px`,
					height: `75px`,
					color: "0x000000",
					textAlign: "center",
					fontFamily: "Neothic",
				},
				boxStyle: {
					default: { alpha: 0.9, fill: 0xffffff, stroke: { color: 0x000000, width: 5 } },
					focused: { alpha: 0.8, fill: 0xffffff, stroke: { color: 0x000000, width: 5 } },
				},
				initialText: "",
				type: "text",
				inputMode: "text",
				blurOnReturn: true,
			},
			this.events
		);
		this.events.on(TextInputEvents.INPUT, (text: string) => console.log(text));
		setPivotToCenter(this.inputBox);
		this.inputBox.y = -200;
		// this.centerContainer.addChild(this.inputBox);

		this.centerContainer.pivot.set(-this.centerContainer.width * 0.5, 0);
		this.scrollView = new ScrollView(this.centerContainer.width, this.centerContainer.height, {
			addToContent: this.centerContainer,
			useInnertia: true,
			scrollLimits: new Rectangle(0, 0, this.centerContainer.width, this.centerContainer.height),
			useMouseWheel: true,
		});
		this.addChild(this.scrollView);
	}

	public override update(_dt: number): void {
		this.scrollView.updateDragging();
	}

	public override onResize(newW: number, newH: number): void {
		this.background.width = newW;
		this.background.height = newH;
		this.background.position.set(newW * 0.5, newH * 0.5);

		const contentScale: number = ScaleHelper.screenScale(1080, 1920, newW, newH, 1, 1, Math.min);
		this.scrollView.scale.set(contentScale);

		this.scrollView.scrollHeight = newH / contentScale;
		this.scrollView.constraintRectangle();

		this.scrollView.position.set((newW - 1080 * contentScale) / 2, 0);
	}
}
