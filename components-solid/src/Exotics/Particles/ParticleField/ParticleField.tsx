import { For, type Setter, createEffect, createMemo, createSignal, on, onCleanup, onMount, untrack } from "solid-js";

import {
    CellAnimationUtils,
    PARTICLE_FIELD_DEFAULTS,
    type ParticleFieldParticle,
    ParticleFieldUtils,
    ParticleFieldStyles as styles,
} from "@thewaver/ss-components";
import { MathUtils, Size2d } from "@thewaver/ss-utils";

import { SignalMirrorSolidUtils } from "../../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { access } from "../../../Utils/propUtils";
import type { ParticleFieldProps } from "./ParticleFieldSolid.types";

const NO_PROGRESS = 0;

export const ParticleField = (props: ParticleFieldProps) => {
    const getSpawnChance = createMemo(() => access(props.spawnChance) ?? PARTICLE_FIELD_DEFAULTS.spawnChance);

    const getDurationMs = createMemo(
        () => access(props.animationDurationMs) ?? PARTICLE_FIELD_DEFAULTS.animationDurationMs,
    );

    const getIterationCount = createMemo(
        () => access(props.animationIterationCount) ?? PARTICLE_FIELD_DEFAULTS.animationIterationCount,
    );

    const getIterationDelayMs = createMemo(
        () => access(props.animationIterationDelayMs) ?? PARTICLE_FIELD_DEFAULTS.animationIterationDelayMs,
    );

    const getLifetimeMs = createMemo(() =>
        Math.min(access(props.particleLifetimeMs) ?? PARTICLE_FIELD_DEFAULTS.particleLifetimeMs, getDurationMs()),
    );

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getIsWindowVisible, setIsWindowVisible] = createSignal(true);
    const [getIsPlaying] = SignalMirrorSolidUtils.createOptional(() => props.playback, true);
    const [getProgress, setProgress] = SignalMirrorSolidUtils.createOptional(() => props.progress, NO_PROGRESS);
    const [getCurrentIteration, setCurrentIteration] = createSignal(0);
    const [getRootSize, setRootSize] = createSignal<Size2d>({ width: 0, height: 0 }, { equals: Size2d.isSame });
    const [getLiveParticles, setLiveParticles] = createSignal<ParticleFieldParticle[]>([]);

    const getCellCount = createMemo(
        () => CellAnimationUtils.computeCellCount(access(props.cellCount), getRootSize()),
        undefined,
        { equals: CellAnimationUtils.getIsSameCount },
    );

    const getShapeContour = createMemo(() =>
        ParticleFieldUtils.computeContour(
            props.computeShapePoints?.(getRootSize()),
            access(props.shapeJoinRadii),
            access(props.shapeLameExponents),
        ),
    );

    const getCells = createMemo(() =>
        ParticleFieldUtils.computeCells(
            getCellCount(),
            getRootSize(),
            props.computeCellWeights?.(getCellCount()) ?? [],
            getShapeContour(),
        ),
    );

    const getHasEnded = createMemo(() => getCurrentIteration() >= getIterationCount());

    const getIsRunning = createMemo(
        () =>
            getIsPlaying() &&
            getIsWindowVisible() &&
            !getHasEnded() &&
            getRootSize().width > 0 &&
            getRootSize().height > 0,
    );

    const roster = ParticleFieldUtils.createRoster();
    const refs = new Map<number, HTMLElement>();
    const tSetters = new Map<number, Setter<number>>();

    let clockMs = 0;

    const applyParticle = (particle: ParticleFieldParticle, el: HTMLElement | undefined) => {
        const t = ParticleFieldUtils.computeLife(clockMs, particle.spawnMs, getLifetimeMs());

        tSetters.get(particle.id)?.(t);

        if (el && props.computeParticleAnimation) {
            CellAnimationUtils.assignAnimationProps(el, props.computeParticleAnimation(particle.cell, t));
        }
    };

    const refresh = () => {
        const { particles, hasChanged } = roster.refresh({
            count: getCellCount(),
            cells: getCells(),
            clockMs,
            durationMs: getDurationMs(),
            lifetimeMs: getLifetimeMs(),
            spawnChance: getSpawnChance(),
            pass: getCurrentIteration(),
            hasEnded: getHasEnded(),
            computeParticlePos: props.computeParticlePos,
        });

        if (hasChanged) setLiveParticles(particles);

        for (const particle of particles) applyParticle(particle, refs.get(particle.id));
    };

    createEffect(
        on(
            getCellCount,
            () => {
                roster.clear();
                setLiveParticles([]);
                setCurrentIteration(0);
                setProgress(NO_PROGRESS);
            },
            { defer: true },
        ),
    );

    createEffect(() => {
        const progress = MathUtils.clamp01(getProgress());

        getCells();
        getHasEnded();
        getLifetimeMs();
        getSpawnChance();
        getCurrentIteration();

        untrack(() => {
            clockMs = progress * getDurationMs();
            refresh();
        });
    });

    createEffect(() => {
        if (!getIsRunning()) return;

        onCleanup(
            CellAnimationUtils.runPasses({
                getProgress: () => untrack(getProgress),
                setProgress,
                getCurrentIteration: () => untrack(getCurrentIteration),
                setCurrentIteration,
                getDurationMs,
                getIterationCount,
                getIterationDelayMs,
                onIterationEnd: () => props.onIterationEnd?.(),
                onAnimationEnd: () => props.onAnimationEnd?.(),
            }),
        );
    });

    createEffect(() => {
        let resizeObserver: ResizeObserver | undefined;

        onCleanup(() => {
            resizeObserver?.disconnect();
        });

        const rootRef = getRootRef();

        if (!rootRef) return;

        resizeObserver = new ResizeObserver(() => {
            setRootSize({ width: rootRef.offsetWidth, height: rootRef.offsetHeight });
        });
        resizeObserver.observe(rootRef);
    });

    onMount(() => {
        const handleVisibilityChange = () => setIsWindowVisible(document.visibilityState === "visible");

        document.addEventListener("visibilitychange", handleVisibilityChange);

        onCleanup(() => document.removeEventListener("visibilitychange", handleVisibilityChange));
    });

    onCleanup(() => {
        refs.clear();
        tSetters.clear();
    });

    return (
        <div ref={setRootRef} class={styles.particleFieldRoot} role="presentation" aria-hidden="true">
            <For each={getLiveParticles()}>
                {(particle) => {
                    const [getT, setT] = createSignal(
                        ParticleFieldUtils.computeLife(clockMs, particle.spawnMs, getLifetimeMs()),
                    );

                    tSetters.set(particle.id, setT);

                    onCleanup(() => {
                        tSetters.delete(particle.id);
                        refs.delete(particle.id);
                    });

                    return (
                        <div
                            class={styles.particleFieldItem}
                            style={{ left: `${particle.pos.x}px`, top: `${particle.pos.y}px` }}
                        >
                            <div
                                class={styles.particleFieldBody}
                                ref={(el) => {
                                    refs.set(particle.id, el);
                                    applyParticle(particle, el);
                                }}
                            >
                                {props.renderParticle(particle.cell, getT)}
                            </div>
                        </div>
                    );
                }}
            </For>
        </div>
    );
};
