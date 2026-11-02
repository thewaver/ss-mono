import { style } from "@vanilla-extract/css";

import { layoutVars } from "../../Layout.css";
import { exampleContainer } from "../../PageComponents/Examples/Examples.css";
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
    maxWidth: layoutVars.readingWidth,
    fontSize: themeVars.fontSize.medium,
    opacity: 0.75,
});

export const galleryGrid = style({
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
    gap: themeVars.spacing.double,
});

export const galleryTile = style([exampleContainer, { gap: themeVars.spacing.full }]);

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
