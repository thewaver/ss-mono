import { globalStyle, style } from "@vanilla-extract/css";

import { toBackdropGradient } from "./Theme.utils";

import { layoutVars } from "./Layout.css";
import { layerVars } from "./StyledComponents/Layer/Layer.css";
import { themeVars } from "./Theme.css";

export const appRoot = style({
    position: "relative",
    width: "100%",
    height: "100vh",
    overflow: "hidden",
});

export const appFrame = style({
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
});

export const appContent = style({
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    gridTemplateRows: "minmax(0, 1fr)",
    flex: 1,
    minHeight: 0,
    width: "100%",
});

export const leftMenu = style({
    boxSizing: "border-box",
    color: themeVars.color.surface.contrast,
    backgroundColor: themeVars.color.surface.light,
    backgroundImage: `linear-gradient(45deg, ${themeVars.color.surface.dark}, ${themeVars.color.surface.light})`,
    boxShadow: themeVars.shadow.large,
    width: "100%",
    height: "100%",
    overflow: "hidden",
});

export const leftMenuContent = style({
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: themeVars.spacing.double,
    boxSizing: "border-box",
    width: layoutVars.menuExpandedWidth,
    height: "100%",
    paddingTop: themeVars.spacing.double,
    overflow: "hidden",
});

export const isFaded = style({
    opacity: 0,
});

export const isHidden = style({
    visibility: "hidden",
});

export const searchFields = style({
    transitionProperty: "opacity",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    minWidth: 0,
    gap: themeVars.spacing.full,
});

export const isExpanded = style({});
export const isHovered = style({});

export const menuTree = style({
    transitionProperty: "opacity",
    flex: 1,
    minHeight: 0,
    padding: `0 ${layoutVars.menuPadding} ${themeVars.spacing.double}`,
    overflowY: "auto",
});

globalStyle(`${menuTree} a, ${menuTree} a:visited`, {
    color: "inherit",
});

export const searchContainer = style({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexShrink: 0,
    gap: themeVars.spacing.full,
    boxSizing: "border-box",
    width: "100%",
    padding: `0 ${layoutVars.menuPadding}`,
});

export const frameworkHeading = style({
    transitionProperty: "opacity",
    display: "flex",
    alignItems: "center",
    flex: 1,
    minWidth: 0,
});

export const frameworkHeadingLabel = style({
    fontSize: themeVars.fontSize.medium,
    fontWeight: "bold",
    whiteSpace: "nowrap",
});

export const navSettingsBox = style({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    width: layoutVars.iconButtonSize,
    height: layoutVars.iconButtonSize,
});

export const navPreview = style({
    width: 360,
    aspectRatio: "3 / 2",
});

export const aboutLink = style({
    transitionProperty: "opacity",
    flexShrink: 0,
    padding: `0 ${layoutVars.menuPadding}`,
});

export const pageColumn = style({
    display: "flex",
    flexDirection: "column",
    height: "100%",
    padding: layoutVars.pageMargin,
    overflowY: "auto",
    scrollbarGutter: "stable",
    backgroundImage: toBackdropGradient(themeVars.color.background.dark, themeVars.color.background.light),
});

globalStyle(`${pageColumn} > *`, {
    maxWidth: layoutVars.pageBodyMaxWidth,
});

export const pageBody = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.double,
});

export const pageHeader = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
});

export const pageTitle = style({
    margin: 0,
    fontSize: themeVars.fontSize.xLarge,
    fontWeight: "normal",
});

export const pageDescription = style({
    fontSize: themeVars.fontSize.small,
    maxWidth: layoutVars.readingWidth,
    opacity: 0.75,
});

export const pageDependencies = style({
    display: "grid",
    gridTemplateColumns: "auto minmax(0, 1fr)",
    alignItems: "baseline",
    gap: themeVars.spacing.full,
    maxWidth: layoutVars.readingWidth,
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
    borderRadius: themeVars.borderRadius.full,
    backgroundColor: `rgb(from ${layerVars.main} r g b / 75%)`,
    color: layerVars.contrast,
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
    backgroundImage: `linear-gradient(45deg, rgb(from ${layerVars.main} r g b / 50%), rgb(from ${layerVars.main} r g b / 75%))`,
    fontFamily: "monospace",
});

export const dependencyName = style([dependencyChip, { color: layerVars.contrast }]);

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
