import { globalStyle, style } from "@vanilla-extract/css";

import { skinEntries } from "../../../Skins/Skin.css";
import { FOCUS_RING_WIDTH, themeVars } from "../../../Theme.css";

const panel = (from: string, to: string) => `linear-gradient(135deg, ${from}, ${to})`;

export const root = style({
    borderRadius: themeVars.borderRadius.full,
    overflow: "hidden",
    selectors: {
        "&:has(> :focus-visible)": {
            outline: `${FOCUS_RING_WIDTH}px solid ${themeVars.color.outline.main}`,
        },
    },
});

globalStyle(`${root} > :focus-visible`, {
    outline: "0 none",
});

export const content = style([
    skinEntries.panel,
    {
        display: "flex",
        flexDirection: "column",
        gap: themeVars.spacing.half,
        height: 200,
        padding: themeVars.spacing.double,
        fontSize: themeVars.fontSize.small,
    },
]);

export const contentTitle = style({
    color: themeVars.color.primary.main,
    fontSize: themeVars.fontSize.large,
});

export const solidCover = style({
    display: "grid",
    placeItems: "center",
    width: "100%",
    height: "100%",
    backgroundImage: panel(themeVars.color.primary.dark, themeVars.color.primary.light),
    color: themeVars.color.primary.contrast,
    fontSize: themeVars.fontSize.small,
});

export const frostedCover = style({
    backgroundColor: "rgb(0 0 0 / 50%)",
    width: "100%",
    height: "100%",
    backdropFilter: "blur(8px) saturate(0.4)",
});

export const promptCover = style({
    display: "grid",
    placeItems: "center",
    width: "100%",
    height: "100%",
    backgroundImage: panel(themeVars.color.primary.dark, themeVars.color.primary.light),
    color: themeVars.color.primary.contrast,
    fontFamily: "monospace",
    fontSize: themeVars.fontSize.small,
});
