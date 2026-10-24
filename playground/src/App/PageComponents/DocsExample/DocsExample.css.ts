import { style } from "@vanilla-extract/css";

import { layerVars } from "../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../Theme.css";
import { exampleContainer, exampleDemo } from "../Examples/Examples.css";

export const docsExampleStack = style({
    display: "flex",
    flexDirection: "column",
    gap: themeVars.spacing.full,
    minWidth: 0,
});

export const docsExample = style([exampleContainer]);

export const docsExampleCode = style({
    borderRadius: themeVars.borderRadius.half,
    boxShadow: themeVars.shadow.medium,
});

export const docsExampleSection = style({
    display: "flex",
    alignItems: "stretch",
    gap: themeVars.spacing.double,
    minWidth: 0,
});

export const docsExampleDemo = style([exampleDemo, { flex: "60 1 0", alignItems: "center" }]);

export const docsExampleDivider = style({
    flexShrink: 0,
    borderLeft: `1px solid rgb(from ${layerVars.contrast} r g b / 10%)`,
});

export const docsExampleKnobs = style({
    flex: "40 1 0",
    minWidth: 0,
});
