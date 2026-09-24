import type { FadeDefs, GlowDefs, ZoomInDefs } from "@thewaver/ss-components";

import type { Knobs } from "../PageComponents/Knobs/Knobs.types";

export namespace ProximityEffectKnobs {
    export const ZOOM_IN_KNOBS: Knobs<ZoomInDefs> = {
        reachRatio: {
            kind: "number",
            label: "Reach ratio",
            hint: "How far from the pointer the effect is still felt, counted in item spacings. Larger reaches lift more items at once.",
            min: 0.5,
            max: 6,
            step: 0.25,
        },
        growthRatio: {
            kind: "number",
            label: "Growth ratio",
            hint: "How much larger the item right under the pointer gets. 0.5 makes it half again its size.",
            min: 0,
            max: 1.5,
            step: 0.05,
        },
        pushRatio: {
            kind: "number",
            label: "Push ratio",
            hint: "How far neighbors are shoved aside to make room, as a share of an item's width. An arrangement with no slack, such as a full ring, quietly ignores it.",
            min: 0,
            max: 2,
            step: 0.05,
        },
    };

    export const GLOW_KNOBS: Knobs<GlowDefs> = {
        reachRatio: {
            kind: "number",
            label: "Reach ratio",
            hint: "How far from the pointer the effect is still felt, counted in item spacings. Larger reaches light more items at once.",
            min: 0.5,
            max: 6,
            step: 0.25,
        },
        brightnessRatio: {
            kind: "number",
            label: "Brightness ratio",
            hint: "How much brighter the item under the pointer goes. A negative value darkens it instead.",
            min: -0.5,
            max: 2,
            step: 0.05,
        },
        saturationRatio: {
            kind: "number",
            label: "Saturation ratio",
            hint: "How much more colorful the item under the pointer goes. -1 drains it to gray.",
            min: -1,
            max: 2,
            step: 0.05,
        },
    };

    export const FADE_KNOBS: Knobs<FadeDefs> = {
        reachRatio: {
            kind: "number",
            label: "Reach ratio",
            hint: "How close to the pointer an item has to be to stay sharp, counted in item spacings. Everything beyond it is faded.",
            min: 0.5,
            max: 6,
            step: 0.25,
        },
        opacityRatio: {
            kind: "number",
            label: "Opacity ratio",
            hint: "How far the items away from the pointer are dimmed. 0 leaves them at full strength.",
            min: 0,
            max: 1,
            step: 0.05,
        },
        blurPixels: {
            kind: "number",
            label: "Blur (px)",
            hint: "How far the items away from the pointer are blurred. It is dropped when the visitor has asked for reduced motion.",
            min: 0,
            max: 12,
            step: 0.5,
        },
    };

    export const KNOBS_BY_FAMILY = {
        fade: FADE_KNOBS,
        glow: GLOW_KNOBS,
        zoomIn: ZOOM_IN_KNOBS,
    };
}
