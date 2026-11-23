import { style } from "@vanilla-extract/css";

import { skinEntries } from "../../../Skins/Skin.css";
import { themeVars } from "../../../Theme.css";

const panel = (from: string, to: string) => `linear-gradient(135deg, ${from}, ${to})`;

export const stage = style({
    display: "grid",
    placeItems: "center",
    width: "100%",
    height: "100%",
});

export const panelCard = style([
    skinEntries.panel,
    {
        display: "grid",
        placeItems: "center",
        width: 220,
        height: 150,
        padding: themeVars.spacing.full,
        borderRadius: themeVars.borderRadius.full,
        fontSize: themeVars.fontSize.small,
        textAlign: "center",
        userSelect: "none",
    },
]);

export const row = style({
    display: "flex",
    gap: themeVars.spacing.full,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
});

export const lampSlot = style({
    flex: "none",
    width: 64,
    height: 64,
});

export const lamp = style({
    display: "grid",
    placeItems: "center",
    width: "100%",
    height: "100%",
    borderRadius: themeVars.borderRadius.full,
    backgroundImage: panel(themeVars.color.primary.dark, themeVars.color.primary.light),
    color: themeVars.color.primary.contrast,
    fontSize: themeVars.fontSize.small,
    userSelect: "none",
});

export const placedStage = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.double,
    alignItems: "center",
    width: "100%",
});

export const placedRow = style({
    display: "flex",
    gap: themeVars.spacing.full,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
});

export const slider = style({
    display: "flex",
    width: "100%",
    maxWidth: 360,
});
