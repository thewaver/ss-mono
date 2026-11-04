import { style } from "@vanilla-extract/css";

import { skinEntries, skinStates } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";
import { TEXT_FIELD_ADORNMENT_HEIGHT } from "../TextFieldAdornment/TextFieldAdornment.css";

export const isHovered = style([skinStates.isHovered]);
export const isDisabled = style([skinStates.isDisabled]);

export const textFieldButtonContent = style([
    skinEntries.decoration,
    {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: TEXT_FIELD_ADORNMENT_HEIGHT,
        paddingInline: themeVars.spacing.full,
        fontSize: themeVars.fontSize.xSmall,
        textTransform: "uppercase",
        transition: `background-color ${themeVars.animation.duration}, color ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}`,
    },
]);
