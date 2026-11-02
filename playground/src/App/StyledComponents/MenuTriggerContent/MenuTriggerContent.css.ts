import { style } from "@vanilla-extract/css";

import { lookEntries, lookStates } from "../../Looks/Look.css";
import { themeVars } from "../../Theme.css";

const TRIGGER_CHEVRON_WIDTH = 10;

export const isHovered = style([lookStates.isHovered]);
export const isActive = style([lookStates.isActive]);
export const isOpen = style({});
export const isDisabled = style([lookStates.isDisabled]);

export const menuTriggerContent = style([
    lookEntries.button,
    {
        display: "flex",
        alignItems: "center",
        gap: themeVars.spacing.full,
        boxSizing: "border-box",
        height: 40,
        whiteSpace: "nowrap",
        transition: `filter ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}`,

        selectors: {
            [`&.${isOpen}`]: {
                filter: themeVars.hover.filter,
            },
        },
    },
]);

export const menuTriggerChevron = style({
    flexShrink: 0,
    width: 0,
    height: 0,
    borderLeft: `${TRIGGER_CHEVRON_WIDTH / 2}px solid transparent`,
    borderRight: `${TRIGGER_CHEVRON_WIDTH / 2}px solid transparent`,
    borderTop: "6px solid currentColor",
    transition: `transform ${themeVars.animation.duration}`,

    selectors: {
        [`${menuTriggerContent}.${isOpen} &`]: {
            transform: "rotate(180deg)",
        },
    },
});
