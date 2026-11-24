import { style } from "@vanilla-extract/css";

import { skinEntries } from "../../../Skins/Skin.css";
import { themeVars } from "../../../Theme.css";

const panel = (from: string, to: string) => `linear-gradient(135deg, ${from}, ${to})`;

export const stack = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
    alignItems: "stretch",
});

export const card = style({
    position: "relative",
    width: "100%",
    borderRadius: themeVars.borderRadius.full,
    overflow: "hidden",
});

export const buttonRow = style({
    display: "flex",
    flex: "none",
    justifyContent: "center",
});

export const prize = style([
    skinEntries.panel,
    {
        display: "grid",
        placeItems: "center",
        padding: themeVars.spacing.double,
        color: themeVars.color.primary.main,
        fontFamily: "monospace",
        fontSize: themeVars.fontSize.xLarge,
        letterSpacing: "0.1em",
    },
]);

export const foil = style({
    width: "100%",
    height: "100%",
    backgroundImage: `repeating-linear-gradient(115deg, ${themeVars.color.primary.dark} 0 6px, ${themeVars.color.primary.main} 6px 12px, ${themeVars.color.primary.light} 12px 18px, ${themeVars.color.primary.main} 18px 24px), ${panel(themeVars.color.primary.dark, themeVars.color.primary.light)}`,
    backgroundBlendMode: "soft-light",
});

export const pane = style([
    skinEntries.panel,
    {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: themeVars.spacing.half,
        padding: themeVars.spacing.double,
        fontSize: themeVars.fontSize.small,
    },
]);

export const paneTitle = style({
    color: themeVars.color.primary.main,
    fontSize: themeVars.fontSize.large,
});

export const frost = style({
    backgroundColor: "rgb(0 0 0 / 50%)",
    width: "100%",
    height: "100%",
    backdropFilter: "blur(8px) saturate(0.4)",
});

export const coin = style({
    width: "100%",
    height: "100%",
    borderRadius: themeVars.borderRadius.half,
    border: `2px dashed ${themeVars.color.primary.contrast}`,
    backgroundColor: `color-mix(in srgb, ${themeVars.color.primary.contrast} 15%, transparent)`,
});

export const coinRubbing = style({
    borderStyle: "solid",
    backgroundColor: `color-mix(in srgb, ${themeVars.color.primary.contrast} 35%, transparent)`,
});

export const windows = style({
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: themeVars.spacing.full,
    padding: themeVars.spacing.full,
    borderRadius: themeVars.borderRadius.full,
    backgroundImage: panel(themeVars.color.primary.dark, themeVars.color.primary.light),
});

export const windowPrize = style([
    skinEntries.panel,
    {
        display: "grid",
        placeItems: "center",
        padding: themeVars.spacing.double,
        color: themeVars.color.primary.main,
        fontFamily: "monospace",
        fontSize: themeVars.fontSize.xLarge,
    },
]);
