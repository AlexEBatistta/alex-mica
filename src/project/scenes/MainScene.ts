import type { Graphics } from "pixi.js";
import { Sprite } from "pixi.js";
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
import { Payment } from "./parts/Payment";
import { Confirmation } from "./parts/Confirmation";
import { DressCode } from "./parts/DressCode";
import { SongsList } from "./parts/SongsList";
import { FinalGreeting } from "./parts/FinalGreeting";
import type { BaseParts } from "./parts/BaseParts";
import { Manager } from "../..";

// https://alexebatistta.github.io/invitations
export class MainScene extends PixiScene {
	public static readonly BUNDLES = ["package-1"];
	private photoBackground: Sprite;
	private scrollView: ScrollView;
	private centerContainer: Container;
	private contentScale: number;

	private button: Button;
	private checkbox: CheckBox;
	private inputBox: TextInput;
	constructor() {
		super();

		if (Boolean(new URLSearchParams(window.location.search).get("main"))) {
			// ESTO ES PARA EL ADMIN
		}

		this.photoBackground = Sprite.from("cover_photo");
		this.photoBackground.anchor.set(0.5);
		this.addChild(this.photoBackground);

		this.centerContainer = new Container();
		// this.addChild(this.centerContainer);

		const namesContainer: Names = new Names(() => this.scrollView.scrollInnertia(0, -1920));
		this.centerContainer.addChild(namesContainer);

		const location: Location = new Location();
		location.y = namesContainer.height;
		this.centerContainer.addChild(location);

		const photos: Photos = new Photos();
		photos.y = location.y + location.height;
		this.centerContainer.addChild(photos);

		const payment: Payment = new Payment();
		payment.y = photos.y + photos.height;
		this.centerContainer.addChild(payment);

		const confirmation: Confirmation = new Confirmation();
		confirmation.y = payment.y + payment.height;
		this.centerContainer.addChild(confirmation);

		const dressCode: DressCode = new DressCode();
		dressCode.y = confirmation.y + confirmation.height;
		this.centerContainer.addChild(dressCode);

		const songsList: SongsList = new SongsList();
		songsList.y = dressCode.y + dressCode.height;
		this.centerContainer.addChild(songsList);

		const finalGreeting: FinalGreeting = new FinalGreeting();
		finalGreeting.y = songsList.y + songsList.height;
		this.centerContainer.addChild(finalGreeting);

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
		this.scrollView.pivot.x = this.scrollView.width / 2;
		this.addChild(this.scrollView);
	}

	public override update(_dt: number): void {
		this.scrollView.updateDragging();
	}

	public override onChangeOrientation(): void {
		const contentParts: BaseParts[] = this.scrollView.content.children[0].children as BaseParts[];
		for (let i = 0; i < contentParts.length; i++) {
			const part = contentParts[i];
			part.onChangeOrientation();

			if (i > 0) {
				part.y = contentParts[i - 1].y + contentParts[i - 1].height;
			}
		}

		this.scrollView.updateScrollLimits(undefined, this.centerContainer.height);
		this.scrollView.scrollHeight = Manager.height / (this.contentScale ?? 1);
		this.scrollView.constraintRectangle();
	}

	public override onResize(newW: number, newH: number): void {
		ScaleHelper.setScaleRelativeToScreen(this.photoBackground, newW, newH, 1, 1, Math.max);
		this.photoBackground.position.set(newW / 2, newH / 2);

		this.contentScale = ScaleHelper.screenScale(ScaleHelper.IDEAL_WIDTH, ScaleHelper.IDEAL_HEIGHT, newW, newH, 1, 1, Math.max);

		this.scrollView.scale.set(this.contentScale);

		if (this.scrollView.width > newW) {
			this.contentScale = ScaleHelper.screenScale(ScaleHelper.IDEAL_WIDTH, ScaleHelper.IDEAL_HEIGHT, newW, newH, 1, 1, Math.min);
			this.scrollView.scale.set(this.contentScale);
		}

		this.scrollView.position.set(newW / 2, 0);

		this.scrollView.updateScrollLimits(undefined, this.centerContainer.height);
		this.scrollView.scrollHeight = newH / this.contentScale;
		this.scrollView.constraintRectangle();
	}
}
