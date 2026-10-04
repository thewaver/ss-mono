import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

import { ShapeRevealKnobs } from "../../Knobs/ShapeReveals.const";
import type {
    ShapeRevealPageOrigin,
    ShapeRevealPageShape,
    ShapeRevealPanel,
    ShapeRevealRun,
} from "./ShapeRevealPage.types";

export const SWITCH_ID = "shapeRevealSwitch";

export const STARTING_PANEL: ShapeRevealPanel = "dawn";

export const NEXT_PANEL: Record<ShapeRevealPanel, ShapeRevealPanel> = {
    dawn: "dusk",
    dusk: "dawn",
};

export const PANEL_TITLES: Record<ShapeRevealPanel, string> = {
    dawn: "Dawn",
    dusk: "Dusk",
};

export const PANEL_LINES: Record<ShapeRevealPanel, string> = {
    dawn: "The whole page is pictured, the panel changes underneath, and the new page grows out of the old one.",
    dusk: "Only this panel changed, so it is the only part of the page that looks different inside the shape.",
};

export const ORIGIN_LABELS: Record<ShapeRevealPageOrigin, string> = {
    "button": "the button",
    "center": "the center",
    "top-left": "the top-left corner",
    "top-right": "the top-right corner",
    "bottom-left": "the bottom-left corner",
    "bottom-right": "the bottom-right corner",
};

export const toComputePoints = (shape: ShapeRevealPageShape) =>
    shape === ShapeRevealKnobs.CIRCLE ? undefined : (size: Size2d) => ShapeConst.getDefaultShapePoints(shape, size);

export const computeShapeRevealReadout = (run: ShapeRevealRun | undefined, isSupported: boolean) => {
    if (!run) {
        return isSupported
            ? "nothing revealed yet; Switch changes the panel through the shape and from the spot picked above"
            : "this browser has no view transitions, so Switch changes the panel with nothing revealed";
    }

    if (run.hasAnimated) {
        return `showing ${run.panel}, revealed through a ${run.shape} growing from ${ORIGIN_LABELS[run.origin]}`;
    }

    return `showing ${run.panel}, switched with nothing revealed because ${isSupported ? "the duration is 0" : "this browser has no view transitions"}`;
};
