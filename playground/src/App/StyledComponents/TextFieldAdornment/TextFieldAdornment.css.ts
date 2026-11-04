import { style } from "@vanilla-extract/css";

import { skinEntries, skinStates } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";
import { FIELD_FONT_SIZE } from "../TextFieldContent/TextFieldContent.css";

export const TEXT_FIELD_ADORNMENT_HEIGHT = 26;

export const isDisabled = style([skinStates.isDisabled]);

export const textFieldAdornment = style([
    skinEntries.decoration,
    {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: TEXT_FIELD_ADORNMENT_HEIGHT,
        fontSize: FIELD_FONT_SIZE,
        transition: `color ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}`,
    },
]);
