import type { FlipCardAxis } from "./FlipCard.types";

export const FLIP_CARD_DEFAULTS = {
    axis: "row" as FlipCardAxis,
    transitionDurationMs: 600,
    peekRatio: 0,
    roleDescription: "flip card",
    faceRoleDescription: "face",
};
