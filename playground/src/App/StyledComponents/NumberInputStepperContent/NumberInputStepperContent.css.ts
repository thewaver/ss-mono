import { style } from "@vanilla-extract/css";

import { skinEntries, skinStates } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";

export const isHovered = style([skinStates.isHovered]);
export const isDisabled = style([skinStates.isDisabled]);

export const numberInputStepper = style({
    display: "flex",
    flexDirection: "column",
    gap: 2,
});

export const numberInputStepperButton = style([
    skinEntries.decoration,
    {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 20,
        height: 14,
        fontSize: themeVars.fontSize.xSmall,
        transition: `background-color ${themeVars.animation.duration}, color ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}`,
    },
]);

export const numberInputStepperName = style({
    position: "absolute",
    width: 1,
    height: 1,
    margin: -1,
    padding: 0,
    border: 0,
    clipPath: "inset(50%)",
    overflow: "hidden",
    whiteSpace: "nowrap",
});
