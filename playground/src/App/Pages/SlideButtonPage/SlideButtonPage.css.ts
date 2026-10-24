import { createVar, globalStyle, style } from "@vanilla-extract/css";

import { slideButtonContent, slideButtonFill } from "../../StyledComponents/SlideButtonContent/SlideButtonContent.css";
import { themeVars } from "../../Theme.css";

export const turnVar = createVar();
export const liftVar = createVar();

export const isArmed = style({});
export const isFinale = style({});

export const lock = style({
    vars: { [turnVar]: "0", [liftVar]: "0" },
});

const turned = (color: string) => `hsl(from ${color} calc(h + ${turnVar}) s calc(l + (100 - l) * ${liftVar}))`;

globalStyle(`${lock} ${slideButtonFill}`, {
    backgroundImage: `linear-gradient(45deg, ${turned(themeVars.color.primary.dark)}, ${turned(themeVars.color.primary.light)})`,
});

globalStyle(`${lock} ${slideButtonContent}`, {
    transition: `box-shadow ${themeVars.animation.duration}`,
});

globalStyle(`${lock}.${isArmed} ${slideButtonContent}`, {
    boxShadow: `0 0 ${themeVars.spacing.double} ${turned(themeVars.color.primary.main)}`,
});

globalStyle(`${lock}.${isFinale} ${slideButtonContent}`, {
    transition: "none",
});
