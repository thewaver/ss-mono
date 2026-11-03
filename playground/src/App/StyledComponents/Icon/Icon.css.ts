import { createVar, style } from "@vanilla-extract/css";

export const iconSource = createVar();

export const icon = style({
    display: "block",
    flexShrink: 0,
    width: "1em",
    height: "1em",
    backgroundColor: "currentColor",
    maskImage: iconSource,
    maskSize: "contain",
    maskRepeat: "no-repeat",
    maskPosition: "center",
});
