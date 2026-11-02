import { style } from "@vanilla-extract/css";

import { lookEntries } from "../../Looks/Look.css";
import { themeVars } from "../../Theme.css";

const PILL_HEIGHT = 48;

export const satelliteSubject = style([
    lookEntries.panel,
    {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: themeVars.spacing.full,
        fontSize: themeVars.fontSize.small,
        textAlign: "center",
    },
]);

export const satelliteBadge = style({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%",
    backgroundColor: themeVars.color.primary.light,
    backgroundImage: `radial-gradient(circle at 70% 30%, ${themeVars.color.primary.light}, ${themeVars.color.primary.dark})`,
    color: themeVars.color.primary.contrast,
    fontSize: themeVars.fontSize.xSmall,
    boxShadow: themeVars.shadow.small,
});

export const satelliteBadgeMuted = style({
    backgroundColor: themeVars.color.secondary.light,
    backgroundImage: `radial-gradient(circle at 70% 30%, ${themeVars.color.secondary.light}, ${themeVars.color.secondary.dark})`,
    color: themeVars.color.secondary.contrast,
});

export const satellitePill = style({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
    height: `${PILL_HEIGHT}px`,
    minWidth: `${PILL_HEIGHT}px`,
    padding: `0 ${themeVars.spacing.half}`,
    borderRadius: `${PILL_HEIGHT * 0.5}px`,
    backgroundColor: themeVars.color.primary.light,
    backgroundImage: `linear-gradient(135deg, ${themeVars.color.primary.light}, ${themeVars.color.primary.dark})`,
    color: themeVars.color.primary.contrast,
    fontSize: themeVars.fontSize.large,
    whiteSpace: "nowrap",
    boxShadow: themeVars.shadow.small,
});
