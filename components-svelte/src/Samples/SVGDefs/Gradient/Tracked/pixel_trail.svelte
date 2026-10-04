<svelte:options namespace="svg" />

<script module lang="ts">
    import { untrack } from "svelte";

    import {
        type CycleColorKey,
        type GradientPixelTrailSampleOpts,
        SVGDefsUtils,
        TrackedGradientDefaults,
        type TrackedGradientElementDefs,
    } from "@thewaver/ss-components";
    import type { Index2d, Point2d, Size2d } from "@thewaver/ss-utils";

    import { PointerTrackerSvelteUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerSvelte.utils.svelte.js";
    import { SVGGradientDefsSvelteUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsSvelte.utils.js";
    import Markup from "../../../../Utils/Markup.svelte";
    import { markup } from "../../../../Utils/markupUtils.js";
    import type { TrackedGradientConfig } from "../../SVGDefsSvelte.types.js";
    import { SVGDefsSvelteUtils } from "../../SVGDefsSvelte.utils.svelte.js";
    import SVGSampleClipPath from "../../SVGSampleClipPath.svelte";
    import PixelTrail from "./pixel_trail.svelte";

    type PixelTrailStamp = Index2d & {
        bornMs: number;
    };

    type PixelTrailDefaults = typeof TrackedGradientDefaults.PIXEL_TRAIL_DEFAULTS;

    type PixelTrailProps = {
        id: string;
        element: HTMLElement | undefined;
        defs: TrackedGradientElementDefs;
        colorKeys: CycleColorKey[];
        defaults: PixelTrailDefaults;
        opts?: GradientPixelTrailSampleOpts;
    };

    const STAMP_COUNT = 48;
    const GRACE_MS = 100;
    const NO_FADE = 0;
    const EMPTY_STAMPS: (PixelTrailStamp | undefined)[] = Array.from({ length: STAMP_COUNT }, () => undefined);
    const EMPTY_SQUARE = { x: 0, y: 0, width: 0, height: 0 };
    const EMPTY_COLORS = [{ value: "transparent" }, { value: "transparent", stop: 100 }];

    const CYCLING_DEFAULTS = TrackedGradientDefaults.PIXEL_TRAIL_CYCLING_DEFAULTS;

    const RENDERED_ELSEWHERE = () => undefined;

    const clock = SVGDefsSvelteUtils.createClock(GRACE_MS);

    const getGradientId = (id: string, index: number) => `gradient${index + 1}-${id}`;
    const getClipId = (id: string, index: number) => `clip${index + 1}-${id}`;

    const getIsInside = (ratio: Point2d) => ratio.x >= 0 && ratio.x <= 1 && ratio.y >= 0 && ratio.y <= 1;

    const computeSquare = (stamp: PixelTrailStamp | undefined, size: Size2d, squareSize: number) =>
        !stamp || !size.width || !size.height
            ? EMPTY_SQUARE
            : {
                  x: (stamp.col * squareSize) / size.width,
                  y: (stamp.row * squareSize) / size.height,
                  width: squareSize / size.width,
                  height: squareSize / size.height,
              };

    export const createPixelTrailSample =
        (colorKeys: CycleColorKey[], defaults: PixelTrailDefaults) =>
        (opts?: GradientPixelTrailSampleOpts): TrackedGradientConfig => ({
            computeSVGDefs: (id, __, element, defs) => {
                const sharedBlur = SVGDefsSvelteUtils.getBaseBlur(id, defs);
                const sharedBlurRef = SVGDefsUtils.getSharedFilter(sharedBlur);

                return [
                    { color: SVGDefsUtils.getBaseBorderColor(defs) },
                    ...Array.from({ length: STAMP_COUNT }, (_unused, index) => ({
                        gradientOrPattern: {
                            id: getGradientId(id, index),
                            renderDefsElement:
                                index === 0
                                    ? () => markup(PixelTrail, { id, element, defs, colorKeys, defaults, opts })
                                    : RENDERED_ELSEWHERE,
                        },
                        clipPath: {
                            id: getClipId(id, index),
                            renderDefsElement: RENDERED_ELSEWHERE,
                        },
                        filter: index === 0 ? sharedBlur : sharedBlurRef,
                    })),
                ];
            },
        });
</script>

<script lang="ts">
    let props: PixelTrailProps = $props();

    const { getReading, getIsPointerPresent } = PointerTrackerSvelteUtils.create(
        () => props.element,
        undefined,
        () => props.defs.getPointSource?.(),
    );

    const squareSize = $derived(props.opts?.squareSize ?? props.defaults.squareSize);
    const squareAlpha = $derived(props.opts?.squareAlpha ?? props.defaults.squareAlpha);
    const trailMs = $derived(props.opts?.trailMs ?? props.defaults.trailMs);
    const cycleMs = $derived(props.opts?.cycleMs ?? CYCLING_DEFAULTS.cycleMs);
    const ageColorSpan = $derived(props.opts?.ageColorSpan ?? CYCLING_DEFAULTS.ageColorSpan);
    const size = $derived(props.defs.getSize());

    let stamps = $state.raw(EMPTY_STAMPS);

    let nextSlot = 0;
    let lastPoint: Point2d | undefined;

    clock.subscribe();

    $effect(() => {
        const nowMs = clock.getFrameMs();
        const reading = getReading();
        const isPointerPresent = getIsPointerPresent();
        const area = size;

        untrack(() => {
            const isLaying =
                getIsInside(reading.boxRatio) && SVGDefsUtils.getPointerFade(reading, isPointerPresent) > NO_FADE;
            const point = { x: reading.boxRatio.x * area.width, y: reading.boxRatio.y * area.height };
            const laid = isLaying ? SVGDefsUtils.computePixelTrailCells(lastPoint, point, squareSize) : [];

            lastPoint = isLaying ? point : undefined;

            if (stamps.some((stamp) => stamp && nowMs - stamp.bornMs < trailMs) || laid.length) clock.keepAwake();

            if (!laid.length) return;

            const next = [...stamps];

            for (const cell of laid) {
                next[nextSlot] = { ...cell, bornMs: nowMs };
                nextSlot = (nextSlot + 1) % STAMP_COUNT;
            }

            stamps = next;
        });
    });

    const getColor = (stamp: PixelTrailStamp, frameMs: number) => {
        if (props.opts?.cycles)
            return SVGDefsUtils.computeCycleColor(props.defs.colors, props.colorKeys, stamp.bornMs, cycleMs);

        const ageRatio = (frameMs - stamp.bornMs) / trailMs;
        const band = Math.floor((ageRatio / ageColorSpan) * props.colorKeys.length);

        return props.defs.colors[props.colorKeys[Math.min(Math.max(band, 0), props.colorKeys.length - 1)]];
    };

    const computeStampColors = (stamp: PixelTrailStamp | undefined, frameMs: number) => {
        if (!stamp) return EMPTY_COLORS;

        const alpha = squareAlpha * SVGDefsUtils.computePixelTrailAlpha(frameMs - stamp.bornMs, trailMs);
        const value = `rgb(from ${getColor(stamp, frameMs)} r g b / ${alpha})`;

        return [{ value }, { value, stop: 100 }];
    };
</script>

{#each stamps as stamp, index (index)}
    {@const square = computeSquare(stamp, size, squareSize)}
    {#snippet squareShape()}
        <rect x={square.x} y={square.y} width={square.width} height={square.height} />
    {/snippet}
    <Markup
        markup={SVGGradientDefsSvelteUtils.computeLinearGradient({
            id: getGradientId(props.id, index),
            angle: 0,
            colors: computeStampColors(stamp, clock.getFrameMs()),
        })}
    />
    <SVGSampleClipPath id={getClipId(props.id, index)} content={{ snippet: squareShape }} />
{/each}
