import { describe, expect, it } from "vitest";

import { AngleUtils, MathUtils } from "@thewaver/ss-utils";

import type {
    CarouselPlacement,
    CarouselPlacementRule,
    CarouselPlacementDefs as FullPlacementDefs,
} from "../../Essentials/Carousel/Carousel.types";
import { CarouselUtils } from "../../Essentials/Carousel/Carousel.utils";
import { SpineUtils } from "../../Primitives/Spine/Spine.utils";
import { CarouselPlacementDefaults } from "./CarouselPlacements.const";
import type {
    CarouselPlacementEntry,
    ConcertinaPlacementDefs,
    CoverFlowPlacementDefs,
    CylinderPlacementDefs,
    DepthWavePlacementDefs,
    DrumPlacementDefs,
    FoldersPlacementDefs,
    HingePlacementDefs,
    PaddleWheelPlacementDefs,
    TrackPlacementDefs,
} from "./CarouselPlacements.types";
import { CarouselPlacementUtils } from "./CarouselPlacements.utils";

type CarouselPlacementDefs = Omit<FullPlacementDefs, "group">;

const PERCENT = 100;
const WHOLE = 1;
const HALF = 0.5;
const FULL_TURN_DEGREES = 360;
const QUARTER_TURN_DEGREES = 90;
const SMALLEST_RING = 3;
const BOTTOM_EDGE = { x: 0.5, y: 1 };
const LEFT_EDGE = { x: 0, y: 0.5 };
const LEAVING_DROP_RATIO = 0.6;
const FLIPPED_FADE_DISTANCE = 2;

const getAlong = (defs: CarouselPlacementDefs) =>
    defs.orientation === "horizontal" ? defs.size.width : defs.size.height;

const toTranslation = (defs: CarouselPlacementDefs, alongPercent: number, depthPx: number) =>
    defs.orientation === "horizontal" ? [alongPercent, 0, depthPx] : [0, alongPercent, depthPx];

const toStackTranslation = (defs: CarouselPlacementDefs, aheadPercent: number, depthPx: number) =>
    defs.orientation === "horizontal" ? [aheadPercent, 0, depthPx] : [0, -aheadPercent, depthPx];

const toTurn = (defs: CarouselPlacementDefs, degrees: number) =>
    defs.orientation === "horizontal" ? { rotateY: degrees } : { rotateX: -degrees };

const toVisibility = (distance: number, visibleDistance: number) =>
    MathUtils.clamp01(visibleDistance + WHOLE - Math.abs(distance)) * PERCENT;

namespace ReferencePlacements {
    export const createTrack = (defs?: TrackPlacementDefs): CarouselPlacementRule => {
        const gapRatio = defs?.gapRatio ?? CarouselPlacementDefaults.TRACK_DEFAULTS.gapRatio;

        return {
            reach: WHOLE,
            place: (placementDefs) => {
                const along = placementDefs.distance * (WHOLE + gapRatio) * PERCENT;

                return {
                    effect: placementDefs.orientation === "horizontal" ? { translateX: along } : { translateY: along },
                };
            },
        };
    };

    export const track = createTrack();

    export const createDrum = (defs?: DrumPlacementDefs): CarouselPlacementRule => {
        const perspectivePx = defs?.perspectivePx ?? CarouselPlacementDefaults.DRUM_DEFAULTS.perspectivePx;
        const faceCount = defs?.faceCount ?? CarouselPlacementDefaults.DRUM_DEFAULTS.faceCount;
        const faceRatio = defs?.faceRatio ?? CarouselPlacementDefaults.DRUM_DEFAULTS.faceRatio;

        return {
            reach: faceCount > 0 ? Math.floor(faceCount * HALF) : WHOLE,
            place: (placementDefs) => {
                const along = getAlong(placementDefs);
                const isFixed = faceCount > 0;
                const count = Math.max(isFixed ? faceCount : placementDefs.count, SMALLEST_RING);
                const angle = (placementDefs.distance * FULL_TURN_DEGREES) / count;
                const radius = (along * faceRatio * HALF) / Math.tan(Math.PI / count);
                const radians = AngleUtils.toRadians(angle);
                const alongPercent = along > 0 ? ((radius * Math.sin(radians)) / along) * PERCENT : 0;
                const isPastHalfTurn = isFixed && Math.abs(placementDefs.distance) > count * HALF;

                return {
                    effect: {
                        perspective: perspectivePx,
                        translate3d: toTranslation(placementDefs, alongPercent, radius * (Math.cos(radians) - WHOLE)),
                        ...toTurn(placementDefs, angle),
                        ...(isPastHalfTurn ? { opacity: 0 } : {}),
                    },
                    layer: Math.cos(radians),
                };
            },
        };
    };

