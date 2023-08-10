import { TextStyle } from "pixi.js";
import type { ISDFTextStyle } from "../sdftext/SDFBitmapText";

/* eslint-disable @typescript-eslint/naming-convention */
export const ColorDictionary = {
	black: 0x222222,
	white: 0xffffff,
};
export const SDFTextStyleDictionary = {
	namesDate: { fontName: "monbaitiBig", fontSize: 205, tint: 0xffffff } as ISDFTextStyle,
	namesTitle: { fontName: "monbaitiBig", fontSize: 134, tint: 0xffffff } as ISDFTextStyle,
	titleWhite: { fontName: "monbaitiSmall", fontSize: 72, tint: 0xffffff } as ISDFTextStyle,
	titleBlack: { fontName: "monbaitiSmall", fontSize: 72, tint: ColorDictionary.black } as ISDFTextStyle,
};
export const TextStyleDictionary = {
	namesSubtitle: new TextStyle({ fontSize: 66, fontFamily: "Poppins", fill: 0xffffff }),
	buttons: new TextStyle({ fontSize: 50, fontFamily: "Poppins", fill: 0xffffff }),
	text: new TextStyle({ fontSize: 48, fontFamily: "Poppins", fill: ColorDictionary.black, wordWrap: true, wordWrapWidth: 936, align: "center" }),
};
