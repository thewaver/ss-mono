<svelte:options namespace="svg" />

<script module lang="ts">
    import { untrack } from "svelte";

    import {
        type CycleColorKey,
        type GradientCometSampleOpts,
        SVGDefsUtils,
        TrackedGradientDefaults,
        type TrackedGradientElementDefs,
    } from "@thewaver/ss-components";
    import { MathUtils, type Point2d } from "@thewaver/ss-utils";

    import { PointerTrackerSvelteUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerSvelte.utils.svelte.js";
    import { SVGGradientDefsSvelteUtils } from "../../../../Generators/SVGDefs/SVGGradients/SVGGradientDefsSvelte.utils.js";
    import Markup from "../../../../Utils/Markup.svelte";
    import { markup } from "../../../../Utils/markupUtils.js";
    import type { TrackedGradientConfig } from "../../SVGDefsSvelte.types.js";
    import { SVGDefsSvelteUtils } from "../../SVGDefsSvelte.utils.svelte.js";
    import Comets from "./comet.svelte";

    type CometDefaults = typeof TrackedGradientDefaults.COMET_DEFAULTS;

    type CometsProps = {
        id: string;
        element: HTMLElement | undefined;
        defs: TrackedGradientElementDefs;
        colorKeys: CycleColorKey[];
        defaults: CometDefaults;
        opts?: GradientCometSampleOpts;
    };

    const PACE_BY_COMET = [1, 0.7, 0.5];
    const SETTLE_MS = 1500;
    const RESTING_POINT: Point2d = { x: 0.5, y: 0.5 };
    const STILL: Point2d = { x: 0, y: 0 };
    const NO_FADE = 0;

    const CYCLING_DEFAULTS = TrackedGradientDefaults.COMET_CYCLING_DEFAULTS;

    const RENDERED_ELSEWHERE = () => undefined;

    const clock = SVGDefsSvelteUtils.createClock(SETTLE_MS);

    const getGradientId = (id: string, comet: number, index: number) => `gradient-${comet}-${index}-${id}`;

    const createChains = (length: number) => PACE_BY_COMET.map(() => Array.from({ length }, () => RESTING_POINT));

    export const createCometSample =
        (colorKeys: CycleColorKey[], defaults: CometDefaults) =>
        (opts?: GradientCometSampleOpts): TrackedGradientConfig => ({
            computeSVGDefs: (id, __, element, defs) => {
                const sharedBlur = SVGDefsSvelteUtils.getBaseBlur(id, defs);
                const sharedBlurRef = SVGDefsUtils.getSharedFilter(sharedBlur);
                const length = opts?.tailLength ?? defaults.tailLength;
                const comets = PACE_BY_COMET.map((_unused, comet) => comet).reverse();

                const layers = comets.flatMap((comet, order) =>
                    Array.from({ length }, (_unused, stamp) => length - 1 - stamp).map((index) => {
                        const isFirst = order === 0 && index === length - 1;

                        return {
                            gradientOrPattern: {
                                id: getGradientId(id, comet, index),
                                renderDefsElement: isFirst
                                    ? () => markup(Comets, { id, element, defs, colorKeys, defaults, opts })
                                    : RENDERED_ELSEWHERE,
                            },
                            filter: isFirst ? sharedBlur : sharedBlurRef,
                        };
                    }),
                );

                return [{ color: SVGDefsUtils.getBaseBorderColor(defs) }, ...layers];
            },
        });
</script>

<script lang="ts">
    let props: CometsProps = $props();

    const { getReading, getIsPointerPresent } = PointerTrackerSvelteUtils.create(
        () => props.element,
        undefined,
        () => props.defs.getPointSource?.(),
    );

    const length = $derived(props.opts?.tailLength ?? props.defaults.tailLength);
    const stiffness = $derived(props.opts?.stiffness ?? props.defaults.stiffness);
    const damping = $derived(props.opts?.damping ?? props.defaults.damping);
    const follow = $derived(props.opts?.followStiffness ?? props.defaults.followStiffness);

    let chains = $state.raw<Point2d[][]>(untrack(() => createChains(length)));

    const velocities = PACE_BY_COMET.map(() => STILL);

    let lastMs: number | undefined;

    clock.subscribe();

    $effect(() => {
        const nowMs = clock.getFrameMs();
        const reading = getReading();
        const isPointerPresent = getIsPointerPresent();

        untrack(() => {
            const frameMs = lastMs === undefined ? 0 : nowMs - lastMs;

            lastMs = nowMs;

            if (SVGDefsUtils.getPointerFade(reading, isPointerPresent) > NO_FADE) clock.keepAwake();

            if (frameMs <= 0) return;

            const current = chains[0]?.length === length ? chains : createChains(length);

            chains = current.map((chain, comet) => {
                const head = SVGDefsUtils.stepSpring(
                    chain[0],
                    velocities[comet],
                    reading.boxRatio,
                    frameMs,
                    stiffness * PACE_BY_COMET[comet],
                    damping,
                );

                velocities[comet] = head.velocity;

                return SVGDefsUtils.followChain(chain, head.position, follow);
            });
        });
    });

    const fade = $derived(SVGDefsUtils.getPointerFade(getReading(), getIsPointerPresent()));
    const cycleMs = $derived(props.opts?.cycles ? (props.opts.cycleMs ?? CYCLING_DEFAULTS.cycleMs) : undefined);
    const colors = $derived(
        PACE_BY_COMET.map((_unused, comet) =>
            SVGDefsUtils.computeTracerColor(
                props.defs.colors,
                props.colorKeys,
                comet,
                PACE_BY_COMET.length,
                clock.getFrameMs(),
                cycleMs,
            ),
        ),
    );
    const elementSize = $derived((props.opts?.circular ?? props.defaults.circular) ? props.defs.getSize() : undefined);
    const headScale = $derived(props.opts?.headScale ?? props.defaults.headScale);
    const tailScale = $derived(props.opts?.tailScale ?? props.defaults.tailScale);
    const headAlpha = $derived(props.opts?.headAlpha ?? props.defaults.headAlpha);
</script>

{#each colors as color, comet (comet)}
    {#each Array.from({ length }) as _, index (index)}
        {@const share = length > 1 ? index / (length - 1) : 0}
        {@const alpha = headAlpha * (1 - share) * fade}
        <Markup
            markup={SVGGradientDefsSvelteUtils.computeRadialGradient({
                id: getGradientId(props.id, comet, index),
                elementSize,
                origin: chains[comet]?.[index] ?? RESTING_POINT,
                scale: MathUtils.lerp(headScale, tailScale, share),
                colors: [
                    { value: `rgb(from ${color} r g b / ${alpha})` },
                    { value: `rgb(from ${color} r g b / 0)`, stop: 100 },
                ],
            })}
        />
    {/each}
{/each}
