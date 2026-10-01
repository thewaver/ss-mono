import type { CuboidFace } from "./Cuboid.types";

export const CUBOID_DEFAULTS = {
    transitionDurationMs: 600,
    isUpright: false,
    isDraggable: false,
    roleDescription: "box",
    faceRoleDescription: "face",
};

export const CUBOID_FACES: readonly CuboidFace[] = ["front", "right", "back", "left", "top", "bottom"];
