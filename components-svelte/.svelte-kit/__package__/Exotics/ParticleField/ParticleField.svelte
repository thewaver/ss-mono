<script lang="ts">
    import { untrack } from "svelte";
    import type { Attachment } from "svelte/attachments";

    import {
        CellAnimationUtils,
        PARTICLE_FIELD_DEFAULTS,
        ParticleFieldUtils,
        ParticleFieldStyles as styles,
    } from "@thewaver/ss-components";
    import { type Index2d, MathUtils } from "@thewaver/ss-utils";

    import { ElementObserverSvelteUtils } from "../../Abstracts/ElementObserver/ElementObserverSvelte.utils.svelte.js";
    import { InteractionTrackerSvelteUtils } from "../../Abstracts/InteractionTracker/InteractionTrackerSvelte.utils.svelte.js";
    import { watchChange } from "../../Utils/effectUtils.svelte.js";
    import type { ParticleFieldProps } from "./ParticleField.types.js";

    const NO_PROGRESS = 0;
    const FIRST_ITERATION = 0;
    const NO_WEIGHTS: number[][] = [];

    let { playback = $bindable(true), progress = $bindable(NO_PROGRESS), ...props }: ParticleFieldProps = $props();

    const spawnChance = $derived(props.spawnChance ?? PARTICLE_FIELD_DEFAULTS.spawnChance);
    const durationMs = $derived(props.animationDurationMs ?? PARTICLE_FIELD_DEFAULTS.animationDurationMs);
    const iterationCount = $derived(props.animationIterationCount ?? PARTICLE_FIELD_DEFAULTS.animationIterationCount);
    const iterationDelayMs = $derived(
        props.animationIterationDelayMs ?? PARTICLE_FIELD_DEFAULTS.animationIterationDelayMs,
    );
    const lifetimeMs = $derived(
        Math.min(props.particleLifetimeMs ?? PARTICLE_FIELD_DEFAULTS.particleLifetimeMs, durationMs),
    );

    let root = $state<HTMLDivElement>();
    let currentIteration = $state(FIRST_ITERATION);

    const bodies = new Map<number, HTMLElement>();

    const getIsPageHidden = InteractionTrackerSvelteUtils.trackPageHidden();

    const getRootSize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(() => root ?? undefined);

    let lastCellCount: Index2d | undefined;

    const cellCount = $derived.by(() => {
        const next = CellAnimationUtils.computeCellCount(props.cellCount, getRootSize());

        if (lastCellCount && CellAnimationUtils.getIsSameCount(lastCellCount, next)) return lastCellCount;

        lastCellCount = next;

        return next;
    });

    const outline = $derived(
        ParticleFieldUtils.computeOutline(
            props.computeShapePoints?.(getRootSize()),
            props.shapeJoinRadii,
            props.shapeLameExponents,
        ),
    );

    const cells = $derived(
        ParticleFieldUtils.computeCells(
            cellCount,
            getRootSize(),
            props.computeCellWeights?.(cellCount) ?? NO_WEIGHTS,
            outline,
        ),
    );

    const hasEnded = $derived(currentIteration >= iterationCount);

    const isRunning = $derived(
        playback && !getIsPageHidden() && !hasEnded && getRootSize().width > 0 && getRootSize().height > 0,
    );

    const clockMs = $derived(MathUtils.clamp01(progress) * durationMs);

    const roster = ParticleFieldUtils.createRoster();

    const particles = $derived(
        roster.refresh({
            count: cellCount,
            cells,
            clockMs,
            durationMs,
            lifetimeMs,
            spawnChance,
            pass: currentIteration,
            hasEnded,
            computeParticlePos: untrack(() => props.computeParticlePos),
        }).particles,
    );

    watchChange(
        () => cellCount,
        () => {
            currentIteration = FIRST_ITERATION;
            progress = NO_PROGRESS;
        },
    );

    $effect(() => {
        const list = particles;
        const clock = clockMs;
        const lifetime = lifetimeMs;
        const computeAnimation = props.computeParticleAnimation;

        if (!computeAnimation) return;

        untrack(() => {
            for (const particle of list) {
                const body = bodies.get(particle.id);

                if (!body) continue;

                CellAnimationUtils.assignAnimationProps(
                    body,
                    computeAnimation(particle.cell, ParticleFieldUtils.computeLife(clock, particle.spawnMs, lifetime)),
                );
            }
        });
    });

    $effect(() => {
        if (!isRunning) return;

        return untrack(() =>
            CellAnimationUtils.runPasses({
                getProgress: () => progress,
                setProgress: (value) => {
                    progress = value;
                },
                getCurrentIteration: () => currentIteration,
                setCurrentIteration: (value) => {
                    currentIteration = value;
                },
                getDurationMs: () => durationMs,
                getIterationCount: () => iterationCount,
                getIterationDelayMs: () => iterationDelayMs,
                onIterationEnd: () => props.onIterationEnd?.(),
                onAnimationEnd: () => props.onAnimationEnd?.(),
            }),
        );
    });

    const attachBody =
        (id: number): Attachment<HTMLElement> =>
        (element) => {
            bodies.set(id, element);

            return () => {
                bodies.delete(id);
            };
        };
</script>

<div bind:this={root} class={styles.particleFieldRoot} role="presentation" aria-hidden="true">
    {#each particles as particle (particle.id)}
        <div class={styles.particleFieldItem} style:left={`${particle.pos.x}px`} style:top={`${particle.pos.y}px`}>
            <div class={styles.particleFieldBody} {@attach attachBody(particle.id)}>
                {@render props.renderParticle(
                    particle.cell,
                    ParticleFieldUtils.computeLife(clockMs, particle.spawnMs, lifetimeMs),
                )}
            </div>
        </div>
    {/each}
</div>
