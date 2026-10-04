<svelte:options namespace="svg" />

<script module lang="ts">
    import { untrack } from "svelte";

    import {
        type CycleColorKey,
        type GradientSwarmSampleOpts,
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
    import Swarm from "./swarm.svelte";

    type SwarmDefaults = typeof TrackedGradientDefaults.SWARM_DEFAULTS;

    type SwarmProps = {
        id: string;
        element: HTMLElement | undefined;
        defs: TrackedGradientElementDefs;
        colorKeys: CycleColorKey[];
        defaults: SwarmDefaults;
        opts?: GradientSwarmSampleOpts;
    };

    const SETTLE_MS = 1500;
    const RESTING_POINT: Point2d = { x: 0.5, y: 0.5 };
    const STILL: Point2d = { x: 0, y: 0 };
    const NO_FADE = 0;

    const CYCLING_DEFAULTS = TrackedGradientDefaults.SWARM_CYCLING_DEFAULTS;

    const RENDERED_ELSEWHERE = () => undefined;

    const clock = SVGDefsSvelteUtils.createClock(SETTLE_MS);

    const getGradientId = (id: string, tracer: number, index: number) => `gradient-${tracer}-${index}-${id}`;

    const createChains = (count: number, length: number) =>
        Array.from({ length: count }, () => Array.from({ length }, () => RESTING_POINT));

    export const createSwarmSample =
        (colorKeys: CycleColorKey[], defaults: SwarmDefaults) =>
        (opts?: GradientSwarmSampleOpts): TrackedGradientConfig => ({
            computeSVGDefs: (id, __, element, defs) => {
                const sharedBlur = SVGDefsSvelteUtils.getBaseBlur(id, defs);
                const sharedBlurRef = SVGDefsUtils.getSharedFilter(sharedBlur);
                const count = opts?.spotCount ?? defaults.spotCount;
                const length = opts?.tailLength ?? defaults.tailLength;
                const tracers = Array.from({ length: count }, (_unused, tracer) => count - 1 - tracer);

                const layers = tracers.flatMap((tracer, order) =>
                    Array.from({ length }, (_unused, stamp) => length - 1 - stamp).map((index) => {
                        const isFirst = order === 0 && index === length - 1;

                        return {
                            gradientOrPattern: {
                                id: getGradientId(id, tracer, index),
                                renderDefsElement: isFirst
                                    ? () => markup(Swarm, { id, element, defs, colorKeys, defaults, opts })
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
    let props: SwarmProps = $props();

    const { getReading, getIsPointerPresent } = PointerTrackerSvelteUtils.create(
        () => props.element,
        undefined,
        () => props.defs.getPointSource?.(),
    );

    const count = $derived(props.opts?.spotCount ?? props.defaults.spotCount);
    const length = $derived(props.opts?.tailLength ?? props.defaults.tailLength);
    const stiffness = $derived(props.opts?.stiffness ?? props.defaults.stiffness);
    const damping = $derived(props.opts?.damping ?? props.defaults.damping);
    const follow = $derived(props.opts?.followStiffness ?? props.defaults.followStiffness);
    const wanderRatio = $derived(props.opts?.wanderRatio ?? props.defaults.wanderRatio);
    const wanderMs = $derived(props.opts?.wanderMs ?? props.defaults.wanderMs);

    let chains = $state.raw<Point2d[][]>(untrack(() => createChains(count, length)));

    const velocities: Point2d[] = [];

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

            const current =
                chains.length === count && chains[0]?.length === length ? chains : createChains(count, length);

            chains = current.map((chain, tracer) => {
                const target = SVGDefsUtils.computeSwarmTarget(
                    reading.boxRatio,
                    tracer,
                    count,
                    nowMs,
                    wanderRatio,
                    wanderMs,
                );
                const head = SVGDefsUtils.stepSpring(
                    chain[0],
                    velocities[tracer] ?? STILL,
                    target,
                    frameMs,
                    stiffness,
                    damping,
                );

                velocities[tracer] = head.velocity;

                return SVGDefsUtils.followChain(chain, head.position, follow);
            });
        });
    });

    const fade = $derived(SVGDefsUtils.getPointerFade(getReading(), getIsPointerPresent()));
    const cycleMs = $derived(props.opts?.cycles ? (props.opts.cycleMs ?? CYCLING_DEFAULTS.cycleMs) : undefined);
    const colors = $derived(
        Array.from({ length: count }, (_unused, tracer) =>
            SVGDefsUtils.computeTracerColor(
                props.defs.colors,
                props.colorKeys,
                tracer,
                count,
                clock.getFrameMs(),
                cycleMs,
            ),
        ),
    );
    const elementSize = $derived((props.opts?.circular ?? props.defaults.circular) ? props.defs.getSize() : undefined);
    const spotScale = $derived(props.opts?.spotScale ?? props.defaults.spotScale);
    const tailScale = $derived(props.opts?.tailScale ?? props.defaults.tailScale);
    const spotAlpha = $derived(props.opts?.spotAlpha ?? props.defaults.spotAlpha);
</script>

{#each colors as color, tracer (tracer)}
    {#each Array.from({ length }) as _, index (index)}
        {@const share = length > 1 ? index / (length - 1) : 0}
        {@const alpha = spotAlpha * (1 - share) * fade}
        <Markup
            markup={SVGGradientDefsSvelteUtils.computeRadialGradient({
                id: getGradientId(props.id, tracer, index),
                elementSize,
                origin: chains[tracer]?.[index] ?? RESTING_POINT,
                scale: MathUtils.lerp(spotScale, spotScale * tailScale, share),
                colors: [
                    { value: `rgb(from ${color} r g b / ${alpha})` },
                    { value: `rgb(from ${color} r g b / 0)`, stop: 100 },
                ],
            })}
        />
    {/each}
{/each}
