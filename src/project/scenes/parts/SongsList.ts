import { get, ref } from "firebase/database";
import i18next from "i18next";
import type { Graphics } from "pixi.js";
import { Container, Text } from "pixi.js";
import { FB_DATABASE, Manager } from "../../..";
import { SDFBitmapText } from "../../../engine/sdftext/SDFBitmapText";
import { Button } from "../../../engine/ui/button/Button";
import { ColorDictionary, Offsets, SDFTextStyleDictionary, TextStyleDictionary } from "../../../engine/utils/Constants";
import { GraphicsHelper } from "../../../engine/utils/GraphicsHelper";
import { setPivotToCenter } from "../../../engine/utils/MathUtils";
import { SongsListPopup } from "../../popups/SongsListPopup";
import { BaseParts } from "./BaseParts";

export class SongsList extends BaseParts {
	constructor() {
		super(1, ColorDictionary.black, 721);

		this.title = new SDFBitmapText(i18next.t("SongsList.title"), SDFTextStyleDictionary.titleWhite);
		this.title.anchor.x = 0.5;
		this.addChild(this.title);

		this.text = new Text(i18next.t("SongsList.text"), TextStyleDictionary.textWhite);
		this.text.anchor.x = 0.5;
		this.addChild(this.text);

		const btnContent: Container = new Container();
		const btnBack: Graphics = GraphicsHelper.pixel(ColorDictionary.white);
		btnBack.pivot.x = 0.5;
		btnBack.scale.set(520, 90);
		btnContent.addChild(btnBack);
		const btnText: Text = new Text(i18next.t("SongsList.button"), TextStyleDictionary.buttonBlack);
		setPivotToCenter(btnText);
		btnText.y = btnBack.height / 2;
		btnContent.addChild(btnText);

		this.button = new Button({
			defaultState: { content: btnContent, scale: 1 },
			highlightState: { scale: 1.05, tween: true },
			onClick: () => {
				this.button.enabled = false;
				let songList: Array<string> = new Array();
				get(ref(FB_DATABASE, "songList"))
					.then((snapshot) => {
						if (snapshot.exists()) {
							const data = snapshot.val();
							console.log("Datos obtenidos:", data);
							songList = Object.values<string>(data).filter((_value, index) => {
								return data.hasOwnProperty(`song ${index}`);
							});
							Manager.openPopup(SongsListPopup, [songList]);
							this.button.enabled = true;
						} else {
							console.log("La ubicación no contiene datos.");
						}
					})
					.catch((error) => {
						console.error("Error al obtener datos:", error);
					});
			},
			fixedCursor: "pointer",
		});
		this.addChild(this.button);

		this.onChangeOrientation();
	}

	public override onChangeOrientation(): void {
		super.onChangeOrientation();

		this.title.y = Offsets.top;
		this.text.y = this.title.y + this.title.height + Offsets.text;
		this.button.y = this.text.y + this.text.height + Offsets.button;
		this.background.height = this.button.y + this.button.height + Offsets.bottom;
	}
}
