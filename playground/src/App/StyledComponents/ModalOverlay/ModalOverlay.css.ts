import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";

export const overlayOn = style({
    backdropFilter: "blur(10px) grayscale(75%)",
});

export const overlayOff = style({
    backdropFilter: "none",
});

const overlayScrim = style({
    backgroundColor: [themeVars.color.surface.dark, `rgb(from ${themeVars.color.surface.dark} r g b / 65%)`],
});

export const overlayScrimOn = style([overlayScrim, { opacity: 1 }]);

export const overlayScrimOff = style([overlayScrim, { opacity: 0 }]);
