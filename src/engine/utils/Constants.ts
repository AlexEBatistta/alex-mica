import { TextStyle } from "pixi.js";
import type { ISDFTextStyle } from "../sdftext/SDFBitmapText";

/* eslint-disable @typescript-eslint/naming-convention */
export const ColorDictionary = {
	black: 0x222222,
	white: 0xffffff,
};
export const SDFTextStyleDictionary = {
	namesDate: { fontName: "monbaitiBig", fontSize: 205, tint: ColorDictionary.white, align: "center" } as ISDFTextStyle,
	namesTitle: { fontName: "monbaitiBig", fontSize: 134, tint: ColorDictionary.white, align: "center" } as ISDFTextStyle,
	titleWhite: { fontName: "monbaitiSmall", fontSize: 72, tint: ColorDictionary.white, align: "center" } as ISDFTextStyle,
	titleBlack: { fontName: "monbaitiSmall", fontSize: 72, tint: ColorDictionary.black, align: "center" } as ISDFTextStyle,
};
export const TextStyleDictionary = {
	namesSubtitle: new TextStyle({ fontSize: 66, fontFamily: "Poppins", fill: ColorDictionary.white }),
	buttonBlack: new TextStyle({ fontSize: 50, fontFamily: "Poppins", fill: ColorDictionary.black }),
	buttonWhite: new TextStyle({ fontSize: 50, fontFamily: "Poppins", fill: ColorDictionary.white }),
	textBlack: new TextStyle({ fontSize: 48, fontFamily: "Poppins", fill: ColorDictionary.black, align: "center" }),
	textWhite: new TextStyle({ fontSize: 48, fontFamily: "Poppins", fill: ColorDictionary.white, align: "center" }),
};
