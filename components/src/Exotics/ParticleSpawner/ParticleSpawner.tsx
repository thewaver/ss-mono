import { For, type Setter, batch, createEffect, createMemo, createSignal, on, onCleanup, onMount } from "solid-js";

import { Rect } from "@thewaver/ss-utils";

import { ElementObserverUtils } from "../../Abstracts/ElementObserver/ElementObserver.utils";
import { MediaQueryMonitorUtils } from "../../Abstracts/MediaQueryMonitor/MediaQueryMonitor.utils";
import { SignalMirrorUtils } from "../../Abstracts/SignalMirror/SignalMirror.utils";
import { access } from "../../Utils/propUtils";
import { PARTICLE_SPAWNER_DEFAULTS } from "./ParticleSpawner.const";
import type { ParticleSpawnerProps } from "./ParticleSpawner.types";
import { ParticleSpawnerUtils } from "./ParticleSpawner.utils";

import * as styles from "./ParticleSpawner.css";

const NO_DELAY_MS = 0;

let nextId = 0;

type LiveParticle = {
    id: number;
    index: number;
    repeatIndex: number;
    targetIndex: number;
    spawnedAtMs: number;
};

export const ParticleSpawner = (props: ParticleSpawnerProps) => {
    const getTravelDurationMs = createMemo(
        () => access(props.travelDurationMs) ?? PARTICLE_SPAWNER_DEFAULTS.travelDurationMs,
    );
    const getRetentionMs = createMemo(() => access(props.retentionMs) ?? PARTICLE_SPAWNER_DEFAULTS.retentionMs);
    const getSpawnDelayMs = createMemo(() => access(props.spawnDelayMs) ?? PARTICLE_SPAWNER_DEFAULTS.spawnDelayMs);

    const getSpawnIterationPatterns = createMemo(
        () => access(props.spawnIterationPatterns) ?? PARTICLE_SPAWNER_DEFAULTS.spawnIterationPatterns,
    );

    const getParticleCount = createMemo(() => Math.max(0, Math.round(access(props.particleCount))));
    const getTargets = createMemo(() => access(props.targets));

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getIsWindowVisible, setIsWindowVisible] = createSignal(true);
    const [getIsPlaying] = SignalMirrorUtils.createOptional(() => props.playbackSignal, true);
    const [getStageIndex, setStageIndex] = createSignal(0, { equals: false });
    const [getLiveParticles, setLiveParticles] = createSignal<LiveParticle[]>([]);
    const [getRootRect, setRootRect] = createSignal<Rect | undefined>(undefined, {
        equals: (a, b) => (a === undefined || b === undefined ? a === b : Rect.isSame(a, b)),
    });
    const getHasRootRect = createMemo(() => getRootRect() !== undefined);

    const getPrefersReducedMotion = MediaQueryMonitorUtils.createReducedMotion();

    ElementObserverUtils.createViewportRectObserver(getRootRef, getIsWindowVisible, {
        setElementRect: setRootRect,
    });

    const getTargetRects = ElementObserverUtils.createViewportRectListObserver(getTargets, getIsWindowVisible);

    const refs = new Map<number, HTMLElement>();
    const tSetters = new Map<number, Setter<number>>();

    createEffect(on([getParticleCount, getSpawnDelayMs, getSpawnIterationPatterns], () => setStageIndex(0)));

    createEffect(() => {
        let rafId: ReturnType<typeof requestAnimationFrame>;
        let timeout: ReturnType<typeof setTimeout>;

        onCleanup(() => {
            cancelAnimationFrame(rafId);
            clearTimeout(timeout);
            refs.clear();
            tSetters.clear();
            setLiveParticles([]);
        });

        const targets = getTargets();
        const particleCount = getParticleCount();
        const travelDurationMs = getTravelDurationMs();
        const retentionMs = getRetentionMs();
        const spawnDelayMs = getSpawnDelayMs();
        const pattern = getSpawnIterationPatterns()[getStageIndex()];
        const isWindowVisible = getIsWindowVisible();
        const isPlaying = getIsPlaying();
        const prefersReducedMotion = getPrefersReducedMotion();
        const hasRootRect = getHasRootRect();

        if (!hasRootRect || !isWindowVisible || !isPlaying || particleCount <= 0 || targets.length === 0 || !pattern)
            return;

        let repeatIndex = 0;
        let spawnedInRepeat = 0;
        let arrivedInRepeat = 0;
        let repeatStartMs = performance.now();

        const beginNextRepeat = () => {
            repeatIndex++;
            spawnedInRepeat = 0;
            arrivedInRepeat = 0;
            repeatStartMs = performance.now();
        };

        const spawnNext = () => {
            const targetIndex =
                props.computeTarget?.(spawnedInRepeat, targets.length) ??
                ParticleSpawnerUtils.pickRandomTarget(targets.length);

            spawnedInRepeat++;

            if (targetIndex === undefined) return;

            setLiveParticles((particles) => [
                ...particles,
                {
                    id: nextId++,
                    index: spawnedInRepeat - 1,
                    repeatIndex,
                    targetIndex,
                    spawnedAtMs: repeatStartMs + (spawnedInRepeat - 1) * spawnDelayMs,
                },
            ]);
        };

        const tick = (now: number) => {
            batch(() => {
                while (spawnedInRepeat < particleCount && now >= repeatStartMs + spawnedInRepeat * spawnDelayMs)
                    spawnNext();
            });

            const rootRect = getRootRect();
            const from = rootRect ? { x: rootRect.width * 0.5, y: rootRect.height * 0.5 } : undefined;
            const targetRects = getTargetRects();
            const arrived: number[] = [];

            for (const particle of getLiveParticles()) {
                const el = refs.get(particle.id);

                if (!el || !rootRect || !from) continue;

                const t = Math.min(1, (now - particle.spawnedAtMs) / travelDurationMs);

                tSetters.get(particle.id)?.(t);

                const targetRect = targetRects[particle.targetIndex];
                const to = targetRect ? ParticleSpawnerUtils.toRelativeCenter(targetRect, rootRect) : from;

                ParticleSpawnerUtils.assignParticlePos(
                    el,
                    props.computeParticlePos(
                        {
                            id: particle.id,
                            index: particle.index,
                            targetIndex: particle.targetIndex,
                            from,
                            to,
                            prefersReducedMotion,
                        },
                        t,
                    ),
                );

                if (now >= particle.spawnedAtMs + travelDurationMs + retentionMs) {
                    refs.delete(particle.id);
                    if (particle.repeatIndex === repeatIndex) arrivedInRepeat++;
                    props.onParticleArrive?.(particle.index);
                    arrived.push(particle.id);
                }
            }

            if (arrived.length > 0) setLiveParticles((particles) => particles.filter((p) => !arrived.includes(p.id)));

            if (spawnedInRepeat >= particleCount && arrivedInRepeat >= particleCount) {
                props.onIterationEnd?.();

                if (repeatIndex + 1 < pattern.count) {
                    beginNextRepeat();
                    rafId = requestAnimationFrame(tick);

                    return;
                }

                const nextIndex = pattern.nextIndex;

                if (nextIndex === undefined) {
                    props.onAnimationEnd?.();

                    return;
                }

                timeout = setTimeout(() => setStageIndex(nextIndex), pattern.beginDelayMs ?? NO_DELAY_MS);

                return;
            }

            rafId = requestAnimationFrame(tick);
        };

        rafId = requestAnimationFrame(tick);
    });

    onMount(() => {
        const handleVisibilityChange = () => setIsWindowVisible(document.visibilityState === "visible");

        document.addEventListener("visibilitychange", handleVisibilityChange);

        onCleanup(() => document.removeEventListener("visibilitychange", handleVisibilityChange));
    });

    return (
        <div ref={setRootRef} class={styles.particleSpawnerRoot} role="presentation" aria-hidden="true">
            <For each={getLiveParticles()}>
                {(particle) => {
                    const [getT, setT] = createSignal(0);

                    tSetters.set(particle.id, setT);
                    onCleanup(() => tSetters.delete(particle.id));

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
