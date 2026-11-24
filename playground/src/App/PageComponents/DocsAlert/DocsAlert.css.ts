import { createVar, style } from "@vanilla-extract/css";

import { layoutVars } from "../../Layout.css";
import { skinEntries } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";

export const color = createVar();
export const backgroundColor = createVar();

export const docsAlertRoot = style([
    skinEntries.pageContainer,
    {
        position: "relative",
        maxWidth: layoutVars.readingWidth,
        padding: `${themeVars.spacing.full} ${themeVars.spacing.double}`,
        border: `2px solid ${color}`,
        backgroundColor,
        backgroundImage: `linear-gradient(${backgroundColor}, ${backgroundColor})`,
        color,
        fontWeight: 600,
    },
]);

export const docsAlertContent = style({
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    gap: `calc(${themeVars.spacing.double} - 2px)`,
});

export const docsAlertLogo = style({
    fontSize: 48,
    fontWeight: 400,
    lineHeight: 1,
});
