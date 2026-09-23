import { style, styleVariants } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const PAGE_SUNBURST_FAMILIES = ["primary", "secondary", "info", "success", "alert", "error"] as const;

const familyOf = (family: (typeof PAGE_SUNBURST_FAMILIES)[number]) => themeVars.color[family];

export const sunburstStopLight = styleVariants(
    Object.fromEntries(PAGE_SUNBURST_FAMILIES.map((family) => [family, { stopColor: familyOf(family).light }])),
);

export const sunburstStopDark = styleVariants(
    Object.fromEntries(PAGE_SUNBURST_FAMILIES.map((family) => [family, { stopColor: familyOf(family).dark }])),
);

export const sunburstLabel = styleVariants(
    Object.fromEntries(PAGE_SUNBURST_FAMILIES.map((family) => [family, { fill: familyOf(family).contrast }])),
);

export const sunburstArc = style({
    fillOpacity: 0.6,
});

export const sunburstArcBranch = style({
    fillOpacity: 0.9,
    cursor: "pointer",
});

export const sunburstText = style({
    fontSize: themeVars.fontSize.xSmall,
    pointerEvents: "none",
    userSelect: "none",
    transition: `fill-opacity ${themeVars.animation.duration}`,
});

export const sunburstHub = style({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    color: themeVars.color.surface.contrast,
    fontSize: themeVars.fontSize.xSmall,
    textAlign: "center",
    cursor: "pointer",
});

export const sunburstHubHovered = style({
    backgroundImage: `radial-gradient(circle at 70% 30%, ${themeVars.color.surface.light}, ${themeVars.color.surface.dark})`,
});

export const sunburstHubAtRoot = style({
    cursor: "default",
});

export const sunburstHubName = style({
    fontSize: themeVars.fontSize.small,
    fontWeight: "bold",
});

export const sunburstHubWeight = style({
    opacity: 0.7,
});
