import { style, styleVariants } from "@vanilla-extract/css";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
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
            color: layerVars.contrast,
            backgroundColor: [
                themeVars.color.background.dark,
                `hsl(from ${themeVars.color.background.dark} h s l / 50%)`,
            ],
        },
    ],
    sample: [
        propScopeBase,
        {
            color: layerVars.contrast,
            backgroundColor: [
                themeVars.color.background.dark,
                `hsl(from ${themeVars.color.background.dark} h s l / 50%)`,
            ],
        },
    ],
    local: [
        propScopeBase,
        {
            color: layerVars.contrast,
            backgroundColor: [themeVars.color.surface.dark, `hsl(from ${themeVars.color.surface.dark}  h s l / 50%)`],
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
