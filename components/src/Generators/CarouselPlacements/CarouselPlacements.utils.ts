import { MathUtils } from "@thewaver/ss-utils";

import type {
    CarouselPlacement,
    CarouselPlacementDefs,
    CarouselPlacementFn,
} from "../../Essentials/Carousel/Carousel.types";
import { SpineUtils } from "../../Primitives/Spine/Spine.utils";
import { CarouselPlacementDefaults } from "./CarouselPlacements.const";
import type {
    CarouselPlacementEntry,
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
 * A rule is a function from one slide's distance to where it is drawn — see `CarouselPlacementFn`. Every rule here
 * reads the carousel's box for its lengths, so it fits a carousel of any size, and the way the carousel runs, so each
 * works across and up and down. Distances arrive fractional while the carousel moves, so every rule is continuous in
 * them.
 */
export namespace CarouselPlacementUtils {
    /**
     * Slides in a line, each one box along from the last: a slide strip.
     *
     * @param defs `gapRatio`, the space between two slides as a share of the box.
     * @returns The rule, ready to hand to `computePlacement`.
     */
    export const createTrack = (defs?: TrackPlacementDefs): CarouselPlacementFn => {
        const gapRatio = defs?.gapRatio ?? CarouselPlacementDefaults.TRACK_DEFAULTS.gapRatio;

        return (placementDefs) => {
            const along = placementDefs.distance * (WHOLE + gapRatio) * PERCENT;

            return {
                effect: placementDefs.orientation === "horizontal" ? { translateX: along } : { translateY: along },
            };
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
     * @returns The rule, ready to hand to `computePlacement`.
     */
    export const createDrum = (defs?: DrumPlacementDefs): CarouselPlacementFn => {
        const perspectivePx = defs?.perspectivePx ?? CarouselPlacementDefaults.DRUM_DEFAULTS.perspectivePx;
        const faceCount = defs?.faceCount ?? CarouselPlacementDefaults.DRUM_DEFAULTS.faceCount;
        const faceRatio = defs?.faceRatio ?? CarouselPlacementDefaults.DRUM_DEFAULTS.faceRatio;

        return (placementDefs) => {
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
     * @returns The rule, ready to hand to `computePlacement`.
     */
    export const createCoverFlow = (defs?: CoverFlowPlacementDefs): CarouselPlacementFn => {
        const base = CarouselPlacementDefaults.COVER_FLOW_DEFAULTS;
        const spacingRatio = defs?.spacingRatio ?? base.spacingRatio;
        const gapRatio = defs?.gapRatio ?? base.gapRatio;
        const angleDegrees = defs?.angleDegrees ?? base.angleDegrees;
        const depthPx = defs?.depthPx ?? base.depthPx;
        const perspectivePx = defs?.perspectivePx ?? base.perspectivePx;
        const visibleDistance = defs?.visibleDistance ?? base.visibleDistance;

        return (placementDefs) => {
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
     * @returns The rule, ready to hand to `computePlacement`.
     */
    export const createDepthWave = (defs?: DepthWavePlacementDefs): CarouselPlacementFn => {
        const base = CarouselPlacementDefaults.DEPTH_WAVE_DEFAULTS;
        const spacingRatio = defs?.spacingRatio ?? base.spacingRatio;
        const depthPx = defs?.depthPx ?? base.depthPx;
        const tiltDegrees = defs?.tiltDegrees ?? base.tiltDegrees;
        const perspectivePx = defs?.perspectivePx ?? base.perspectivePx;
        const visibleDistance = defs?.visibleDistance ?? base.visibleDistance;

        return (placementDefs) => {
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
     * @returns The rule, ready to hand to `computePlacement`.
     */
    export const createCylinder = (defs?: CylinderPlacementDefs): CarouselPlacementFn => {
        const base = CarouselPlacementDefaults.CYLINDER_DEFAULTS;
        const stepDegrees = defs?.stepDegrees ?? base.stepDegrees;
        const perspectivePx = defs?.perspectivePx ?? base.perspectivePx;

        return (placementDefs) => {
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
     * @returns The rule, ready to hand to `computePlacement`.
     */
    export const createFolders = (defs?: FoldersPlacementDefs): CarouselPlacementFn => {
        const base = CarouselPlacementDefaults.FOLDERS_DEFAULTS;
        const offsetRatio = defs?.offsetRatio ?? base.offsetRatio;
        const scaleStep = defs?.scaleStep ?? base.scaleStep;
        const visibleDistance = defs?.visibleDistance ?? base.visibleDistance;

        return ({ distance, count, isLooping }): CarouselPlacement => {
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
     * @returns The rule, ready to hand to `computePlacement`.
     */
    export const createHinge = (defs?: HingePlacementDefs): CarouselPlacementFn => {
        const base = CarouselPlacementDefaults.HINGE_DEFAULTS;
        const offsetRatio = defs?.offsetRatio ?? base.offsetRatio;
        const depthPx = defs?.depthPx ?? base.depthPx;
        const perspectivePx = defs?.perspectivePx ?? base.perspectivePx;
        const visibleDistance = defs?.visibleDistance ?? base.visibleDistance;

        return ({ distance, index, count }): CarouselPlacement => {
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
        };
    };

    /** {@link createHinge} with its defaults. */
    export const hinge = createHinge();

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
     * @returns The rule, ready to hand to `computePlacement`.
     */
    export const createPaddleWheel = (defs?: PaddleWheelPlacementDefs): CarouselPlacementFn => {
        const base = CarouselPlacementDefaults.PADDLE_WHEEL_DEFAULTS;
        const perspectivePx = defs?.perspectivePx ?? base.perspectivePx;
        const computeAngle = SpineUtils.createRadial({ spanDegrees: defs?.spanDegrees ?? base.spanDegrees });

        return ({ distance, index, count, orientation }): CarouselPlacement => {
            const axis = orientation === "horizontal" ? "row" : "column";
            const angle = computeAngle({ distance, index, count });

            return {
                effect: { perspective: perspectivePx, ...SpineUtils.getTurn(axis, angle) },
                layer: SpineUtils.getLeadDepth(angle),
                axis,
            };
        };
    };

    /** {@link createPaddleWheel} with its defaults. */
    export const paddleWheel = createPaddleWheel();

    /**
     * The rule a sample entry names, built with the entry's own tuning.
     *
     * @param entry One of the samples, or any entry of the same shape.
     * @returns The rule, ready to hand to `computePlacement`.
     */
    export const toPlacementFn = (entry: CarouselPlacementEntry): CarouselPlacementFn => {
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
            case "paddle_wheel":
                return createPaddleWheel(entry.defs);
        }
    };
}
