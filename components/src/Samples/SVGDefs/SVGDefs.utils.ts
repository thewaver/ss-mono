import { Color, MathUtils, type Point2d, RandomUtils, type Size2d, type Store, StoreUtils } from "@thewaver/ss-utils";

import type { PointerReading } from "../../Abstracts/PointerTracker/PointerTracker.types";
import type { CycleColorKey, SVGDefsColors } from "./SVGDefs.types";

const NO_CONSUMERS = 0;
const TRANSPARENT_ALPHA = 0;
const FULL_STOP = 100;
const POINTER_FADE_START_RATIO = 1;
const POINTER_FADE_END_RATIO = 2;
const CYCLE_COLOR_KEYS: CycleColorKey[] = ["primary", "secondary", "tertiary"];
const FRAME_MS = 1000 / 60;
const MAX_FRAMES_PER_STEP = 4;
const SWARM_MIN_RADIUS = 0.35;
const SWARM_MIN_PERIOD = 0.45;
const SWARM_SPOT_RADIUS_SHARE = 0.5;
const SWARM_MERGE_BLUR_SHARE = 0.45;

export namespace SVGDefsUtils {
    export const DEBUG_SEAMS = false;

    /**
     * The color stops of a gradient that repeats a run of colors a given number of times.
     *
     * A flowing gradient reads as a band per color per repeat, and it needs one stop more than that so the
     * last band closes on the color the first one opened with — which is what lets the whole strip slide
     * without a seam. Callers state the repeats rather than the stops for that reason: the off-by-one is the
     * helper's to remember.
     *
     * @param keys The run of colors to repeat, in order.
     * @param repeats How many times the run appears across the gradient.
     * @returns `keys.length * repeats + 1` color keys, opening and closing on the first.
     */
    export const getCycleStopKeys = (keys: CycleColorKey[], repeats: number) =>
        Array.from({ length: keys.length * repeats + 1 }, (_unused, index) => keys[index % keys.length]);

    export const getCycleWalk = (colors: SVGDefsColors, key: CycleColorKey) => {
        const start = CYCLE_COLOR_KEYS.indexOf(key);

        return [...CYCLE_COLOR_KEYS.slice(start), ...CYCLE_COLOR_KEYS.slice(0, start), key].map(
            (walkKey) => colors[walkKey],
        );
    };

    /**
     * The five color stops of a band that fades out symmetrically either side of its core.
     *
     * Transparent at both ends, the falloff alpha a spread either side of the core, and the core alpha at
     * the middle — the ramp every band sample draws. It takes the four numbers already resolved rather than
     * an options object, so each sample keeps its own defaults and two samples asking for different cores
     * cannot end up sharing one.
     *
     * @param color Any CSS color; the stops are built with `rgb(from …)`, so a named color works.
     * @param defs.coreStop Where the core sits, `0`–`100`.
     * @param defs.coreAlpha How opaque the core is.
     * @param defs.falloffSpread How far either side of the core the falloff stops sit.
     * @param defs.falloffAlpha How opaque the band is at those falloff stops.
     * @returns Five stops in ascending order, the first with no `stop` of its own so it anchors at the start.
     */
    export const getFalloffStops = (
        color: string,
        defs: { coreStop: number; coreAlpha: number; falloffSpread: number; falloffAlpha: number },
    ) => [
        { value: `rgb(from ${color} r g b / 0)` },
        { value: `rgb(from ${color} r g b / ${defs.falloffAlpha})`, stop: defs.coreStop - defs.falloffSpread },
        { value: `rgb(from ${color} r g b / ${defs.coreAlpha})`, stop: defs.coreStop },
        { value: `rgb(from ${color} r g b / ${defs.falloffAlpha})`, stop: defs.coreStop + defs.falloffSpread },
        { value: `rgb(from ${color} r g b / 0)`, stop: FULL_STOP },
    ];

    /**
     * Points a def at a filter that another def in the same set already declares.
     *
     * `Shape` renders every def's `renderDefsElement` and references its `id`, so a set whose entries all
     * want the same filter would otherwise emit that filter once per entry — same id, every copy after the
     * first inert. This returns an entry that carries the id and draws nothing, so one declaration serves
     * the whole set.
     *
     * @param filter The filter a sibling def declares, or `undefined` when there is none to share.
     * @returns A reference to it, or `undefined` so the caller can hand the result straight to `filter`.
     */
    export const getSharedFilter = (filter: { id: string } | undefined) =>
        filter && { id: filter.id, renderDefsElement: () => undefined };

