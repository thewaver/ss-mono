import { style } from "@vanilla-extract/css";

import { PAGE_CONTENT_WIDTH } from "../../App.css";
import { themeVars } from "../../Theme.css";

export const galleryPage = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.quad,
    width: "100%",
});

export const galleryTitle = style({
    margin: 0,
    fontSize: themeVars.fontSize.xLarge,
    fontWeight: "normal",
});

export const gallerySection = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.double,
});

export const galleryHeading = style({
    margin: 0,
    fontSize: themeVars.fontSize.large,
    fontWeight: "normal",
});

export const galleryDescription = style({
    margin: 0,
    maxWidth: PAGE_CONTENT_WIDTH,
    fontSize: themeVars.fontSize.medium,
    opacity: 0.75,
});

export const galleryGrid = style({
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
    gap: themeVars.spacing.double,
});

export const galleryTile = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
    minWidth: 0,

    color: themeVars.color.surface.contrast,
    backgroundImage: `linear-gradient(45deg, ${themeVars.color.surface.dark}, ${themeVars.color.surface.light})`,
    backdropFilter: "blur(10px)",
    boxShadow: themeVars.shadow.medium,
    borderRadius: themeVars.borderRadius.full,
    padding: themeVars.spacing.double,
});

export const galleryTileName = style({
    alignSelf: "start",
    color: "inherit",
    fontSize: themeVars.fontSize.medium,

    selectors: {
        "&:visited": {
            color: "inherit",
        },
    },
});

export const galleryPreview = style({
    position: "relative",
    aspectRatio: "3 / 2",
    width: "100%",
});
