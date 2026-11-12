import { globalStyle, style, styleVariants } from "@vanilla-extract/css";

import { SKIN_COLUMN_MIN_WIDTH, THEME_SWATCH_FAMILIES } from "./AppearancePage.const";
import type { ThemeSwatchFamily, ThemeSwatchShade } from "./AppearancePage.types";

import { layoutVars } from "../../Layout.css";
import { exampleContainer } from "../../PageComponents/Examples/Examples.css";
import { skinBoundary, skinEntries } from "../../Skins/Skin.css";
import { colorInputSwatch } from "../../StyledComponents/ColorInputContent/ColorInputContent.css";
import { themeVars } from "../../Theme.css";

export const appearancePage = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.quad,
    width: "100%",
});

export const appearanceTitle = style({
    margin: 0,
    fontSize: themeVars.fontSize.xLarge,
    fontWeight: "normal",
});

export const appearanceDescription = style({
    margin: 0,
    maxWidth: layoutVars.readingWidth,
    fontSize: themeVars.fontSize.medium,
    opacity: 0.75,
});

export const appearanceHeading = style({
    margin: 0,
    fontSize: themeVars.fontSize.large,
    fontWeight: "normal",
});

export const appearanceSection = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.double,
});

globalStyle(`${appearanceSection} > [role="radiogroup"]`, {
    width: "100%",
});

const SWATCH_FAMILY_VARS: Record<ThemeSwatchFamily, Record<ThemeSwatchShade, string>> = {
    primary: themeVars.color.primary,
    secondary: themeVars.color.secondary,
    info: themeVars.color.info,
    success: themeVars.color.success,
    alert: themeVars.color.alert,
    error: themeVars.color.error,
    level0: themeVars.color.layers.level0,
    level1: themeVars.color.layers.level1,
    level2: themeVars.color.layers.level2,
};

export const themeGrid = style({
    display: "grid",
    gridTemplateColumns: `auto repeat(${THEME_SWATCH_FAMILIES.length}, 1fr)`,
    alignItems: "center",
    gap: themeVars.spacing.half,
});

export const themeSwatches = Object.fromEntries(
    THEME_SWATCH_FAMILIES.map((family) => [
        family,
        styleVariants(SWATCH_FAMILY_VARS[family], (color) => [
            colorInputSwatch,
            { width: "auto", height: themeVars.spacing.quad, background: color },
        ]),
    ]),
) as Record<ThemeSwatchFamily, Record<ThemeSwatchShade, string>>;

export const skinRow = style([skinEntries.pageContainer, { overflow: "hidden" }]);

export const skinSampleBoundary = style([skinBoundary, { isolation: "isolate" }]);

export const skinSamples = style([
    skinEntries.pageBackground,
    {
        display: "flex",
        flexDirection: "column",
        gap: themeVars.spacing.full,
        padding: themeVars.spacing.double,
    },
]);

export const skinColumns = style({
    display: "grid",
    gridTemplateColumns: `repeat(auto-fill, minmax(${SKIN_COLUMN_MIN_WIDTH}px, 1fr))`,
    gap: themeVars.spacing.double,
});

export const skinColumn = style([exampleContainer, { alignItems: "start", gap: themeVars.spacing.full }]);

export const skinWideColumn = style({ gridColumn: "span 2" });

export const skinColumnName = style({
    fontSize: themeVars.fontSize.small,
    opacity: 0.75,
});

export const skinStateGrid = style({
    display: "grid",
    gridTemplateColumns: "repeat(2, auto)",
    width: "100%",
    alignItems: "center",
    gap: themeVars.spacing.full,
});

export const skinFittedStateGrid = style({ justifyContent: "start" });

export const skinBarStack = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
    width: "100%",
});

export const skinBarCell = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.half,
    width: "100%",
});

export const skinBarCaption = style({
    fontSize: themeVars.fontSize.xSmall,
    opacity: 0.75,
});

export const skinHoveredOption = style({
    position: "relative",
    isolation: "isolate",
});

export const skinHoveredFloater = style({
    position: "absolute",
    inset: 0,
    zIndex: -1,
    display: "grid",
    pointerEvents: "none",
});

export const skinPanel = style([
    skinEntries.panel,
    {
        padding: themeVars.spacing.full,
        fontSize: themeVars.fontSize.small,
    },
]);

export const skinWideSample = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
    width: "100%",
});
