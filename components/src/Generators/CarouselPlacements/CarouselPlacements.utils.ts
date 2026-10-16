import { MathUtils } from "@thewaver/ss-utils";

import type {
    CarouselPlacement,
    CarouselPlacementDefs,
    CarouselPlacementRule,
} from "../../Essentials/Carousel/Carousel.types";
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

const PERCENT = 100;
const WHOLE = 1;
const HALF = 0.5;
const FULL_TURN_DEGREES = 360;
const HALF_TURN_DEGREES = 180;
const QUARTER_TURN_DEGREES = 90;
const LEVEL_SPINE = "column";
const SMALLEST_RING = 3;
const BOTTOM_EDGE = { x: 0.5, y: 1 };
const LEAVING_DROP_RATIO = 0.6;
const FLIPPED_FADE_DISTANCE = 2;

const toRadians = (degrees: number) => (degrees * Math.PI) / HALF_TURN_DEGREES;

/** How long the carousel's box is along the way it runs, which is the length a slide spans. */
const getAlong = (defs: CarouselPlacementDefs) =>
    defs.orientation === "horizontal" ? defs.size.width : defs.size.height;

/** A translation along the way the carousel runs, as `translate3d`'s three values: a share of the box each way, then depth. */
const toTranslation = (defs: CarouselPlacementDefs, alongPercent: number, depthPx: number) =>
    defs.orientation === "horizontal" ? [alongPercent, 0, depthPx] : [0, alongPercent, depthPx];

/**
 * A turn about the axis across the way the carousel runs, so a slide on the far side of the middle faces back towards
 * it. `rotateX` turns the other way round from `rotateY` for the same picture, so its sign is flipped.
 */
const toTurn = (defs: CarouselPlacementDefs, degrees: number) =>
    defs.orientation === "horizontal" ? { rotateY: degrees } : { rotateX: -degrees };

/** Fades a slide out once it is further than `visibleDistance` from the one showing, over one slide's worth of distance. */
const toVisibility = (distance: number, visibleDistance: number) =>
    MathUtils.clamp01(visibleDistance + WHOLE - Math.abs(distance)) * PERCENT;

/**
 * The placement rules this library ships for `Carousel`, as factories a consumer can tune or take as they are.
 *
 * A rule places one slide from its distance and says how far either side it draws — see `CarouselPlacementRule`. Every rule here
 * reads the carousel's box for its lengths, so it fits a carousel of any size, and the way the carousel runs, so each
 * works across and up and down. Distances arrive fractional while the carousel moves, so every rule is continuous in
 * them. Each says how far either side of the slide showing it draws, so a looping carousel with too few slides repeats
 * them until that many fit; the paddle wheel spreads however many slides there are round its turn, so it says nothing.
 */
export namespace CarouselPlacementUtils {
    /**
     * Slides in a line, each one box along from the last: a slide strip.
     *
     * @param defs `gapRatio`, the space between two slides as a share of the box.
     * @returns The rule, ready to hand to `placement`.
     */
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

    /** {@link createTrack} with its defaults. */
    export const track = createTrack();

    /**
     * Slides on the faces of a drum, turning about the axis across the way the carousel runs.
     *
     * The ring's depth comes from the box: its faces are as long as the box, or the share of it `faceRatio` gives, and
     * meet edge to edge. Faces shorter than the box let several show inside it at once, rising and falling round the
     * drum, where faces as long as the box show only the one at the front. By default the drum has one face per slide, so a carousel of more slides is a wider ring and one of few slides turns in big steps
     * that hardly read as a drum. `faceCount` fixes the number of faces instead, the way a picker wheel has the same
     * curve whatever it lists: each slide sits on the face as far from the front as the slide is from the one
     * showing, and a slide more than half a turn away is not drawn, so a long list never crowds the drum and the
     * faces turning out of sight are the ones the next slides arrive on. Only that hidden slide is given an opacity:
     * the carousel draws opacity as a filter, and a filter flattens the slide, which would show its front mirrored
     * where its back belongs. A list that does not loop leaves the faces
     * past its ends empty. A face turned away shows the slide's back, drawn by `renderSlideBack`.
     *
     * @param defs `perspectivePx`, how far away the viewer sits; `faceCount`, how many faces the drum has, or `0`
     * for one per slide; `faceRatio`, how long each face is as a share of the box.
     * @returns The rule, ready to hand to `placement`.
     */
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
                const radians = toRadians(angle);
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

    /** {@link createDrum} with its defaults. */
    export const drum = createDrum();

