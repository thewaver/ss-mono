import { keyframes, style } from "@vanilla-extract/css";

import { ProximityTextKnobs } from "../../Knobs/ProximityTexts.const";

import { themeVars } from "../../Theme.css";

export const variableText = style({
    alignSelf: "stretch",
    fontFamily: "system-ui, sans-serif",
    fontSize: themeVars.fontSize.xLarge,
});

export const stack = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
    alignItems: "flex-start",
});

export const barrelSpacing = keyframes({
    "0%": { paddingInline: "0.3em" },
    "100%": { paddingInline: 0 },
});

export const barrelBox = style({
    position: "relative",
    height: ProximityTextKnobs.BARREL_BOX_HEIGHT,
    overflowY: "scroll",
    overscrollBehavior: "contain",
});

export const barrelText = style({
    marginBlock: ProximityTextKnobs.BARREL_BOX_HEIGHT,
    fontFamily: "system-ui, sans-serif",
    fontSize: themeVars.fontSize.large,
    textAlign: "center",
});
