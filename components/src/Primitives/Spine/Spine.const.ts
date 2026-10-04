import type { RadialSpineDefs, SpineAxis } from "./Spine.types";

export const SPINE_DEFAULTS = {
    axis: "row" as SpineAxis,
    hasBacks: false,
    perspectivePx: 1000,
};

export const RADIAL_SPINE_DEFAULTS: Required<RadialSpineDefs> = {
    spanDegrees: 360,
};
