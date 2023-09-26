import type { Graphics } from "pixi.js";
import { Texture } from "pixi.js";
import { Sprite } from "pixi.js";
import { Rectangle } from "pixi.js";
import { Container } from "pixi.js";
import { PixiScene } from "../../engine/scenemanager/scenes/PixiScene";
import { ScaleHelper } from "../../engine/utils/ScaleHelper";
import { Button } from "../../engine/ui/button/Button";
import { CheckBox } from "../../engine/ui/button/CheckBox";
import { TextInput, TextInputEvents } from "../../engine/textinput/TextInput";
import { setPivotToCenter } from "../../engine/utils/MathUtils";
import { Names } from "./parts/Names";
import { ScrollView, ScrollViewEvents } from "../../engine/ui/scrollview/ScrollView";
import { Location } from "./parts/Location";
import { Photos } from "./parts/Photos";
import { Payment } from "./parts/Payment";
import { Confirmation } from "./parts/Confirmation";
import { DressCode } from "./parts/DressCode";
import { SongsList } from "./parts/SongsList";
import { FinalGreeting } from "./parts/FinalGreeting";
import type { BaseParts } from "./parts/BaseParts";
import { Manager } from "../..";
import { SoundLib } from "../../engine/sound/SoundLib";
import { DataManager } from "../../engine/datamanager/DataManager";
import { GraphicsHelper } from "../../engine/utils/GraphicsHelper";
import { ColorDictionary } from "../../engine/utils/Constants";
import { AdjustmentFilter } from "@pixi/filter-adjustment";
// import { getDatabase, ref, set, update, get } from "firebase/database";
// import { saveAs } from "file-saver";

// https://alexebatistta.github.io/invitations
export class MainScene extends PixiScene {
	public static readonly BUNDLES = ["package-1", "music"];
	private photoBackground: Container;
	private scrollView: ScrollView;
	private centerContainer: Container;
	private namesContainer: Names;
	private contentScale: number;
	private btnSound: Button;
	private arrowInput: Graphics;

	private checkbox: CheckBox;
	private inputBox: TextInput;

	constructor() {
		super();

		/* const database = getDatabase(firebaseApp);
		const dataRef = ref(database, "invitados/alexymica");

		// Define los datos que deseas guardar
		const datos = {
			asistencia: "si",
			texto: "",
		};

		// Usa el método set() para guardar los datos en la ubicación especificada
		set(dataRef, datos)
			.then(() => {
				console.log("Datos guardados correctamente.");
			})
			.catch((error) => {
				console.error("Error al guardar datos:", error);
			}); */

		if (Boolean(new URLSearchParams(window.location.search).get("main"))) {
			// ESTO ES PARA EL ADMIN
		}

		this.photoBackground = new Container();
		this.addChild(this.photoBackground);

		const photo: Sprite = Sprite.from("cover_photo");
		photo.anchor.set(0.5);
		photo.filters = [new AdjustmentFilter({ saturation: 0.4 })];
		this.photoBackground.addChild(photo);

		const overPhoto: Graphics = GraphicsHelper.pixel(ColorDictionary.black, 0.35);
		overPhoto.pivot.set(0.5);
		overPhoto.scale.set(photo.width, photo.height);
		this.photoBackground.addChild(overPhoto);

		this.centerContainer = new Container();
		// this.addChild(this.centerContainer);

		this.namesContainer = new Names();
		this.addChild(this.namesContainer);

		this.centerContainer.y = this.namesContainer.height;

		const location: Location = new Location();
		// location.y = namesContainer.height;
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
		this.events.on(TextInputEvents.ENTER_BLUR, () => {
			/* const dataRef = ref(database, "invitados/alex");

			// Define los datos que deseas guardar
			const datos = {
				asistencia: "si",
				texto: "",
			};

			// Usa el método set() para guardar los datos en la ubicación especificada
			set(dataRef, datos)
				.then(() => {
					console.log("Datos guardados correctamente.");
				})
				.catch((error) => {
					console.error("Error al guardar datos:", error);
				});

			const datos2 = {
				asistencia: "si",
				texto: this.inputBox.text,
			};

			update(dataRef, datos2)
				.then(() => {
					console.log("Datos guardados correctamente.");
				})
				.catch((error) => {
					console.error("Error al guardar datos:", error);
				});

			const dataRef2 = ref(database, "invitados");

			// Usa el método get() para obtener los datos
			get(dataRef2)
				.then((snapshot) => {
					if (snapshot.exists()) {
						// La ubicación existe y tiene datos
						const data = snapshot.val();
						console.log("Datos obtenidos:", data);
						const csvData = this.convertToCSV(data);
						console.log(csvData);
						const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
						saveAs(blob, "datos.csv");
					} else {
						// La ubicación no existe o no tiene datos
						console.log("La ubicación no contiene datos.");
					}
				})
				.catch((error) => {
					console.error("Error al obtener datos:", error);
				}); */
		});
		setPivotToCenter(this.inputBox);
		this.inputBox.y = 400;

		this.centerContainer.pivot.set(-this.centerContainer.width * 0.5, 0);
		this.scrollView = new ScrollView(this.centerContainer.width, this.centerContainer.height, {
			addToContent: this.centerContainer,
			useInnertia: true,
			scrollLimits: new Rectangle(0, 0, this.centerContainer.width, this.centerContainer.height),
			useMouseWheel: true,
			events: this.events,
		});
		this.scrollView.pivot.x = this.scrollView.width / 2;
		this.addChild(this.scrollView);

		SoundLib.playMusic("music");
		SoundLib.muteMusic = DataManager.getValue("sound") ?? true;
		const btnSprite: Sprite = Sprite.from(`package-1/${SoundLib.muteMusic ? "soundOff" : "soundOn"}.png`);
		this.btnSound = new Button({
			defaultState: { content: btnSprite },
			onClick: () => {
				SoundLib.muteMusic = !SoundLib.muteMusic;
				btnSprite.texture = Texture.from(`package-1/${SoundLib.muteMusic ? "soundOff" : "soundOn"}.png`);
				DataManager.setValue("sound", SoundLib.muteMusic);
				DataManager.save();
			},
			fixedCursor: "pointer",
		});
		// this.addChild(this.btnSound);

		/* const loading1 = Sprite.from("loading_1");
		loading1.anchor.set(0.5);
		loading1.scale.set(0.25);
		loading1.position.set(200, 200);
		new Tween(loading1).to({ angle: 360 }, 1500).easing(Easing.Quadratic.InOut).repeat(Infinity).start();
		this.addChild(loading1);

		const loading2 = Sprite.from("loading_2");
		loading2.anchor.set(0.5);
		loading2.scale.set(0.25);
		loading2.position.set(600, 200);
		new Timer()
			.to(1000 / 8)
			.repeat(Infinity)
			.onRepeat(() => (loading2.angle += 360 / 8))
			.start();
		this.addChild(loading2); */

		// this.centerContainer.addChild(this.inputBox);

		this.arrowInput = GraphicsHelper.pixel(0xffffff);
		this.arrowInput.pivot.set(0.5, 0);
		this.arrowInput.alpha = 0.001;
		this.arrowInput.interactive = true;
		this.arrowInput.cursor = "pointer";
		this.arrowInput.on("pointertap", () => this.scrollView.scrollInnertia(0, -this.centerContainer.y));
		this.events.on(ScrollViewEvents.SCROLL_END, (posY: number) => {
			this.arrowInput.interactive = Math.abs(posY) < 100;
		});
		this.addChild(this.arrowInput);
	}