    export const getBaseBackgroundColor = (defs: { colors: SVGDefsColors }) =>
        `hsl(from ${defs.colors.background} h s calc(l * 1.5) / 25%)`;

    export const getBaseBorderColor = (defs: { colors: SVGDefsColors }) =>
        `hsl(from ${defs.colors.background} h s calc(l * 1.5) / 50%)`;

    export const getTransparentColor = (color: string) =>
        Color.Hex.isHex(color)
            ? Color.RGBA.toCss({ ...Color.Hex.toRgb(color), a: TRANSPARENT_ALPHA })
            : `rgb(from ${color} r g b / 0)`;

    export const getPointerFade = (reading: PointerReading, isPointerPresent: boolean) =>
        isPointerPresent
            ? MathUtils.clamp01(
                  MathUtils.normalize(reading.edgeRatio, POINTER_FADE_END_RATIO, POINTER_FADE_START_RATIO),
              )
            : 0;

    /**
     * Moves a point one frame along a damped spring towards a target, for a sample whose shape chases the pointer.
     *
     * The step is written per frame at sixty frames a second and scaled by the frame's real length, so a slow screen
     * chases at the same speed in time rather than in frames.
     *
     * @param position Where the point is.
     * @param velocity How far it moved last frame.
     * @param target Where it is pulled.
     * @param frameMs How long the frame was.
     * @param stiffness How strongly it is pulled, as a share of the distance per frame.
     * @param damping How much of its speed it keeps from one frame to the next, `0` to `1`.
     * @returns The new position and velocity.
     */
    export const stepSpring = (
        position: Point2d,
        velocity: Point2d,
        target: Point2d,
        frameMs: number,
        stiffness: number,
        damping: number,
    ) => {
        const frames = Math.min(frameMs / FRAME_MS, MAX_FRAMES_PER_STEP);
        const keep = damping ** frames;
        const next = {
            x: (velocity.x + (target.x - position.x) * stiffness * frames) * keep,
            y: (velocity.y + (target.y - position.y) * stiffness * frames) * keep,
        };

        return { position: { x: position.x + next.x * frames, y: position.y + next.y * frames }, velocity: next };
    };

    /**
     * Where one spot of a swarm wants to be, wandering round the point on a path of its own.
     *
     * Each spot circles at its own radius and speed, set by its place in the swarm, so the spots never line up and
     * never all cross the point at once. The circle is squashed to the box's proportions, since a position is a share
     * of the box.
     *
     * @param point Where the swarm gathers, as a share of the box.
     * @param index Which spot, from `0`.
     * @param count How many spots there are.
     * @param timeMs The frame time.
     * @param wanderRatio How far a spot strays, as a share of the box.
     * @param wanderMs How long the slowest spot takes to go round once.
     */
    export const computeSwarmTarget = (
        point: Point2d,
        index: number,
        count: number,
        timeMs: number,
        wanderRatio: number,
        wanderMs: number,
    ): Point2d => {
        const share = count > 1 ? index / (count - 1) : 0;
        const radius = wanderRatio * (SWARM_MIN_RADIUS + (1 - SWARM_MIN_RADIUS) * share);
        const turns = timeMs / (wanderMs * (SWARM_MIN_PERIOD + (1 - SWARM_MIN_PERIOD) * (1 - share)));
        const angle = (turns + index / Math.max(count, 1)) * Math.PI * 2 * (index % 2 === 0 ? 1 : -1);

        return { x: point.x + Math.cos(angle) * radius, y: point.y + Math.sin(angle) * radius };
    };

    /**
     * The color matrix that turns a swarm's blurred spots into one liquid shape: colors kept, opacity steepened so
     * the soft blur becomes a hard edge, and two spots blurred into each other join along a smooth neck instead of
     * glowing through one another. Paired with {@link computeSwarmMergeBlur}.
     */
    export const SWARM_MERGE_MATRIX = "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -7";

