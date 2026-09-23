import {
    For,
    type Setter,
    batch,
    createEffect,
    createMemo,
    createSignal,
    on,
    onCleanup,
    onMount,
    untrack,
} from "solid-js";

import { Rect } from "@thewaver/ss-utils";

import { ElementObserverUtils } from "../../Abstracts/ElementObserver/ElementObserver.utils";
import { MediaQueryMonitorUtils } from "../../Abstracts/MediaQueryMonitor/MediaQueryMonitor.utils";
import { SignalMirrorUtils } from "../../Abstracts/SignalMirror/SignalMirror.utils";
import { access } from "../../Utils/propUtils";
import { PARTICLE_SPAWNER_DEFAULTS } from "./ParticleSpawner.const";
import type { ParticleSpawnerController, ParticleSpawnerProps } from "./ParticleSpawner.types";
import { ParticleSpawnerUtils } from "./ParticleSpawner.utils";

import * as styles from "./ParticleSpawner.css";

const NO_DELAY_MS = 0;

let nextId = 0;

type Round = {
    count: number;
    startMs: number;
    spawnDelayMs: number;
    travelDurationMs: number;
    retentionMs: number;
    spawnedCount: number;
    arrivedCount: number;
    onEnd?: () => void;
};

type LiveParticle = {
    id: number;
    index: number;
    round: Round;
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

    const getParticleCount = createMemo(() => ParticleSpawnerUtils.toParticleCount(access(props.particleCount)));
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
    const rounds = new Set<Round>();

    let rafId: ReturnType<typeof requestAnimationFrame> | undefined;

    const getCanSpawn = () => getHasRootRect() && getIsWindowVisible() && getTargets().length > 0;

    const spawnNext = (round: Round, targetCount: number) => {
        const index = round.spawnedCount;
        const targetIndex =
            props.computeTarget?.(index, targetCount) ?? ParticleSpawnerUtils.pickRandomTarget(targetCount);

        round.spawnedCount++;

        if (targetIndex === undefined) {
            round.arrivedCount++;

            return;
        }

        setLiveParticles((particles) => [
            ...particles,
            { id: nextId++, index, round, targetIndex, spawnedAtMs: round.startMs + index * round.spawnDelayMs },
        ]);
    };

    const tick = (now: number) => {
        rafId = undefined;

        const targetCount = getTargets().length;

        batch(() => {
            for (const round of rounds)
                while (
                    round.spawnedCount < round.count &&
                    now >= round.startMs + round.spawnedCount * round.spawnDelayMs
                )
                    spawnNext(round, targetCount);
        });

        const rootRect = getRootRect();
        const from = rootRect ? { x: rootRect.width * 0.5, y: rootRect.height * 0.5 } : undefined;
        const targetRects = getTargetRects();
        const prefersReducedMotion = getPrefersReducedMotion();
        const arrived: LiveParticle[] = [];

        for (const particle of getLiveParticles()) {
            const el = refs.get(particle.id);

            if (!el || !rootRect || !from) continue;

            const { travelDurationMs, retentionMs } = particle.round;
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

            if (now >= particle.spawnedAtMs + travelDurationMs + retentionMs) arrived.push(particle);
        }

        if (arrived.length > 0) {
            setLiveParticles((particles) => particles.filter((particle) => !arrived.includes(particle)));

            for (const particle of arrived) {
                refs.delete(particle.id);
                particle.round.arrivedCount++;
                props.onParticleArrive?.(particle.index);
            }
        }

        const ended = [...rounds].filter(
            (round) => round.spawnedCount >= round.count && round.arrivedCount >= round.count,
        );

        for (const round of ended) {
            rounds.delete(round);
            round.onEnd?.();
        }

        if (rounds.size > 0 && rafId === undefined) rafId = requestAnimationFrame(tick);
    };

    const startRound = (count: number, onEnd?: () => void) => {
        const round: Round = {
            count,
            startMs: performance.now(),
            spawnDelayMs: getSpawnDelayMs(),
            travelDurationMs: getTravelDurationMs(),
            retentionMs: getRetentionMs(),
            spawnedCount: 0,
            arrivedCount: 0,
            onEnd,
        };

        rounds.add(round);

        if (rafId === undefined) rafId = requestAnimationFrame(tick);

        return round;
    };

    const dropRound = (round: Round) => {
        rounds.delete(round);

        setLiveParticles((particles) =>
            particles.filter((particle) => {
                if (particle.round !== round) return true;

                refs.delete(particle.id);

                return false;
            }),
        );
    };

    const controller: ParticleSpawnerController = {
        emit: (count: number) =>
            untrack(() => {
                const particleCount = ParticleSpawnerUtils.toParticleCount(count);

                if (particleCount <= 0 || !getCanSpawn()) return false;

                startRound(particleCount);

                return true;
            }),
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

        let round: Round | undefined;
        let repeatIndex = 0;
        let timeout: ReturnType<typeof setTimeout>;

        onCleanup(() => {
            clearTimeout(timeout);

            if (round) dropRound(round);
        });

        const handleRoundEnd = () => {
            round = undefined;
            repeatIndex++;
            props.onIterationEnd?.();

            if (repeatIndex < pattern.count) {
                round = startRound(particleCount, handleRoundEnd);

                return;
            }

            const nextIndex = pattern.nextIndex;

            if (nextIndex === undefined) {
                props.onAnimationEnd?.();

                return;
            }

            timeout = setTimeout(() => setStageIndex(nextIndex), pattern.beginDelayMs ?? NO_DELAY_MS);
        };

        round = startRound(particleCount, handleRoundEnd);
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
        if (rafId !== undefined) cancelAnimationFrame(rafId);

        rounds.clear();
        refs.clear();
        tSetters.clear();
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
