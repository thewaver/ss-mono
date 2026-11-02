import { style } from "@vanilla-extract/css";

import { lookEntries, lookStates } from "../../Looks/Look.css";
import { themeVars } from "../../Theme.css";
import { FIELD_FONT_SIZE } from "../TextFieldContent/TextFieldContent.css";

export const isHovered = style([lookStates.isHovered]);
export const isDisabled = style([lookStates.isDisabled]);

export const textFieldAdornment = style([
    lookEntries.decoration,
    {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 26,
        fontSize: FIELD_FONT_SIZE,
        transition: `background-color ${themeVars.animation.duration}, color ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}`,

        selectors: {
            [`:is(button, [role='button']) &`]: {
                paddingInline: themeVars.spacing.full,
                fontSize: themeVars.fontSize.xSmall,
                textTransform: "uppercase",
            },
        },
    },
]);
