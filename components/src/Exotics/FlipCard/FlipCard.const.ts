import type { FlipCardAxis, FlipCardTurnDirection } from "./FlipCard.types";

export const FLIP_CARD_DEFAULTS = {
    axis: "row" as FlipCardAxis,
    transitionDurationMs: 600,
    peekRatio: 0,
    roleDescription: "flip card",
    faceRoleDescription: "face",
};

export const FLIP_CARD_AXES: readonly FlipCardAxis[] = ["row", "column"];

export const FLIP_CARD_TURN_DIRECTIONS: readonly FlipCardTurnDirection[] = ["backward", "forward"];