	public override onShow(): void {
		this.namesContainer.onChangeOrientation();
	}

	/* private convertToCSV(data: any): string {
		const csvRows = [];

		// Obtén las claves (nombres de las personas) del objeto
		const keys = Object.keys(data);

		// Encabezados CSV (incluyendo metadatos de formato)
		const headers = ["nombre", "asistencia", "texto"];
		csvRows.push(headers.join(","));

		// Itera sobre las claves y convierte los valores en una fila CSV
		for (const key of keys) {
			const personData = data[key];
			const values = [key, personData.asistencia, personData.texto];
			csvRows.push(values.join(","));
		}

		return csvRows.join("\n");
	} */

	public override update(_dt: number): void {
		this.scrollView.updateDragging();
	}

	public override onChangeOrientation(): void {
		this.namesContainer.onChangeOrientation();
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
		this.photoBackground.position.set(newW / 2, Manager.isPortrait ? newH / 2 : newH / 2 + 200);

		this.contentScale = ScaleHelper.screenScale(ScaleHelper.IDEAL_WIDTH, ScaleHelper.IDEAL_HEIGHT, newW, newH, 1, 1, Math.max);

		this.namesContainer.scale.set(this.contentScale);

		this.centerContainer.y = newH / this.contentScale;
		this.scrollView.scale.set(this.contentScale);

		if (this.scrollView.width > newW) {
			this.contentScale = ScaleHelper.screenScale(ScaleHelper.IDEAL_WIDTH, ScaleHelper.IDEAL_HEIGHT, newW, newH, 1, 1, Math.min);

			this.namesContainer.scale.set(this.contentScale);

			this.centerContainer.y = newH / this.contentScale;
			this.scrollView.scale.set(this.contentScale);
		}

		this.namesContainer.position.set(newW / 2, 0);
		this.scrollView.position.set(newW / 2, 0);

		this.scrollView.updateScrollLimits(undefined, this.centerContainer.height + this.namesContainer.height / this.namesContainer.scale.y);
		this.scrollView.scrollHeight = newH / this.contentScale;
		this.scrollView.constraintRectangle();

		ScaleHelper.setScaleRelativeToIdeal(this.btnSound, newW, newH);
		this.btnSound.position.set(10);

		this.namesContainer.onChangeOrientation();

		const arrow = this.namesContainer.getArrowBounds();
		this.arrowInput.scale.set(arrow.width * 2 * this.namesContainer.scale.x, arrow.height * 3 * this.namesContainer.scale.y);
		this.arrowInput.position.set(newW / 2, newH - this.arrowInput.height * 1.75);
	}
}
