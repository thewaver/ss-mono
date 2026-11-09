import { style } from "@vanilla-extract/css";

import { skinEntries, skinStates } from "../../../Skins/Skin.css";
import { layerVars } from "../../../StyledComponents/Layer/Layer.css";
import { themeVars } from "../../../Theme.css";

export const itemHighlighted = style([skinStates.isHovered]);

export const item = style([
    skinEntries.dropdown,
    skinEntries.itemBase,
    skinStates.hasHoverFloater,
    {
        display: "flex",
        position: "relative",
        isolation: "isolate",
        alignItems: "center",
        justifyContent: "center",
        gap: themeVars.spacing.half,
        width: "100%",
        height: "100%",
        padding: `0 ${themeVars.spacing.full}`,
        fontSize: themeVars.fontSize.small,
        textAlign: "center",
        transition: "background-color 120ms ease-out, color 120ms ease-out, transform 120ms ease-out",

        selectors: {
            [`&.${skinStates.isHovered}`]: {
                backgroundColor: "transparent",
                backgroundImage: "none",
            },
        },
    },
]);

export const itemFloater = style([
    skinEntries.itemHoverFloater,
    {
        width: "100%",
        height: "100%",
        opacity: 0,
        transitionProperty: "opacity",
    },
]);

export const itemFloaterVisible = style({
    opacity: 1,
});

export const itemDisabled = style([skinStates.isDisabled]);

export const shortcut = style({
    flex: "none",
    padding: `0 ${themeVars.spacing.half}`,
    borderRadius: themeVars.borderRadius.half,
    border: `1px solid rgb(from ${layerVars.contrast} r g b / 25%)`,
    fontFamily: "monospace",
    fontSize: themeVars.fontSize.xSmall,
    opacity: 0.75,
});

export const stage = style({
    display: "grid",
    placeItems: "center",
    minHeight: 340,
});

export const layer = style({
    opacity: 0,
    transform: "scale(0.9)",
    transformOrigin: "center center",
});

export const layerVisible = style({
    opacity: 1,
    transform: "scale(1)",
});
