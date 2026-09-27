import type { BarrelAxis, BarrelFace } from "../../Primitives/Barrel/Barrel.types";

export type FlipCardAxis = BarrelAxis;

export type FlipCardFace = BarrelFace;

export type FlipCardTurnDirection = "forward" | "backward";

export type FlipCardState = {
    face: FlipCardFace;
    isShowing: boolean;
};
