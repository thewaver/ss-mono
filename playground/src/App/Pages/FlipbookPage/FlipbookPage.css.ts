import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const stage = style({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: themeVars.spacing.full,
    width: "100%",
});

export const book = style({
    width: "100%",
    maxWidth: 520,
    height: 340,
});

export const page = style({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: themeVars.spacing.half,
    width: "100%",
    height: "100%",
    padding: themeVars.spacing.double,
    boxSizing: "border-box",
    backgroundImage: `linear-gradient(215deg, ${themeVars.color.secondary.light}, ${themeVars.color.secondary.dark})`,
    color: themeVars.color.secondary.contrast,
});

export const pageLeft = style({
    borderRadius: `${themeVars.borderRadius.half} 0 0 ${themeVars.borderRadius.half}`,
});

export const pageRight = style({
    borderRadius: `0 ${themeVars.borderRadius.half} ${themeVars.borderRadius.half} 0`,
});

export const cover = style({
    alignItems: "center",
    textAlign: "center",
    backgroundImage: `linear-gradient(215deg, ${themeVars.color.primary.light}, ${themeVars.color.primary.dark})`,
    color: themeVars.color.primary.contrast,
});

export const pageHeading = style({
    fontSize: themeVars.fontSize.large,
    fontWeight: "bold",
});

export const pageText = style({
    fontSize: themeVars.fontSize.small,
});

export const pageNumber = style({
    marginTop: "auto",
    fontSize: themeVars.fontSize.xSmall,
    opacity: 0.75,
});

export const controls = style({
    display: "flex",
    gap: themeVars.spacing.half,
    alignItems: "center",
    justifyContent: "center",
});
