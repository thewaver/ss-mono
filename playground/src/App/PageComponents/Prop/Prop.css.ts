import { style } from "@vanilla-extract/css";

import { skinEntries } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";

export const propRow = style([
    skinEntries.panel,
    {
        display: "grid",
        gridTemplateColumns: "1fr auto",
        alignItems: "center",
        gap: themeVars.spacing.full,
        padding: themeVars.spacing.full,
        width: "100%",
    },
]);

export const propLabel = style({
    display: "flex",
    alignItems: "center",
    gap: themeVars.spacing.half,
    alignSelf: "center",
    minWidth: 0,
});

export const propHintControls = style({
    marginTop: themeVars.spacing.half,
    fontFamily: "monospace",
    fontSize: themeVars.fontSize.xSmall,
    overflowWrap: "break-word",
});

export const propHintDefault = style({
    marginTop: themeVars.spacing.half,
    fontFamily: "monospace",
    fontSize: themeVars.fontSize.xSmall,
});
