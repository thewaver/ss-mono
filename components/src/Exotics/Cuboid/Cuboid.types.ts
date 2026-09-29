import type { Point3d } from "@thewaver/ss-utils";

export type CuboidFace = "front" | "right" | "back" | "left" | "top" | "bottom";

export type CuboidSize = {
    width: number;
    height: number;
    depth: number;
};

export type CuboidFaceState = {
    face: CuboidFace;
    isShowing: boolean;
};

export type CuboidTurns = {
    yaw: number;
    pitch: number;
};

export type CuboidArc = {
    axis: Point3d;
    degrees: number;
};
