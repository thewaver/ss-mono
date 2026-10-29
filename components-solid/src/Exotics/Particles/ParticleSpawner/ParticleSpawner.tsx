import { For, type Setter, createEffect, createMemo, createSignal, on, onCleanup, onMount, untrack } from "solid-js";

import {
    ElementObserverUtils,
    PARTICLE_SPAWNER_DEFAULTS,
    type ParticleSpawnerController,
    type ParticleSpawnerFrame,
    ParticleSpawnerUtils,
    ParticleSpawnerStyles as styles,
} from "@thewaver/ss-components";

import { MediaQueryMonitorSolidUtils } from "../../../Abstracts/MediaQueryMonitor/MediaQueryMonitorSolid.utils";
import { SignalMirrorSolidUtils } from "../../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { useViewportContext } from "../../../Abstracts/Viewport/Viewport.context";
import { access } from "../../../Utils/propUtils";
import { accessStore } from "../../../Utils/storeUtils";
import type { ParticleSpawnerProps } from "./ParticleSpawnerSolid.types";

export const ParticleSpawner = (props: ParticleSpawnerProps) => {
    const getTravelDurationMs = createMemo(
        () => access(props.travelDurationMs) ?? PARTICLE_SPAWNER_DEFAULTS.travelDurationMs,
    );
    const getRestDurationMs = createMemo(
        () => access(props.restDurationMs) ?? PARTICLE_SPAWNER_DEFAULTS.restDurationMs,
    );
    const getSpawnDelayMs = createMemo(() => access(props.spawnDelayMs) ?? PARTICLE_SPAWNER_DEFAULTS.spawnDelayMs);

    const getSpawnIterationPatterns = createMemo(
        () => access(props.spawnIterationPatterns) ?? PARTICLE_SPAWNER_DEFAULTS.spawnIterationPatterns,
    );

    const getParticleCount = createMemo(() => ParticleSpawnerUtils.toParticleCount(access(props.particleCount)));
    const getTargets = createMemo(() => access(props.targets));

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getIsWindowVisible, setIsWindowVisible] = createSignal(true);
    const [getIsPlaying] = SignalMirrorSolidUtils.createOptional(() => props.playback, true);
    const [getStageIndex, setStageIndex] = createSignal(0, { equals: false });

    const getPrefersReducedMotion = MediaQueryMonitorSolidUtils.createReducedMotion();

    const viewportContext = useViewportContext();

    const refs = new Map<number, HTMLElement>();
    const tSetters = new Map<number, Setter<number>>();

    const getCanSpawn = () => !!getRootRef() && getIsWindowVisible() && getTargets().length > 0;

    const measureFrame = (): ParticleSpawnerFrame => {
        const rootRef = getRootRef();

        return {
            rootRect: rootRef ? ElementObserverUtils.measureViewportRect(rootRef, viewportContext) : undefined,
            targetRects: ElementObserverUtils.measureViewportRects(getTargets(), viewportContext),
            prefersReducedMotion: getPrefersReducedMotion(),
        };
    };

    const engine = ParticleSpawnerUtils.createEngine({
        getTargetCount: () => getTargets().length,
        computeTarget: (index, targetCount) => props.computeTarget?.(index, targetCount),
        getElement: (id) => refs.get(id),
        getFrame: measureFrame,
        getTiming: () => ({
            spawnDelayMs: getSpawnDelayMs(),
            travelDurationMs: getTravelDurationMs(),
            restDurationMs: getRestDurationMs(),
        }),
        getCanSpawn,
        computeParticlePos: (travel, t) => props.computeParticlePos(travel, t),
        onParticleT: (id, t) => tSetters.get(id)?.(t),
        onParticleArrive: (index) => props.onParticleArrive?.(index),
    });

    const getLiveParticles = accessStore(engine.particles);

    const controller: ParticleSpawnerController = {
        emit: (count: number) => untrack(() => engine.emit(count)),
    };

    createEffect(on([getParticleCount, getSpawnDelayMs, getSpawnIterationPatterns], () => setStageIndex(0)));

    createEffect(() => {
        const particleCount = getParticleCount();
        const pattern = getSpawnIterationPatterns()[getStageIndex()];
        const isPlaying = getIsPlaying();
        const canSpawn = getCanSpawn();

        getTravelDurationMs();
        getRestDurationMs();
        getSpawnDelayMs();

        if (!canSpawn || !isPlaying || particleCount <= 0 || !pattern) return;

        onCleanup(
            untrack(() =>
                engine.playPattern(pattern, particleCount, {
                    onIterationEnd: () => props.onIterationEnd?.(),
                    onAnimationEnd: () => props.onAnimationEnd?.(),
                    onNextStage: setStageIndex,
                }),
            ),
        );
    });

    onMount(() => {
        const handleVisibilityChange = () => setIsWindowVisible(document.visibilityState === "visible");

        document.addEventListener("visibilitychange", handleVisibilityChange);

        onCleanup(() => document.removeEventListener("visibilitychange", handleVisibilityChange));
    });

    onMount(() => {
        props.onMount?.(controller);
    });

    onCleanup(() => {
        engine.stop();
        refs.clear();
        tSetters.clear();
    });

    return (
        <div
            ref={setRootRef}
            class={styles.particleSpawnerRoot}
            classList={{ [styles.particleSpawnerRootMoving]: getLiveParticles().length > 0 }}
            role="presentation"
            aria-hidden="true"
        >
            <For each={getLiveParticles()}>
                {(particle) => {
                    const [getT, setT] = createSignal(0);

                    tSetters.set(particle.id, setT);
                    onCleanup(() => {
                        tSetters.delete(particle.id);
                        refs.delete(particle.id);
                    });

                    return (
                        <div class={styles.particleSpawnerItem} ref={(el) => refs.set(particle.id, el)}>
                            {props.renderParticle(particle.index, getT)}
                        </div>
                    );
                }}
            </For>
        </div>
    );
};
