<svelte:options namespace="svg" />

<script module lang="ts">
    import { untrack } from "svelte";

    import {
        type GradientRibbonSampleOpts,
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
    import Ribbons from "./ribbon_3.svelte";

    type RibbonsProps = {
        id: string;
        element: HTMLElement | undefined;
        defs: TrackedGradientElementDefs;
        opts?: GradientRibbonSampleOpts;
    };

    const COLOR_KEYS = ["primary", "secondary", "tertiary"] as const;
    const PACE_BY_RIBBON = [1, 0.7, 0.5];
    const SETTLE_MS = 1500;
    const RESTING_POINT: Point2d = { x: 0.5, y: 0.5 };
    const STILL: Point2d = { x: 0, y: 0 };
    const NO_FADE = 0;

    const DEFAULTS = TrackedGradientDefaults.RIBBON_DEFAULTS;

    const RENDERED_ELSEWHERE = () => undefined;

    const clock = SVGDefsSvelteUtils.createClock(SETTLE_MS);

    const getGradientId = (id: string, ribbon: number, index: number) => `gradient-${ribbon}-${index}-${id}`;

    const createChains = (length: number) => COLOR_KEYS.map(() => Array.from({ length }, () => RESTING_POINT));

    export const ribbon_3 = (opts?: GradientRibbonSampleOpts): TrackedGradientConfig => ({
        computeSVGDefs: (id, __, element, defs) => {
            const sharedBlur = SVGDefsSvelteUtils.getBaseBlur(id, defs);
            const sharedBlurRef = SVGDefsUtils.getSharedFilter(sharedBlur);
            const length = opts?.ribbonLength ?? DEFAULTS.ribbonLength;

            const layers = COLOR_KEYS.flatMap((_colorKey, ribbon) =>
                Array.from({ length }, (_unused, stamp) => length - 1 - stamp).map((index) => {
                    const isFirst = ribbon === 0 && index === length - 1;

                    return {
                        gradientOrPattern: {
                            id: getGradientId(id, ribbon, index),
                            renderDefsElement: isFirst
                                ? () => markup(Ribbons, { id, element, defs, opts })
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
    let props: RibbonsProps = $props();

    const { getReading, getIsPointerPresent } = PointerTrackerSvelteUtils.create(
        () => props.element,
        undefined,
        () => props.defs.getPointSource?.(),
    );

    const length = $derived(props.opts?.ribbonLength ?? DEFAULTS.ribbonLength);
    const stiffness = $derived(props.opts?.stiffness ?? DEFAULTS.stiffness);
    const damping = $derived(props.opts?.damping ?? DEFAULTS.damping);
    const follow = $derived(props.opts?.followStiffness ?? DEFAULTS.followStiffness);

    let chains = $state.raw<Point2d[][]>(untrack(() => createChains(length)));

    let velocities = COLOR_KEYS.map(() => STILL);
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

            chains = current.map((chain, ribbon) => {
                const head = SVGDefsUtils.stepSpring(
                    chain[0],
                    velocities[ribbon],
                    reading.boxRatio,
                    frameMs,
                    stiffness * PACE_BY_RIBBON[ribbon],
                    damping,
                );
                const next = [head.position];

                velocities[ribbon] = head.velocity;

                for (let index = 1; index < chain.length; index++) {
                    const ahead = next[index - 1];

                    next.push({
                        x: MathUtils.lerp(chain[index].x, ahead.x, follow),
                        y: MathUtils.lerp(chain[index].y, ahead.y, follow),
                    });
                }

                return next;
            });
        });
    });

    const fade = $derived(SVGDefsUtils.getPointerFade(getReading(), getIsPointerPresent()));
    const elementSize = $derived((props.opts?.circular ?? DEFAULTS.circular) ? props.defs.getSize() : undefined);
    const headScale = $derived(props.opts?.headScale ?? DEFAULTS.headScale);
    const tailScale = $derived(props.opts?.tailScale ?? DEFAULTS.tailScale);
    const headAlpha = $derived(props.opts?.headAlpha ?? DEFAULTS.headAlpha);
</script>

{#each COLOR_KEYS as colorKey, ribbon (colorKey)}
    {#each Array.from({ length }) as _, index (index)}
        {@const share = length > 1 ? index / (length - 1) : 0}
        {@const alpha = headAlpha * (1 - share) * fade}
        <Markup
            markup={SVGGradientDefsSvelteUtils.computeRadialGradient({
                id: getGradientId(props.id, ribbon, index),
                elementSize,
                origin: chains[ribbon]?.[index] ?? RESTING_POINT,
                scale: MathUtils.lerp(headScale, tailScale, share),
                colors: [
                    { value: `rgb(from ${props.defs.colors[colorKey]} r g b / ${alpha})` },
                    { value: `rgb(from ${props.defs.colors[colorKey]} r g b / 0)`, stop: 100 },
                ],
            })}
        />
    {/each}
{/each}
