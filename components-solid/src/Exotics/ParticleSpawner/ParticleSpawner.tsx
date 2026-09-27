import { For, type Setter, createEffect, createMemo, createSignal, on, onCleanup, onMount, untrack } from "solid-js";

import {
    PARTICLE_SPAWNER_DEFAULTS,
    type ParticleSpawnerController,
    ParticleSpawnerUtils,
    ParticleSpawnerStyles as styles,
} from "@thewaver/ss-components";
import { Rect } from "@thewaver/ss-utils";

import { ElementObserverSolidUtils } from "../../Abstracts/ElementObserver/ElementObserverSolid.utils";
import { MediaQueryMonitorSolidUtils } from "../../Abstracts/MediaQueryMonitor/MediaQueryMonitorSolid.utils";
import { SignalMirrorSolidUtils } from "../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { access } from "../../Utils/propUtils";
import { accessStore } from "../../Utils/storeUtils";
import type { ParticleSpawnerProps } from "./ParticleSpawnerSolid.types";

export const ParticleSpawner = (props: ParticleSpawnerProps) => {
    const getTravelDurationMs = createMemo(
        () => access(props.travelDurationMs) ?? PARTICLE_SPAWNER_DEFAULTS.travelDurationMs,
    );
    const getRetentionMs = createMemo(() => access(props.retentionMs) ?? PARTICLE_SPAWNER_DEFAULTS.retentionMs);
    const getSpawnDelayMs = createMemo(() => access(props.spawnDelayMs) ?? PARTICLE_SPAWNER_DEFAULTS.spawnDelayMs);

    const getSpawnIterationPatterns = createMemo(
        () => access(props.spawnIterationPatterns) ?? PARTICLE_SPAWNER_DEFAULTS.spawnIterationPatterns,
    );

    const getParticleCount = createMemo(() => ParticleSpawnerUtils.toParticleCount(access(props.particleCount)));
    const getTargets = createMemo(() => access(props.targets));

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getIsWindowVisible, setIsWindowVisible] = createSignal(true);
    const [getIsPlaying] = SignalMirrorSolidUtils.createOptional(() => props.playbackSignal, true);
    const [getStageIndex, setStageIndex] = createSignal(0, { equals: false });
    const [getRootRect, setRootRect] = createSignal<Rect | undefined>(undefined, {
        equals: (a, b) => (a === undefined || b === undefined ? a === b : Rect.isSame(a, b)),
    });
    const getHasRootRect = createMemo(() => getRootRect() !== undefined);

    const getPrefersReducedMotion = MediaQueryMonitorSolidUtils.createReducedMotion();

    ElementObserverSolidUtils.createViewportRectObserver(getRootRef, getIsWindowVisible, {
        setElementRect: setRootRect,
    });

    const getTargetRects = ElementObserverSolidUtils.createViewportRectListObserver(getTargets, getIsWindowVisible);

    const refs = new Map<number, HTMLElement>();
    const tSetters = new Map<number, Setter<number>>();

    const getCanSpawn = () => getHasRootRect() && getIsWindowVisible() && getTargets().length > 0;

    const engine = ParticleSpawnerUtils.createEngine({
        getTargetCount: () => getTargets().length,
        computeTarget: (index, targetCount) => props.computeTarget?.(index, targetCount),
        getElement: (id) => refs.get(id),
        getFrame: () => ({
            rootRect: getRootRect(),
            targetRects: getTargetRects(),
            prefersReducedMotion: getPrefersReducedMotion(),
        }),
        getTiming: () => ({
            spawnDelayMs: getSpawnDelayMs(),
            travelDurationMs: getTravelDurationMs(),
            retentionMs: getRetentionMs(),
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
        getRetentionMs();
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
        <div ref={setRootRef} class={styles.particleSpawnerRoot} role="presentation" aria-hidden="true">
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
