import { style } from "@vanilla-extract/css";

import { skinEntries, skinStates } from "../../Skins/Skin.css";
import { themeVars } from "../../Theme.css";

export const isCurrent = style([skinStates.isCurrent]);
export const isHovered = style({});
export const isDisabled = style({});

export const breadcrumbContent = style([
    skinEntries.breadcrumb,
    {
        display: "flex",
        alignItems: "center",
        height: 32,
        paddingInline: themeVars.spacing.half,
        borderRadius: themeVars.borderRadius.half,
        fontSize: themeVars.fontSize.small,
        whiteSpace: "nowrap",
        transition: `color ${themeVars.animation.duration}, filter ${themeVars.animation.duration}, opacity ${themeVars.animation.duration}`,

        selectors: {
            [`&.${isCurrent}`]: {
                fontWeight: "bold",
            },
            [`&.${isHovered}`]: {
                filter: themeVars.hover.filter,
                textDecoration: "underline",
            },
            [`&.${isDisabled}`]: {
                filter: themeVars.disabled.filter,
                opacity: themeVars.disabled.opacity,
            },
        },
    },
]);

export const breadcrumbSeparator = style([
    skinEntries.breadcrumbSeparator,
    {
        paddingInline: themeVars.spacing.half,
        fontSize: themeVars.fontSize.small,
    },
]);
