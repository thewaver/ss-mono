import { globalStyle, style } from "@vanilla-extract/css";

import { themeVars } from "./Theme.css";

export const appRoot = style({
    position: "relative",
    width: "100%",
    height: "100vh",
    overflow: "hidden",
});

export const appContent = style({
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    gridTemplateRows: "minmax(0, 1fr)",
    width: "100%",
    height: "100%",
    backgroundImage: `linear-gradient(45deg, ${themeVars.color.background.dark}, ${themeVars.color.background.light})`,
});

export const leftMenu = style({
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: themeVars.spacing.double,
    color: themeVars.color.surface.contrast,
    backgroundImage: `linear-gradient(45deg, ${themeVars.color.surface.dark}, ${themeVars.color.surface.light})`,
    backdropFilter: "blur(10px)",
    boxShadow: themeVars.shadow.large,
    width: 320,
    padding: themeVars.spacing.double,
    overflowY: "auto",
});

export const isExpanded = style({});
export const isHovered = style({});

export const menuTree = style({});

globalStyle(`${menuTree} a, ${menuTree} a:visited`, {
    color: "inherit",
});

export const searchContainer = style({
    width: "100%",
});

export const pageColumn = style({
    display: "flex",
    flexDirection: "column",
    height: "100%",
    padding: themeVars.spacing.quad,
    overflowY: "auto",
});

export const pageBody = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.quad,
});

export const pageHeader = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
});

export const pageTitle = style({
    margin: 0,
    fontSize: themeVars.fontSize.large,
    fontWeight: "normal",
});

export const pageDescription = style({
    fontSize: themeVars.fontSize.small,
    maxWidth: 960,
    opacity: 0.75,
});

export const pageDependencies = style({
    display: "grid",
    gridTemplateColumns: "auto minmax(0, 1fr)",
    alignItems: "baseline",
    gap: themeVars.spacing.full,
    maxWidth: 960,
    fontSize: themeVars.fontSize.xSmall,
});

export const dependencySectionLabel = style({
    whiteSpace: "nowrap",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    opacity: 0.5,
});

export const dependencyGroups = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.half,
    minWidth: 0,
    paddingTop: themeVars.spacing.half,
});

export const dependencyDisclosure = style({});

globalStyle(`${dependencyDisclosure} [aria-expanded]`, {
    width: "fit-content",
});

export const dependencySummary = style({
    display: "flex",
    alignItems: "center",
    gap: themeVars.spacing.half,
    padding: `${themeVars.spacing.half} ${themeVars.spacing.full}`,
    borderRadius: themeVars.borderRadius.half,
    backgroundImage: `linear-gradient(45deg, ${themeVars.color.tooltip.dark}, ${themeVars.color.tooltip.light})`,
    color: themeVars.color.tooltip.contrast,
    fontFamily: "monospace",
    whiteSpace: "nowrap",
    transition: `filter ${themeVars.animation.duration}`,

    selectors: {
        [`&.${isHovered}`]: {
            filter: themeVars.hover.filter,
        },
    },
});

export const dependencySummaryMarker = style({
    fontSize: themeVars.fontSize.xSmall,
    transition: `transform ${themeVars.animation.duration}`,

    selectors: {
        [`${dependencySummary}.${isExpanded} &`]: {
            transform: "rotate(90deg)",
        },
    },
});

export const dependencyGroup = style({
    display: "flex",
    flexWrap: "wrap",
    alignItems: "baseline",
    gap: themeVars.spacing.half,
});

export const dependencyLabel = style({
    opacity: 0.5,
    textTransform: "uppercase",
    letterSpacing: 1,
});

const dependencyChip = style({
    padding: `${themeVars.spacing.half} ${themeVars.spacing.full}`,
    borderRadius: themeVars.borderRadius.half,
    backgroundImage: `linear-gradient(45deg, ${themeVars.color.tooltip.dark}, ${themeVars.color.tooltip.light})`,
    fontFamily: "monospace",
});

export const dependencyName = style([dependencyChip, { color: themeVars.color.tooltip.contrast }]);

export const dependencyLink = style([
    dependencyChip,
    {
        color: themeVars.color.primary.main,

        selectors: {
            "&:visited": {
                color: themeVars.color.primary.main,
            },
        },
    },
]);
