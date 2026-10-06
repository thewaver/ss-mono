import { style } from "@vanilla-extract/css";

import { themeVars } from "../../Theme.css";
import { controlButtonBase, isActive, isDisabled, isHovered } from "../ControlButtonContent/ControlButtonContent.css";
import { layerVars } from "../Layer/Layer.css";

export const CAROUSEL_SLIDE_HEIGHT = 140;

export const isCurrent = style({});
export { isActive, isDisabled, isHovered };

export const carouselSlide = style({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: themeVars.spacing.half,
    height: CAROUSEL_SLIDE_HEIGHT,
    minHeight: "100%",
    borderRadius: themeVars.borderRadius.half,
    backgroundImage: `linear-gradient(135deg, rgb(from ${layerVars.main} r g b / 50%), rgb(from ${layerVars.main} r g b / 75%))`,
    color: layerVars.contrast,
    userSelect: "none",
});

export const carouselSlideTitle = style({
    fontSize: themeVars.fontSize.large,
});

export const carouselSlideBody = style({
    fontSize: themeVars.fontSize.xSmall,
    opacity: 0.75,
});

export const carouselSlideBack = style({
    height: "100%",
    minHeight: "100%",
    borderRadius: themeVars.borderRadius.half,
    backgroundColor: `rgb(from ${layerVars.contrast} r g b / 10%)`,
    userSelect: "none",
});

export const carouselBox = style({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    height: 240,
});

export const carouselBar = style({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: themeVars.spacing.half,
});

export const carouselPick = style([
    controlButtonBase,
    {
        width: 10,
        height: 10,
        borderRadius: "50%",

        selectors: {
            [`&.${isCurrent}`]: {
                backgroundColor: themeVars.color.primary.main,
            },
        },
    },
]);
