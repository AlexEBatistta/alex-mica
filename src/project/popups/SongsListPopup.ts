import i18next from "i18next";
import { BasePopup } from "./BasePopup";

export class SongsListPopup extends BasePopup {
	constructor() {
		super(i18next.t("PPSongsList.title"));
	}
}