    export const drum = createDrum();

    export const createCoverFlow = (defs?: CoverFlowPlacementDefs): CarouselPlacementRule => {
        const base = CarouselPlacementDefaults.COVER_FLOW_DEFAULTS;
        const spacingRatio = defs?.spacingRatio ?? base.spacingRatio;
        const gapRatio = defs?.gapRatio ?? base.gapRatio;
        const angleDegrees = defs?.angleDegrees ?? base.angleDegrees;
        const depthPx = defs?.depthPx ?? base.depthPx;
        const perspectivePx = defs?.perspectivePx ?? base.perspectivePx;
        const visibleDistance = defs?.visibleDistance ?? base.visibleDistance;

        return {
            reach: Math.ceil(visibleDistance) + WHOLE,
            place: (placementDefs) => {
                const { distance } = placementDefs;
                const near = MathUtils.clamp(distance, -WHOLE, WHOLE);
                const alongPercent = (distance * spacingRatio + near * gapRatio) * PERCENT;

                return {
                    effect: {
                        perspective: perspectivePx,
                        translate3d: toTranslation(placementDefs, alongPercent, -Math.abs(near) * depthPx),
                        ...toTurn(placementDefs, -near * angleDegrees),
                        opacity: toVisibility(distance, visibleDistance),
                    },
                };
            },
        };
    };

    export const coverFlow = createCoverFlow();

    export const createDepthWave = (defs?: DepthWavePlacementDefs): CarouselPlacementRule => {
        const base = CarouselPlacementDefaults.DEPTH_WAVE_DEFAULTS;
        const spacingRatio = defs?.spacingRatio ?? base.spacingRatio;
        const depthPx = defs?.depthPx ?? base.depthPx;
        const tiltDegrees = defs?.tiltDegrees ?? base.tiltDegrees;
        const perspectivePx = defs?.perspectivePx ?? base.perspectivePx;
        const visibleDistance = defs?.visibleDistance ?? base.visibleDistance;

        return {
            reach: Math.ceil(visibleDistance) + WHOLE,
            place: (placementDefs) => {
                const { distance } = placementDefs;

                return {
                    effect: {
                        perspective: perspectivePx,
                        translate3d: toTranslation(
                            placementDefs,
                            distance * spacingRatio * PERCENT,
                            -Math.abs(distance) * depthPx,
                        ),
                        ...toTurn(placementDefs, -distance * tiltDegrees),
                        opacity: toVisibility(distance, visibleDistance),
                    },
                };
            },
        };
    };

    export const depthWave = createDepthWave();

    export const createCylinder = (defs?: CylinderPlacementDefs): CarouselPlacementRule => {
        const base = CarouselPlacementDefaults.CYLINDER_DEFAULTS;
        const stepDegrees = defs?.stepDegrees ?? base.stepDegrees;
        const perspectivePx = defs?.perspectivePx ?? base.perspectivePx;

        return {
            reach: Math.ceil(QUARTER_TURN_DEGREES / stepDegrees),
            place: (placementDefs) => {
                const along = getAlong(placementDefs);
                const angle = placementDefs.distance * stepDegrees;
                const radians = AngleUtils.toRadians(angle);
                const radius = (along * HALF) / Math.sin(AngleUtils.toRadians(stepDegrees) * HALF);
                const alongPercent = along > 0 ? ((radius * Math.sin(radians)) / along) * PERCENT : 0;

                return {
                    effect: {
                        perspective: perspectivePx,
                        translate3d: toTranslation(placementDefs, alongPercent, radius * (WHOLE - Math.cos(radians))),
                        ...toTurn(placementDefs, -angle),
                        opacity: Math.abs(angle) < QUARTER_TURN_DEGREES ? PERCENT : 0,
                    },
                    layer: -Math.abs(placementDefs.distance),
                };
            },
        };
    };

    export const cylinder = createCylinder();

