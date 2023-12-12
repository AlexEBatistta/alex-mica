import i18next from "i18next";
import { Container, Graphics, Rectangle, Text } from "pixi.js";
import { Manager } from "../..";
import { TextInput } from "../../engine/textinput/TextInput";
import { ScrollView } from "../../engine/ui/scrollview/ScrollView";
import { ColorDictionary, CSSStyle, TextStyleDictionary } from "../../engine/utils/Constants";
import { setPivotToCenter } from "../../engine/utils/MathUtils";
import { BasePopup } from "./BasePopup";
import * as archi from "../../../assets/lang/en.i18.json";

const space: number = 50;
export class SongsListPopup extends BasePopup {
	private subtitle: Text;
	private text: Text;
	private scrollView: ScrollView;
	private input: TextInput;
	private contentView: Container;
	private boxView: Graphics;
	constructor() {
		super(i18next.t("PPSongsList.title"));

		this.subtitle = new Text(i18next.t("PPSongsList.subtitle"), TextStyleDictionary.textBlackBig);
		setPivotToCenter(this.subtitle);
		this.centerContainer.addChild(this.subtitle);

		this.contentView = new Container();
		this.boxView = new Graphics().lineStyle(5, ColorDictionary.black).drawRect(-775 / 2, 0, 775, 464);
		this.centerContainer.addChild(this.boxView);
		// this.contentView.addChild(this.boxView);

		const list = archi.PPSongsList.music;
		for (let i = 0; i < list.length; i++) {
			const song: Text = new Text(list[i], TextStyleDictionary.textBlack);
			// setPivotToCenter(song);
			song.y = 75 * i;
			this.contentView.addChild(song);
		}
		this.scrollView = new ScrollView(this.boxView.width - space, this.boxView.height - space, {
			addToContent: this.contentView,
			useInnertia: true,
			scrollLimits: new Rectangle(0, 0, this.contentView.width + space, this.contentView.height + space / 2),
			useMouseWheel: false,
			events: this.events,
		});
		// setPivotToCenter(this.scrollView);
		this.centerContainer.addChild(this.scrollView);

		this.input = new TextInput(
			{
				inputStyle: CSSStyle,
				boxStyle: {
					default: { alpha: 0.9, fill: 0xffffff, stroke: { color: 0x000000, width: 5 } },
				},
				initialText: i18next.t("PPSongsList.input"),
				type: "text",
				inputMode: "text",
				blurOnReturn: true,
			},
			this.events
		);
		setPivotToCenter(this.input);
		this.centerContainer.addChild(this.input);

		this.text = new Text(i18next.t("PPSongsList.text"), TextStyleDictionary.textBlack);
		setPivotToCenter(this.text);
		this.centerContainer.addChild(this.text);

		this.onChangeOrientation();
	}

	public override onChangeOrientation(): void {
		if (Manager.isPortrait) {
			this.subtitle.y = 580;
			this.boxView.y = 958 - this.boxView.height / 2;
			this.scrollView.y = this.boxView.y + space / 2;
			this.scrollView.x = -this.boxView.width / 2 + space;
			this.input.y = 1277;
			this.text.y = 1471;
		} else {
			this.subtitle.y = 356;
			this.scrollView.y = 557;
			this.boxView.y = 557;
			this.input.y = 762;
			this.text.y = 863;
		}
	}
}
