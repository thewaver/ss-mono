import { style, styleVariants } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const propScopeBase = style({
    display: "grid",
    gridTemplateColumns: "1fr auto",
    alignItems: "center",
    gap: themeVars.spacing.full,
    borderRadius: themeVars.borderRadius.half,
    padding: themeVars.spacing.full,
    width: "100%",
    boxShadow: themeVars.shadow.small,
});

export const propScopeVariants = styleVariants({
    global: [
        propScopeBase,
        {
            color: themeVars.color.background.contrast,
            backgroundColor: [
                themeVars.color.background.dark,
                `rgb(from ${themeVars.color.background.dark} r g b / 75%)`,
            ],
        },
    ],
    sample: [
        propScopeBase,
        {
            color: themeVars.color.background.contrast,
            backgroundColor: [
                themeVars.color.background.light,
                `rgb(from ${themeVars.color.background.light} r g b / 75%)`,
            ],
        },
    ],
    local: [
        propScopeBase,
        {
            color: themeVars.color.surface.contrast,
            backgroundColor: [themeVars.color.surface.dark, `rgb(from ${themeVars.color.surface.dark} r g b / 75%)`],
        },
    ],
    unknown: {},
});

export const propLabel = style({
    display: "flex",
    alignItems: "center",
    gap: themeVars.spacing.half,
    alignSelf: "center",
    minWidth: 0,
});

export const propHintDefault = style({
    marginTop: themeVars.spacing.half,
    fontFamily: "monospace",
    fontSize: themeVars.fontSize.xSmall,
});
