import { style } from "@vanilla-extract/css";

import { skinEntries } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";

export const DEFAULT_MIN_COLUMN_WIDTH = 320;

export const variantsRoot = style({
    display: "grid",
    alignItems: "stretch",
    gap: themeVars.spacing.double,
});

export const variantContainer = style([
    skinEntries.surface,
    {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: themeVars.spacing.full,
        minWidth: 0,
        padding: themeVars.spacing.double,
    },
]);

export const variantTitle = style({
    fontSize: themeVars.fontSize.xSmall,
    fontWeight: "bold",
    textTransform: "uppercase",
});

export const variantDemo = style({
    display: "flex",
    flex: 1,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    gap: themeVars.spacing.full,
    minWidth: 0,
});

export const variantReadout = style({
    fontFamily: "monospace",
    fontSize: themeVars.fontSize.xSmall,
    textAlign: "center",
    overflowWrap: "anywhere",
    opacity: 0.75,
});
