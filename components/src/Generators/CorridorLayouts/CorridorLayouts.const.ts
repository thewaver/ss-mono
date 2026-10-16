import type { TubeLayoutDefs, WallsLayoutDefs } from "./CorridorLayouts.types";

export namespace CorridorLayoutDefaults {
    export const WALLS_DEFAULTS: Required<WallsLayoutDefs> = {
        minSkipCount: 0,
        maxSkipCount: 0,
        seed: 0,
        heightRatio: 0.4,
        aspectRatio: 1.5,
        farWidthRatio: 0.2,
        nearAngleDegrees: 75,
        farAngleDegrees: 75,
        perspectivePx: 900,
        visibleCards: 4,
        viewDistance: 1,
    };

    export const TUBE_DEFAULTS: Required<TubeLayoutDefs> = {
        sides: 12,
        minSkipCount: 0,
        maxSkipCount: 0,
        seed: 0,
        radiusRatio: 1,
        farWidthRatio: 0.1,
        depthRatio: 1,
        tiltDegrees: 90,
        twistDegrees: 0,
        spinDegrees: 0,
        perspectivePx: 900,
        visibleRings: 3,
        viewRings: 1.5,
    };

    export const DEFAULTS_BY_FAMILY = {
        walls: WALLS_DEFAULTS,
        tube: TUBE_DEFAULTS,
    };
}
