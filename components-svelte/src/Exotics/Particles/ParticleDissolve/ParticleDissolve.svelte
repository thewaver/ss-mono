<script lang="ts">
    import { untrack } from "svelte";

    import {
        CellAnimationUtils,
        PARTICLE_DISSOLVE_DEFAULTS,
        PaintedAreaUtils,
        type PaintedRegion,
        type PaintedSample,
        ParticleDissolveUtils,
        type ParticleFieldCellDefs,
        ParticleDissolveStyles as styles,
    } from "@thewaver/ss-components";
    import { type CSSAnimationValues, type Index2d, Index2dUtils, RectUtils } from "@thewaver/ss-utils";

    import { ElementObserverSvelteUtils } from "../../../Abstracts/ElementObserver/ElementObserverSvelte.utils.svelte.js";
    import { MediaQueryMonitorSvelteUtils } from "../../../Abstracts/MediaQueryMonitor/MediaQueryMonitorSvelte.utils.svelte.js";
    import ParticleField from "../ParticleField/ParticleField.svelte";
    import type { ParticleDissolveProps } from "./ParticleDissolve.types.js";

    const NO_ANIMATION: CSSAnimationValues = {};
    const NO_COLOR = "";
    const SINGLE_PASS = 1;

    const getCellKey = (cell: ParticleFieldCellDefs) => Index2dUtils.toFlatIndex(cell.pos, cell.count.col);

    let { children, ...props }: ParticleDissolveProps = $props();

    let root = $state<HTMLDivElement>();
    let content = $state<HTMLDivElement>();
    let progress = $state(untrack(() => props.isDissolved) ? 1 : 0);

    const getSize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(() => root ?? undefined);

    const getPrefersReducedMotion = MediaQueryMonitorSvelteUtils.createReducedMotion();

    const durationMs = $derived(props.durationMs ?? PARTICLE_DISSOLVE_DEFAULTS.durationMs);

    const lifetimeShare = $derived(
        ParticleDissolveUtils.computeLifetimeShare(
            durationMs,
            props.particleLifetimeMs ?? PARTICLE_DISSOLVE_DEFAULTS.particleLifetimeMs,
        ),
    );

    const sweep = $derived(
        ParticleDissolveUtils.computeSweep(
            props.angleDegrees ?? PARTICLE_DISSOLVE_DEFAULTS.angleDegrees,
            props.originShare,
            getSize(),
        ),
    );

    let lastCellCount: Index2d | undefined;

    const cellCount = $derived.by(() => {
        const next = ParticleDissolveUtils.computeCellCount(
            getSize(),
            props.cellSize ?? PARTICLE_DISSOLVE_DEFAULTS.cellSize,
        );

        if (lastCellCount && CellAnimationUtils.getIsSameCount(lastCellCount, next)) return lastCellCount;

        lastCellCount = next;

        return next;
    });

    const edge = $derived(ParticleDissolveUtils.computeEdge(progress, lifetimeShare));

    const mask = $derived(
        getPrefersReducedMotion()
            ? undefined
            : ParticleDissolveUtils.computeMask(
                  edge,
                  props.featherShare ?? PARTICLE_DISSOLVE_DEFAULTS.featherShare,
                  sweep,
                  getSize(),
              ),
    );

    const opacity = $derived(getPrefersReducedMotion() && progress > 0 ? 1 - progress : undefined);

    const hasParticles = $derived(!getPrefersReducedMotion() && progress > 0 && progress < 1);

    let regions: PaintedRegion[] = [];

    const createLayer = () => {
        const samples = new Map<number, PaintedSample>();

        const computeParticlePos = (cell: ParticleFieldCellDefs) => {
            const key = getCellKey(cell);
            const painted = PaintedAreaUtils.computeSamples(regions, cell.rect);
            const sample = painted[Math.floor(Math.random() * painted.length)];

            if (!sample) {
                samples.delete(key);

                return RectUtils.getCenter(cell.rect);
            }

            samples.set(key, sample);

            return sample.pos;
        };

        const computeParticleAnimation = (cell: ParticleFieldCellDefs, t: number) =>
            props.computeParticleAnimation?.({ cell, color: samples.get(getCellKey(cell))?.color ?? NO_COLOR }, t) ??
            NO_ANIMATION;

        return { samples, computeParticlePos, computeParticleAnimation };
    };

    const layerCache: ReturnType<typeof createLayer>[] = [];

    const layers = $derived(
        Array.from(
            {
                length: ParticleDissolveUtils.computeParticlesPerCell(
                    props.particlesPerCell ?? PARTICLE_DISSOLVE_DEFAULTS.particlesPerCell,
                ),
            },
            (_, index) => (layerCache[index] ??= createLayer()),
        ),
    );

    $effect(() => {
        const isDissolved = props.isDissolved;

        return untrack(() => {
            const to = isDissolved ? 1 : 0;
            const from = progress;

            if (from === to) return;

            regions = content ? PaintedAreaUtils.measure(content) : [];

            for (const layer of layerCache) layer.samples.clear();

            return ParticleDissolveUtils.run({
                from,
                to,
                durationMs: ParticleDissolveUtils.computeDurationMs(durationMs, getPrefersReducedMotion()),
                onProgress: (value) => {
                    progress = value;
                },
                onEnd: () => (isDissolved ? props.onDissolveEnd : props.onRebuildEnd)?.(),
            });
        });
    });
</script>

<div bind:this={root} class={styles.particleDissolveRoot}>
    <div
        bind:this={content}
        inert={progress > 0}
        style:mask-image={mask}
        style:-webkit-mask-image={mask}
        style:opacity
    >
        {@render children?.()}
    </div>

    {#if hasParticles}
        <div class={styles.particleDissolveParticles} aria-hidden="true">
            {#each layers as layer}
                {#snippet renderLayerParticle(cell: ParticleFieldCellDefs, t: number)}
                    {@const sample = layer.samples.get(getCellKey(cell))}
                    {#if sample}
                        {@render props.renderParticle({ cell, color: sample.color }, t)}
                    {/if}
                {/snippet}

                <div class={styles.particleDissolveParticleLayer}>
                    <ParticleField
                        bind:progress={() => progress, () => undefined}
                        {cellCount}
                        spawnChance={props.spawnChance ?? PARTICLE_DISSOLVE_DEFAULTS.spawnChance}
                        animationDurationMs={durationMs}
                        animationIterationCount={SINGLE_PASS}
                        particleLifetimeMs={lifetimeShare * durationMs}
                        playback={false}
                        computeCellWeights={(count) =>
                            ParticleDissolveUtils.computeCellWeights(count, getSize(), sweep)}
                        computeParticlePos={layer.computeParticlePos}
                        computeParticleAnimation={layer.computeParticleAnimation}
                        renderParticle={renderLayerParticle}
                    />
                </div>
            {/each}
        </div>
    {/if}
</div>
