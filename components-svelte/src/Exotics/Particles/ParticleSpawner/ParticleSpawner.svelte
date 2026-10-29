<script lang="ts">
    import { untrack } from "svelte";
    import type { Attachment } from "svelte/attachments";
    import { SvelteMap } from "svelte/reactivity";

    import {
        ElementObserverUtils,
        PARTICLE_SPAWNER_DEFAULTS,
        type ParticleSpawnIterationPattern,
        type ParticleSpawnerController,
        type ParticleSpawnerFrame,
        ParticleSpawnerUtils,
        ParticleSpawnerStyles as styles,
    } from "@thewaver/ss-components";
    import { ParticleSpawnerConst } from "@thewaver/ss-components/internal";

    import { InteractionTrackerSvelteUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerSvelte.utils.svelte.js";
    import { MediaQueryMonitorSvelteUtils } from "../../../Abstracts/MediaQueryMonitor/MediaQueryMonitorSvelte.utils.svelte.js";
    import { getViewportContext } from "../../../Abstracts/Viewport/Viewport.context.js";
    import { readStore } from "../../../Utils/storeUtils.js";
    import type { ParticleSpawnerProps } from "./ParticleSpawner.types.js";

    let { playback = $bindable(true), ...props }: ParticleSpawnerProps = $props();

    const travelDurationMs = $derived(props.travelDurationMs ?? PARTICLE_SPAWNER_DEFAULTS.travelDurationMs);
    const restDurationMs = $derived(props.restDurationMs ?? PARTICLE_SPAWNER_DEFAULTS.restDurationMs);
    const spawnDelayMs = $derived(props.spawnDelayMs ?? PARTICLE_SPAWNER_DEFAULTS.spawnDelayMs);
    const particleCount = $derived(ParticleSpawnerUtils.toParticleCount(props.particleCount));

    const patternsKey = $derived(
        JSON.stringify(props.spawnIterationPatterns ?? PARTICLE_SPAWNER_DEFAULTS.spawnIterationPatterns),
    );
    const patterns = $derived(JSON.parse(patternsKey) as ParticleSpawnIterationPattern[]);

    let root = $state<HTMLDivElement>();
    let stage = $state.raw({ index: ParticleSpawnerConst.FIRST_STAGE });

    const elements = new Map<number, HTMLElement>();
    const ts = new SvelteMap<number, number>();

    const getIsPageHidden = InteractionTrackerSvelteUtils.trackPageHidden();
    const isWindowVisible = $derived(!getIsPageHidden());
    const getPrefersReducedMotion = MediaQueryMonitorSvelteUtils.createReducedMotion();

    const viewportContext = getViewportContext();

    const canSpawn = $derived(!!root && isWindowVisible && props.targets.length > 0);

    const measureFrame = (): ParticleSpawnerFrame => ({
        rootRect: root ? ElementObserverUtils.measureViewportRect(root, viewportContext) : undefined,
        targetRects: ElementObserverUtils.measureViewportRects(props.targets, viewportContext),
        prefersReducedMotion: getPrefersReducedMotion(),
    });

    const engine = ParticleSpawnerUtils.createEngine({
        getTargetCount: () => props.targets.length,
        computeTarget: (index, targetCount) => props.computeTarget?.(index, targetCount),
        getElement: (id) => elements.get(id),
        getFrame: measureFrame,
        getTiming: () => ({ spawnDelayMs, travelDurationMs, restDurationMs }),
        getCanSpawn: () => canSpawn,
        computeParticlePos: (travel, t) => props.computeParticlePos(travel, t),
        onParticleT: (id, t) => ts.set(id, t),
        onParticleArrive: (index) => props.onParticleArrive?.(index),
    });

    const getParticles = readStore(engine.particles);

    const controller: ParticleSpawnerController = { emit: (count) => untrack(() => engine.emit(count)) };

    $effect(() => {
        untrack(() => props.onMount?.(controller));
    });

    $effect(() => engine.stop);

    $effect(() => {
        void particleCount;
        void spawnDelayMs;
        void patterns;

        untrack(() => {
            stage = { index: ParticleSpawnerConst.FIRST_STAGE };
        });
    });

    const pattern = $derived(patterns[stage.index]);

    $effect(() => {
        const currentPattern = pattern;
        const count = particleCount;

        void stage;
        void travelDurationMs;
        void restDurationMs;
        void spawnDelayMs;

        if (!canSpawn || !playback || count <= 0 || !currentPattern) return;

        return untrack(() =>
            engine.playPattern(currentPattern, count, {
                onIterationEnd: () => props.onIterationEnd?.(),
                onAnimationEnd: () => props.onAnimationEnd?.(),
                onNextStage: (index) => {
                    stage = { index };
                },
            }),
        );
    });

    const attachParticle =
        (id: number): Attachment<HTMLElement> =>
        (element) => {
            elements.set(id, element);
            untrack(() => engine.drawParticle(id, element));

            return () => {
                elements.delete(id);
                untrack(() => ts.delete(id));
            };
        };
</script>

<div
    bind:this={root}
    class={[styles.particleSpawnerRoot, getParticles().length > 0 && styles.particleSpawnerRootMoving]}
    role="presentation"
    aria-hidden="true"
>
    {#each getParticles() as particle (particle.id)}
        <div class={styles.particleSpawnerItem} {@attach attachParticle(particle.id)}>
            {@render props.renderParticle(particle.index, ts.get(particle.id) ?? ParticleSpawnerConst.NOT_STARTED)}
        </div>
    {/each}
</div>
