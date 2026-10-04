<svelte:options namespace="svg" />

<script module lang="ts">
    import { untrack } from "svelte";

    import {
        type GradientSwarmSampleOpts,
        SVGDefsUtils,
        TrackedGradientDefaults,
        type TrackedGradientElementDefs,
    } from "@thewaver/ss-components";
    import type { Point2d } from "@thewaver/ss-utils";

    import { PointerTrackerSvelteUtils } from "../../../../Abstracts/PointerTracker/PointerTrackerSvelte.utils.svelte.js";
    import { markup } from "../../../../Utils/markupUtils.js";
    import type { TrackedGradientConfig } from "../../SVGDefsSvelte.types.js";
    import { SVGDefsSvelteUtils } from "../../SVGDefsSvelte.utils.svelte.js";
    import Swarm from "./swarm_3.svelte";

    type SwarmProps = {
        id: string;
        element: HTMLElement | undefined;
        defs: TrackedGradientElementDefs;
        opts?: GradientSwarmSampleOpts;
    };

    const COLOR_KEYS = ["primary", "secondary", "tertiary"] as const;
    const SETTLE_MS = 1500;
    const RESTING_POINT: Point2d = { x: 0.5, y: 0.5 };
    const STILL: Point2d = { x: 0, y: 0 };
    const NO_FADE = 0;

    const DEFAULTS = TrackedGradientDefaults.SWARM_DEFAULTS;

    const clock = SVGDefsSvelteUtils.createClock(SETTLE_MS);

    const getPatternId = (id: string) => `pattern-${id}`;
    const getMergeId = (id: string) => `merge-${id}`;

    export const swarm_3 = (opts?: GradientSwarmSampleOpts): TrackedGradientConfig => ({
        computeSVGDefs: (id, __, element, defs) => [
            { color: SVGDefsUtils.getBaseBorderColor(defs) },
            {
                gradientOrPattern: {
                    id: getPatternId(id),
                    renderDefsElement: () => markup(Swarm, { id, element, defs, opts }),
                },
                filter: SVGDefsSvelteUtils.getBaseBlur(id, defs),
            },
        ],
    });
</script>

<script lang="ts">
    let props: SwarmProps = $props();

    const { getReading, getIsPointerPresent } = PointerTrackerSvelteUtils.create(
        () => props.element,
        undefined,
        () => props.defs.getPointSource?.(),
    );

    const count = $derived(props.opts?.spotCount ?? DEFAULTS.spotCount);
    const stiffness = $derived(props.opts?.stiffness ?? DEFAULTS.stiffness);
    const damping = $derived(props.opts?.damping ?? DEFAULTS.damping);
    const wanderRatio = $derived(props.opts?.wanderRatio ?? DEFAULTS.wanderRatio);
    const wanderMs = $derived(props.opts?.wanderMs ?? DEFAULTS.wanderMs);

    let spots = $state.raw<Point2d[]>(untrack(() => Array.from({ length: count }, () => RESTING_POINT)));

    let velocities: Point2d[] = [];
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

            const nextVelocities: Point2d[] = [];

            spots = Array.from({ length: count }, (_unused, index) => {
                const target = SVGDefsUtils.computeSwarmTarget(
                    reading.boxRatio,
                    index,
                    count,
                    nowMs,
                    wanderRatio,
                    wanderMs,
                );
                const step = SVGDefsUtils.stepSpring(
                    spots[index] ?? RESTING_POINT,
                    velocities[index] ?? STILL,
                    target,
                    frameMs,
                    stiffness,
                    damping,
                );

                nextVelocities.push(step.velocity);

                return step.position;
            });

            velocities = nextVelocities;
        });
    });

    const fade = $derived(SVGDefsUtils.getPointerFade(getReading(), getIsPointerPresent()));
    const alpha = $derived((props.opts?.spotAlpha ?? DEFAULTS.spotAlpha) * fade);
    const size = $derived(props.defs.getSize());
    const radii = $derived(
        SVGDefsUtils.computeSwarmRadii(
            size,
            props.opts?.spotScale ?? DEFAULTS.spotScale,
            props.opts?.circular ?? DEFAULTS.circular,
        ),
    );
</script>

<filter id={getMergeId(props.id)} x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur stdDeviation={SVGDefsUtils.computeSwarmMergeBlur(radii)} />
    <feColorMatrix type="matrix" values={SVGDefsUtils.SWARM_MERGE_MATRIX} />
</filter>

<pattern id={getPatternId(props.id)} patternUnits="userSpaceOnUse" width={size.width} height={size.height}>
    <g opacity={alpha}>
        <g filter={`url(#${getMergeId(props.id)})`}>
            {#each spots as spot, index (index)}
                <ellipse
                    cx={spot.x * size.width}
                    cy={spot.y * size.height}
                    rx={radii.x}
                    ry={radii.y}
                    fill={props.defs.colors[COLOR_KEYS[index % COLOR_KEYS.length]]}
                />
            {/each}
        </g>
    </g>
</pattern>
