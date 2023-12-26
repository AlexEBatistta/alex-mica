import i18next from "i18next";
import type { Graphics } from "pixi.js";
import { Text } from "pixi.js";
import { Container } from "pixi.js";
import { ColorDictionary, TextStyleDictionary } from "../../../engine/utils/Constants";
import { GraphicsHelper } from "../../../engine/utils/GraphicsHelper";
import { setPivotToCenter } from "../../../engine/utils/MathUtils";
import { BaseParts } from "./BaseParts";

export class Countdown extends BaseParts {
	private targetDate: Date;
	private dateTexts: Array<Text>;
	constructor(targetDateString: string, targetTime: string) {
		super(1, ColorDictionary.black, 238);

		this.targetDate = this.parseDateTime(targetDateString, targetTime);

		// Verificar si la fecha es válida
		if (!this.targetDate) {
			console.error("Fecha objetivo no válida. Formato esperado: DD/MM/YYYY HH:mm");
			return;
		}

		this.dateTexts = new Array();
		const content: Container = new Container();
		const labels = [i18next.t("Countdown.days"), i18next.t("Countdown.hours"), i18next.t("Countdown.minutes"), i18next.t("Countdown.seconds")];
		for (let i = 0; i < labels.length; i++) {
			const background: Graphics = GraphicsHelper.pixel(ColorDictionary.white);
			setPivotToCenter(background);
			background.scale.set(100);
			background.position.set(174 * i, 100);
			content.addChild(background);

			this.dateTexts.push(new Text("00", TextStyleDictionary.monbaiti));
			setPivotToCenter(this.dateTexts[i]);
			this.dateTexts[i].position = background.position;
			content.addChild(this.dateTexts[i]);

			const text: Text = new Text(labels[i], TextStyleDictionary.textWhiteSmall);
			setPivotToCenter(text);
			text.x = background.x;
			text.y = 180;
			content.addChild(text);
		}
		setPivotToCenter(content);
		content.position.set(0, this.background.height / 2);
		this.addChild(content);

		this.updateCountdown();

		this.onChangeOrientation();
	}

	private parseDateTime(dateString: string, timeString: string): Date | null {
		const dateParts = dateString.split("/");
		const timeParts = timeString.split(":");

		if (dateParts.length === 3 && timeParts.length === 2) {
			const day = parseInt(dateParts[0], 10);
			const month = parseInt(dateParts[1], 10) - 1; // Los meses en JavaScript van de 0 a 11
			const year = parseInt(dateParts[2], 10);
			const hours = parseInt(timeParts[0], 10);
			const minutes = parseInt(timeParts[1], 10);

			return new Date(year, month, day, hours, minutes, 0, 0);
		}
		return null;
	}

	private updateCountdown(): void {
		setTimeout(this.updateCountdown.bind(this), 1000);
		const currentDate = new Date();
		const timeDifference = this.targetDate.getTime() - currentDate.getTime();

		if (timeDifference > 0) {
			let seconds = Math.floor(timeDifference / 1000);
			let minutes = Math.floor(seconds / 60);
			let hours = Math.floor(minutes / 60);
			const days = Math.floor(hours / 24);

			hours = hours % 24;
			minutes = minutes % 60;
			seconds = seconds % 60;

			if (parseInt(this.dateTexts[0].text) != days) {
				this.dateTexts[0].text = `${days}`;
			}
			if (parseInt(this.dateTexts[0].text) != hours) {
				this.dateTexts[1].text = `${hours < 10 ? "0" : ""}${hours}`;
			}
			if (parseInt(this.dateTexts[0].text) != minutes) {
				this.dateTexts[2].text = `${minutes < 10 ? "0" : ""}${minutes}`;
			}
			this.dateTexts[3].text = `${seconds < 10 ? "0" : ""}${seconds}`;
		} else {
			console.log("¡La fecha objetivo ha llegado!");
		}
	}

	public override onChangeOrientation(): void {
		super.onChangeOrientation();
	}
}