    export const createFolders = (defs?: FoldersPlacementDefs): CarouselPlacementRule => {
        const base = CarouselPlacementDefaults.FOLDERS_DEFAULTS;
        const offsetRatio = defs?.offsetRatio ?? base.offsetRatio;
        const scaleStep = defs?.scaleStep ?? base.scaleStep;
        const visibleDistance = defs?.visibleDistance ?? base.visibleDistance;

        return {
            reach: Math.ceil(visibleDistance) + WHOLE,
            place: (placementDefs): CarouselPlacement => {
                const { distance, count, isLooping } = placementDefs;

                if (distance < 0 && distance > -WHOLE) {
                    return {
                        effect: {
                            translate3d: toStackTranslation(placementDefs, distance * LEAVING_DROP_RATIO * PERCENT, 0),
                            opacity: (WHOLE + distance) * PERCENT,
                        },
                        layer: WHOLE,
                    };
                }

                const behind = distance < 0 && isLooping ? distance + count : distance;

                if (behind < 0) return { effect: { opacity: 0 } };

                const scale = Math.max(WHOLE - behind * scaleStep, 0) * PERCENT;

                return {
                    effect: {
                        translate3d: toStackTranslation(placementDefs, behind * offsetRatio * PERCENT, 0),
                        scale: [scale, scale],
                        opacity: toVisibility(behind, visibleDistance),
                    },
                    layer: -behind,
                };
            },
        };
    };

    export const folders = createFolders();

    export const createHinge = (defs?: HingePlacementDefs): CarouselPlacementRule => {
        const base = CarouselPlacementDefaults.HINGE_DEFAULTS;
        const offsetRatio = defs?.offsetRatio ?? base.offsetRatio;
        const depthPx = defs?.depthPx ?? base.depthPx;
        const perspectivePx = defs?.perspectivePx ?? base.perspectivePx;
        const visibleDistance = defs?.visibleDistance ?? base.visibleDistance;

        return {
            reach: Math.max(Math.ceil(visibleDistance) + WHOLE, FLIPPED_FADE_DISTANCE),
            place: (placementDefs): CarouselPlacement => {
                const { distance, index, count, orientation } = placementDefs;
                const axis = orientation === "horizontal" ? "row" : "column";
                const origin = orientation === "horizontal" ? LEFT_EDGE : BOTTOM_EDGE;

                if (distance < 0) {
                    return {
                        effect: {
                            perspective: perspectivePx,
                            ...SpineUtils.getTurn(axis, SpineUtils.leaves({ distance, index, count })),
                            opacity: MathUtils.clamp01(FLIPPED_FADE_DISTANCE + distance) * PERCENT,
                        },
                        origin,
                        layer: WHOLE + distance,
                        axis,
                    };
                }

                return {
                    effect: {
                        perspective: perspectivePx,
                        translate3d: toStackTranslation(
                            placementDefs,
                            distance * offsetRatio * PERCENT,
                            -distance * depthPx,
                        ),
                        opacity: toVisibility(distance, visibleDistance),
                    },
                    origin,
                    layer: -distance,
                    axis,
                };
            },
        };
    };

    export const hinge = createHinge();

    export const createConcertina = (defs?: ConcertinaPlacementDefs): CarouselPlacementRule => {
        const base = CarouselPlacementDefaults.CONCERTINA_DEFAULTS;
        const angleDegrees = defs?.angleDegrees ?? base.angleDegrees;
        const faceRatio = defs?.faceRatio ?? base.faceRatio;
        const perspectivePx = defs?.perspectivePx ?? base.perspectivePx;
        const visibleDistance = defs?.visibleDistance ?? base.visibleDistance;
        const scale = faceRatio * PERCENT;

        const toFoldDegrees = (distance: number, index: number, count: number) => {
            const wrapped = MathUtils.wrap(index, count);
            const direction = wrapped % 2 === 0 ? WHOLE : -WHOLE;

            return direction * angleDegrees * MathUtils.clamp01(Math.abs(distance));
        };

        return {
            reach: Math.ceil(visibleDistance) + WHOLE,
            place: (placementDefs): CarouselPlacement => {
                const { distance, index, count } = placementDefs;
                const along = getAlong(placementDefs);
                const face = along * faceRatio;
                const steps = Math.round(distance);
                const step = Math.sign(steps);
                const anchorDistance = distance - steps;

                let alongPx = 0;
                let depthPx = 0;

                for (let walked = 0; walked <= Math.abs(steps); walked++) {
                    const slideDistance = anchorDistance + walked * step;
                    const radians = AngleUtils.toRadians(
                        toFoldDegrees(slideDistance, index - steps + walked * step, count),
                    );
                    const isAnchor = walked === 0;
                    const isLast = walked === Math.abs(steps);
                    const share =
                        isAnchor && isLast
                            ? anchorDistance
                            : isAnchor
                              ? step * HALF + anchorDistance
                              : isLast
                                ? step * HALF
                                : step;

                    alongPx += share * face * Math.cos(radians);
                    depthPx -= share * face * Math.sin(radians);
                }

                return {
                    effect: {
                        perspective: perspectivePx,
                        translate3d: toTranslation(placementDefs, along > 0 ? (alongPx / along) * PERCENT : 0, depthPx),
                        ...toTurn(placementDefs, toFoldDegrees(distance, index, count)),
                        scale: [scale, scale],
                        opacity: toVisibility(distance, visibleDistance),
                    },
                    layer: face > 0 ? depthPx / face : 0,
                };
            },
        };
    };

