<script lang="ts">
    import { untrack } from "svelte";
    import type { Attachment } from "svelte/attachments";
    import { SvelteMap } from "svelte/reactivity";

    import {
        PARTICLE_SPAWNER_DEFAULTS,
        type ParticleSpawnIterationPattern,
        type ParticleSpawnerController,
        ParticleSpawnerUtils,
        ParticleSpawnerStyles as styles,
    } from "@thewaver/ss-components";
    import { Rect } from "@thewaver/ss-utils";

    import { ElementObserverSvelteUtils } from "../../../Abstracts/ElementObserver/ElementObserverSvelte.utils.svelte.js";
    import { InteractionTrackerSvelteUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerSvelte.utils.svelte.js";
    import { MediaQueryMonitorSvelteUtils } from "../../../Abstracts/MediaQueryMonitor/MediaQueryMonitorSvelte.utils.svelte.js";
    import { readStore } from "../../../Utils/storeUtils.js";
    import type { ParticleSpawnerProps } from "./ParticleSpawner.types.js";

    const FIRST_STAGE = 0;
    const NOT_STARTED = 0;

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
    let stage = $state.raw({ index: FIRST_STAGE });
    let rootRect = $state.raw<Rect>();

    const elements = new Map<number, HTMLElement>();
    const ts = new SvelteMap<number, number>();

    const getIsPageHidden = InteractionTrackerSvelteUtils.trackPageHidden();
    const isWindowVisible = $derived(!getIsPageHidden());
    const getPrefersReducedMotion = MediaQueryMonitorSvelteUtils.createReducedMotion();

    ElementObserverSvelteUtils.createViewportRectObserver(
        () => root ?? undefined,
        () => isWindowVisible,
        {
            setElementRect: (rect) => {
                if (!rootRect || !Rect.isSame(rootRect, rect)) rootRect = rect;
            },
        },
    );

    const getTargetRects = ElementObserverSvelteUtils.createViewportRectListObserver(
        () => props.targets,
        () => isWindowVisible,
    );

    const canSpawn = $derived(rootRect !== undefined && isWindowVisible && props.targets.length > 0);

    const engine = ParticleSpawnerUtils.createEngine({
        getTargetCount: () => props.targets.length,
        computeTarget: (index, targetCount) => props.computeTarget?.(index, targetCount),
        getElement: (id) => elements.get(id),
        getFrame: () => ({
            rootRect,
            targetRects: getTargetRects(),
            prefersReducedMotion: getPrefersReducedMotion(),
        }),
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
            stage = { index: FIRST_STAGE };
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

<div bind:this={root} class={styles.particleSpawnerRoot} role="presentation" aria-hidden="true">
    {#each getParticles() as particle (particle.id)}
        <div class={styles.particleSpawnerItem} {@attach attachParticle(particle.id)}>
            {@render props.renderParticle(particle.index, ts.get(particle.id) ?? NOT_STARTED)}
        </div>
    {/each}
</div>