    /**
     * Cover flow: the slide showing faces the viewer, and the rest stand turned towards it on either side, stacked
     * close and set back.
     *
     * @param defs `spacingRatio` between side slides and `gapRatio` beside the one showing, both shares of the box;
     * `angleDegrees` the side slides turn by; `depthPx` how far back they stand; `perspectivePx` how far away the
     * viewer sits; `visibleDistance` how many slides either side stay drawn before the rest fade.
     * @returns The rule, ready to hand to `placement`.
     */
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

    /** {@link createCoverFlow} with its defaults. */
    export const coverFlow = createCoverFlow();

    /**
     * A depth wave: slides in a line that sinks away from the viewer on either side of the one showing, each turned a
     * little towards the middle.
     *
     * @param defs `spacingRatio` between slides as a share of the box; `depthPx` how far back each step sinks;
     * `tiltDegrees` how far each step turns; `perspectivePx` how far away the viewer sits; `visibleDistance` how many
     * slides either side stay drawn.
     * @returns The rule, ready to hand to `placement`.
     */
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

    /** {@link createDepthWave} with its defaults. */
    export const depthWave = createDepthWave();

    /**
     * Slides bent round the inside of a cylinder: the one showing furthest away, the rest curving in towards the
     * viewer on either side and turned to face the middle.
     *
     * Neighboring slides meet edge to edge; a slide that would turn past side-on is not drawn.
     *
     * @param defs `stepDegrees`, how far round the cylinder one slide reaches; `perspectivePx` how far away the
     * viewer sits.
     * @returns The rule, ready to hand to `placement`.
     */
    export const createCylinder = (defs?: CylinderPlacementDefs): CarouselPlacementRule => {
        const base = CarouselPlacementDefaults.CYLINDER_DEFAULTS;
        const stepDegrees = defs?.stepDegrees ?? base.stepDegrees;
        const perspectivePx = defs?.perspectivePx ?? base.perspectivePx;

        return {
            reach: Math.ceil(QUARTER_TURN_DEGREES / stepDegrees),
            place: (placementDefs) => {
                const along = getAlong(placementDefs);
                const angle = placementDefs.distance * stepDegrees;
                const radians = toRadians(angle);
                const radius = (along * HALF) / Math.sin(toRadians(stepDegrees) * HALF);
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

    /** {@link createCylinder} with its defaults. */
    export const cylinder = createCylinder();

    /**
     * A stack of folders: the slide showing in front, the ones to come rising behind it, each a little smaller. The
     * front one drops away and fades as the carousel moves on, and on a looping carousel it goes to the back.
     *
     * @param defs `offsetRatio`, how far each folder behind rises as a share of the box; `scaleStep` how much smaller
     * each is; `visibleDistance` how many stay drawn behind the front one.
     * @returns The rule, ready to hand to `placement`.
     */
    export const createFolders = (defs?: FoldersPlacementDefs): CarouselPlacementRule => {
        const base = CarouselPlacementDefaults.FOLDERS_DEFAULTS;
        const offsetRatio = defs?.offsetRatio ?? base.offsetRatio;
        const scaleStep = defs?.scaleStep ?? base.scaleStep;
        const visibleDistance = defs?.visibleDistance ?? base.visibleDistance;

        return {
            reach: Math.ceil(visibleDistance) + WHOLE,
            place: ({ distance, count, isLooping }): CarouselPlacement => {
                if (distance < 0 && distance > -WHOLE) {
                    return {
                        effect: {
                            translateY: -distance * LEAVING_DROP_RATIO * PERCENT,
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
                        translateY: -behind * offsetRatio * PERCENT,
                        scale: [scale, scale],
                        opacity: toVisibility(behind, visibleDistance),
                    },
                    layer: -behind,
                };
            },
        };
    };

    /** {@link createFolders} with its defaults. */
    export const folders = createFolders();

    /**
     * Cards that flip down about their bottom edge: the one showing stands upright, the ones to come wait behind it,
     * and the one left behind turns over towards the viewer and lies face down, showing its back.
     *
     * The card turning over is a leaf on a level spine, as a wall calendar's page is: it turns by
     * `SpineUtils.leaves` about its bottom edge.
     *
     * @param defs `offsetRatio`, how far each waiting card peeks above the one in front as a share of the box;
     * `depthPx` how far back each stands; `perspectivePx` how far away the viewer sits; `visibleDistance` how many
     * stay drawn behind.
     * @returns The rule, ready to hand to `placement`.
     */
    export const createHinge = (defs?: HingePlacementDefs): CarouselPlacementRule => {
        const base = CarouselPlacementDefaults.HINGE_DEFAULTS;
        const offsetRatio = defs?.offsetRatio ?? base.offsetRatio;
        const depthPx = defs?.depthPx ?? base.depthPx;
        const perspectivePx = defs?.perspectivePx ?? base.perspectivePx;
        const visibleDistance = defs?.visibleDistance ?? base.visibleDistance;

        return {
            reach: Math.max(Math.ceil(visibleDistance) + WHOLE, FLIPPED_FADE_DISTANCE),
            place: ({ distance, index, count }): CarouselPlacement => {
                if (distance < 0) {
                    return {
                        effect: {
                            perspective: perspectivePx,
                            ...SpineUtils.getTurn(LEVEL_SPINE, SpineUtils.leaves({ distance, index, count })),
                            opacity: MathUtils.clamp01(FLIPPED_FADE_DISTANCE + distance) * PERCENT,
                        },
                        origin: BOTTOM_EDGE,
                        layer: WHOLE + distance,
                        axis: "column",
                    };
                }

                return {
                    effect: {
                        perspective: perspectivePx,
                        translate3d: [0, -distance * offsetRatio * PERCENT, -distance * depthPx],
                        opacity: toVisibility(distance, visibleDistance),
                    },
                    origin: BOTTOM_EDGE,
                    layer: -distance,
                    axis: "column",
                };
            },
        };
    };

    /** {@link createHinge} with its defaults. */
    export const hinge = createHinge();

    /**
     * A concertina: the slide showing lies flat, facing the viewer, and the rest fold back and forth either side of it
     * like an accordion's bellows seen from the front, each one's edges meeting its neighbors'.
     *
     * Every slide folds the same way each time, the way a crease in paper does: slides at even positions turn one way
     * and slides at odd positions the other, so on one step the folds beside the slide showing go away from the viewer
     * and on the next they come towards it. Stepping only unfolds the slide arriving in the middle and folds the one
     * leaving it; the rest keep their angle and slide along. A slide's place is worked out by walking the fold from the
     * middle of the box out to it, so neighbors meet at every distance, fractional ones included. A looping carousel
     * with an odd number of slides cannot alternate all the way round, so two slides meeting at the wrap fold the same
     * way, which sits on the far side from the slide showing. Every slide is shrunk to `faceRatio` of the box, so the
     * folds either side fit inside it rather than running off its edges, and the slide's content needs no narrower
     * frame of its own.
     *
     * @param defs `angleDegrees`, how far each folded slide turns; `faceRatio`, how long each slide is as a share of the
     * box; `perspectivePx`, how far away the viewer sits; `visibleDistance`, how many slides either side stay drawn
     * before the rest fade.
     * @returns The rule, ready to hand to `placement`.
     */
    export const createConcertina = (defs?: ConcertinaPlacementDefs): CarouselPlacementRule => {
        const base = CarouselPlacementDefaults.CONCERTINA_DEFAULTS;
        const angleDegrees = defs?.angleDegrees ?? base.angleDegrees;
        const faceRatio = defs?.faceRatio ?? base.faceRatio;
        const perspectivePx = defs?.perspectivePx ?? base.perspectivePx;
        const visibleDistance = defs?.visibleDistance ?? base.visibleDistance;
        const scale = faceRatio * PERCENT;

        const toFoldDegrees = (distance: number, index: number, count: number) => {
            const wrapped = ((index % count) + count) % count;
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
                    const radians = toRadians(toFoldDegrees(slideDistance, index - steps + walked * step, count));
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

    /** {@link createConcertina} with its defaults. */
    export const concertina = createConcertina();

    /**
     * A paddle wheel: slides standing round a spine through the middle of the carousel's box, spaced evenly, each
     * swung out to its own angle the way `Spine` swings its faces.
     *
     * Every slide is the whole box turned about its middle line, so the slide has to paint only its leading half — the
     * right half on a carousel running across, the top half on one running up and down — with a gap at the spine for
     * the wheel's hollow core, and its back the other half. The slides lying flat on either side face the viewer
     * widest, the ones pointing at the viewer are seen edge-on, and the perspective draws the far ones smaller. The
     * painted halves never cross, so the nearer one is stacked over the further.
     *
     * @param defs `spanDegrees`, how far round the wheel the slides reach between them; `perspectivePx` how far away the
     * viewer sits.
     * @returns The rule, ready to hand to `placement`.
     */
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

    /** {@link createPaddleWheel} with its defaults. */
    export const paddleWheel = createPaddleWheel();

    /**
     * The rule a sample entry names, built with the entry's own tuning.
     *
     * @param entry One of the samples, or any entry of the same shape.
     * @returns The rule, ready to hand to `placement`.
     */
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