    /**
     * How big each spot of a swarm is drawn, in pixels.
     *
     * @param size The painted element's size.
     * @param spotScale How big a spot is, as a share of the element's smaller side, or of each side when it is not
     * circular.
     * @param isCircular Whether spots stay round in a box that is not square, rather than stretching with it.
     * @returns The spot's radius across and down.
     */
    export const computeSwarmRadii = (size: Size2d, spotScale: number, isCircular: boolean): Point2d => {
        const side = Math.min(size.width, size.height);

        return isCircular
            ? { x: side * spotScale * SWARM_SPOT_RADIUS_SHARE, y: side * spotScale * SWARM_SPOT_RADIUS_SHARE }
            : {
                  x: size.width * spotScale * SWARM_SPOT_RADIUS_SHARE,
                  y: size.height * spotScale * SWARM_SPOT_RADIUS_SHARE,
              };
    };

    /**
     * How far a swarm's spots are blurred before {@link SWARM_MERGE_MATRIX} sharpens them again, which decides how
     * near two spots have to come before they join: a share of the smaller radius, so the neck between them scales
     * with the spots.
     *
     * @param radii The spot's radius across and down, from {@link computeSwarmRadii}.
     */
    export const computeSwarmMergeBlur = (radii: Point2d) => Math.min(radii.x, radii.y) * SWARM_MERGE_BLUR_SHARE;

    export const offsetDiagonally = (v: number, angle: number) => {
        const rad = (angle * Math.PI) / 180;

        return { x: v * Math.cos(rad), y: v * Math.sin(rad) };
    };

    export const projectBoxRatioOntoAngle = (ratio: Point2d, angle: number) => {
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad);
        const y = Math.sin(rad);

        return ((ratio.x - 0.5) * x + (ratio.y - 0.5) * y) / (Math.abs(x) + Math.abs(y));
    };

    export const getRandomValuesWithSplitControl = (
        mutableSplitValuesCache: Record<string, string>,
        index: { row: number; col: number },
        cellCount: { rows: number; cols: number },
        isSplit: boolean,
    ) => {
        let values = RandomUtils.get01ValueString(8);

        if (isSplit) {
            if (index.col === cellCount.cols - 1) {
                values = mutableSplitValuesCache[`row${index.row}`] ?? values;
            }
            if (index.row === cellCount.rows - 1) {
                values = mutableSplitValuesCache[`col${index.col}`] ?? values;
            }
            if (index.col === 0) {
                mutableSplitValuesCache[`row${index.row}`] = values;
            }
            if (index.row === 0) {
                mutableSplitValuesCache[`col${index.col}`] = values;
            }
        }

        return values;
    };

    /**
     * A frame clock shared by every sample that animates off the pointer rather than off a SMIL timeline.
     *
     * It runs only while somebody needs it: each consumer calls `retain` and the function it returns when it goes
     * away, and each pointer movement calls `keepAwake`. With nobody retaining it, or once the grace period has
     * passed since the last wake, the clock stops asking for frames — so a trail that has finished fading costs
     * nothing, and the next movement starts it again. The framework halves read `frameMs` through their own store
     * helper and tie `retain` to their component's lifetime.
     *
     * @param graceMs How long the clock keeps running after the last wake, long enough for whatever was left
     * behind to finish fading.
     * @returns `frameMs`, a store of the current frame time; `keepAwake`; and `retain`, which counts one more
     * consumer and returns the call that counts it out again. Calling that twice counts it out once.
     */
    export const createClock = (graceMs: number) => {
        const frameMs = StoreUtils.create(performance.now());

        let frameId: ReturnType<typeof requestAnimationFrame> | undefined;
        let lastWakeMs = 0;
        let consumerCount = NO_CONSUMERS;

        const advance = () => {
            const nowMs = performance.now();

            frameMs.set(nowMs);

            if (consumerCount === NO_CONSUMERS || nowMs - lastWakeMs > graceMs) {
                frameId = undefined;

                return;
            }

            frameId = requestAnimationFrame(advance);
        };

        return {
            frameMs: frameMs as Store<number>,
            keepAwake: () => {
                lastWakeMs = performance.now();

                if (frameId !== undefined) return;

                frameId = requestAnimationFrame(advance);
            },
            retain: () => {
                let isRetained = true;

                consumerCount += 1;

                return () => {
                    if (!isRetained) return;

                    isRetained = false;
                    consumerCount -= 1;
                };
            },
        };
    };
}
