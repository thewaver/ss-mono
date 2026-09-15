import { style, styleVariants } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const propsGroups = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.double,
    width: "100%",
});

export const propsPanelScopeBase = style({
    gap: themeVars.spacing.full,
    width: "100%",
});

const propsPanelGrid = style({
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
});

export const propsPanelScopeVariants = styleVariants({
    global: [propsPanelScopeBase, propsPanelGrid],
    sample: [propsPanelScopeBase, propsPanelGrid],
    local: [
        propsPanelScopeBase,
        {
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
        },
    ],
});

export const propsPanelDivider = style({
    borderTop: `1px solid rgb(from ${themeVars.color.background.contrast} r g b / 10%)`,
    width: "100%",
});