    export const concertina = createConcertina();

    export const createPaddleWheel = (defs?: PaddleWheelPlacementDefs): CarouselPlacementRule => {
        const base = CarouselPlacementDefaults.PADDLE_WHEEL_DEFAULTS;
        const perspectivePx = defs?.perspectivePx ?? base.perspectivePx;
        const computeAngle = SpineUtils.createRadial({ spanDegrees: defs?.spanDegrees ?? base.spanDegrees });

        return {
            place: ({ distance, index, count, orientation }): CarouselPlacement => {
                const axis = orientation === "horizontal" ? "row" : "column";
                const angle = computeAngle({ distance, index, count });

                return {
                    effect: { perspective: perspectivePx, ...SpineUtils.getTurn(axis, angle) },
                    layer: SpineUtils.getLeadDepth(angle),
                    axis,
                };
            },
        };
    };

    export const paddleWheel = createPaddleWheel();

    export const toPlacementRule = (entry: CarouselPlacementEntry): CarouselPlacementRule => {
        switch (entry.family) {
            case "track":
                return createTrack(entry.defs);
            case "drum":
                return createDrum(entry.defs);
            case "cover_flow":
                return createCoverFlow(entry.defs);
            case "depth_wave":
                return createDepthWave(entry.defs);
            case "cylinder":
                return createCylinder(entry.defs);
            case "folders":
                return createFolders(entry.defs);
            case "hinge":
                return createHinge(entry.defs);
            case "concertina":
                return createConcertina(entry.defs);
            case "paddle_wheel":
                return createPaddleWheel(entry.defs);
        }
    };
}

const TUNINGS: CarouselPlacementEntry[] = [
    { family: "track" },
    { family: "track", defs: { gapRatio: 0.1 } },
    { family: "drum" },
    { family: "drum", defs: { faceCount: 12, faceRatio: 0.6 } },
    { family: "cover_flow" },
    { family: "cover_flow", defs: { visibleDistance: 2, angleDegrees: 40 } },
    { family: "depth_wave" },
    { family: "depth_wave", defs: { spacingRatio: 0.4, tiltDegrees: 20 } },
    { family: "cylinder" },
    { family: "cylinder", defs: { stepDegrees: 40 } },
    { family: "folders" },
    { family: "folders", defs: { offsetRatio: 0.2 } },
    { family: "hinge" },
    { family: "hinge", defs: { depthPx: 60 } },
    { family: "concertina" },
    { family: "concertina", defs: { angleDegrees: 60, faceRatio: 0.4 } },
    { family: "paddle_wheel" },
    { family: "paddle_wheel", defs: { spanDegrees: 180 } },
];

const DISTANCES = [-6, -3.5, -2, -1, -0.75, -0.5, -0.25, 0, 0.1, 0.5, 0.99, 1, 1.5, 2.25, 4, 7];

const CASES = TUNINGS.flatMap((entry) =>
    (["horizontal", "vertical"] as const).flatMap((orientation) =>
        [true, false].flatMap((isLooping) =>
            [2, 5, 8].map(
                (count) =>
                    [entry.family, JSON.stringify(entry.defs ?? {}), entry, orientation, isLooping, count] as const,
            ),
        ),
    ),
);

describe("a carousel without groups", () => {
    it.each(CASES)(
        "%s %s places every slide as before, %s, looping %s, %s slides",
        (_family, _tuning, entry, orientation, isLooping, count) => {
            const rule = CarouselPlacementUtils.toPlacementRule(entry);
            const reference = ReferencePlacements.toPlacementRule(entry);

            expect(rule.reach).toBe(reference.reach);

            for (const distance of DISTANCES) {
                for (let index = 0; index < count; index++) {
                    const defs = {
                        distance,
                        index,
                        count,
                        size: { width: 640, height: 180 },
                        orientation,
                        isLooping,
                        group: CarouselUtils.toSlideGroup(distance, index, count),
                    };

                    expect(rule.place(defs)).toEqual(reference.place(defs));
                }
            }
        },
    );
});
