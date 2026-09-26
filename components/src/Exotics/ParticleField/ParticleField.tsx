import { For, type Setter, createEffect, createMemo, createSignal, on, onCleanup, onMount, untrack } from "solid-js";

import { type Index2d, MathUtils, type Point2d, ShapeUtils, Size2d } from "@thewaver/ss-utils";

import { SignalMirrorUtils } from "../../Abstracts/SignalMirror/SignalMirror.utils";
import { access } from "../../Utils/propUtils";
import { CellAnimationUtils } from "../CellAnimation/CellAnimation.utils";
import { PARTICLE_FIELD_DEFAULTS } from "./ParticleField.const";
import type { ParticleFieldCellDefs, ParticleFieldProps } from "./ParticleField.types";
import { ParticleFieldUtils } from "./ParticleField.utils";

import * as styles from "./ParticleField.css";

const DEFAULT_CELL_WEIGHT = 0;
const NO_PROGRESS = 0;
const NO_EDGE_THICKNESSES = [0];
const SEED_RANGE = 4294967296;

let nextId = 0;

type LiveParticle = {
    id: number;
    cell: ParticleFieldCellDefs;
    spawnMs: number;
    pos: Point2d;
};

const toCellKey = (cell: ParticleFieldCellDefs) => cell.pos.row * cell.count.col + cell.pos.col;

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
    const [getIsPlaying] = SignalMirrorUtils.createOptional(() => props.playbackSignal, true);
    const [getProgress, setProgress] = SignalMirrorUtils.createOptional(() => props.progressSignal, NO_PROGRESS);
    const [getCurrentIteration, setCurrentIteration] = createSignal(0);
    const [getRootSize, setRootSize] = createSignal<Size2d>({ width: 0, height: 0 }, { equals: Size2d.isSame });
    const [getLiveParticles, setLiveParticles] = createSignal<LiveParticle[]>([]);

    const getCellCount = createMemo<Index2d, undefined>(
        () => {
            const cellCount = access(props.cellCount);
            const rootSize = getRootSize();

            return {
                col: MathUtils.clamp(Math.round(cellCount.col), 1, Math.max(Math.round(rootSize.width), 1)),
                row: MathUtils.clamp(Math.round(cellCount.row), 1, Math.max(Math.round(rootSize.height), 1)),
            };
        },
        undefined,
        { equals: (prev, next) => prev.col === next.col && prev.row === next.row },
    );

    const getShapeOutline = createMemo(() => {
        const points = props.computeShapePoints?.(getRootSize());

        if (!points) return undefined;

        return ShapeUtils.getPaths(
            points,
            NO_EDGE_THICKNESSES,
            access(props.shapeJoinRadii),
            access(props.shapeLameExponents),
        ).outerOutline;
    });

    const getCells = createMemo(() => {
        const count = getCellCount();
        const rootSize = getRootSize();
        const weights = props.computeCellWeights?.(count) ?? [];
        const outline = getShapeOutline();
        const size = { width: rootSize.width / count.col, height: rootSize.height / count.row };
        const cells: ParticleFieldCellDefs[] = [];

        for (let row = 0; row < count.row; row++) {
            for (let col = 0; col < count.col; col++) {
                const rect = { x: col * size.width, y: row * size.height, ...size };

                if (outline && !ParticleFieldUtils.isPointInPolygon(ParticleFieldUtils.toCenter(rect), outline)) {
                    continue;
                }

                cells.push({
                    pos: { col, row },
                    count,
                    weight: weights[row]?.[col] ?? DEFAULT_CELL_WEIGHT,
                    size,
                    rect,
                });
            }
        }

        return cells;
    });

    const getHasEnded = createMemo(() => getCurrentIteration() >= getIterationCount());

    const getIsRunning = createMemo(
        () =>
            getIsPlaying() &&
            getIsWindowVisible() &&
            !getHasEnded() &&
            getRootSize().width > 0 &&
            getRootSize().height > 0,
    );

    const seed = Math.floor(Math.random() * SEED_RANGE);
    const refs = new Map<number, HTMLElement>();
    const tSetters = new Map<number, Setter<number>>();

    let particlesByCell = new Map<number, LiveParticle>();
    let clockMs = 0;

    const applyParticle = (particle: LiveParticle, el: HTMLElement | undefined) => {
        const t = ParticleFieldUtils.computeLife(clockMs, particle.spawnMs, getLifetimeMs());

        tSetters.get(particle.id)?.(t);

        if (el && props.computeParticleAnimation) {
            CellAnimationUtils.assignAnimationProps(el, props.computeParticleAnimation(particle.cell, t));
        }
    };

    const refresh = () => {
        const durationMs = getDurationMs();
        const lifetimeMs = getLifetimeMs();
        const spawnChance = getSpawnChance();
        const pass = getCurrentIteration();
        const next = new Map<number, LiveParticle>();

        let hasChanged = false;

        if (!getHasEnded()) {
            for (const cell of getCells()) {
                const spawnMs = ParticleFieldUtils.computeBatchSpawnMs(cell.weight, durationMs, lifetimeMs);

                if (clockMs < spawnMs || clockMs >= spawnMs + lifetimeMs) continue;

                const key = toCellKey(cell);

                if (ParticleFieldUtils.computeRoll(seed, pass, key) >= spawnChance) continue;

                const existing = particlesByCell.get(key);

                if (existing) {
                    existing.spawnMs = spawnMs;
                    next.set(key, existing);
                } else {
                    next.set(key, {
                        id: nextId++,
                        cell,
                        spawnMs,
                        pos: props.computeParticlePos?.(cell) ?? ParticleFieldUtils.toCenter(cell.rect),
                    });
                    hasChanged = true;
                }
            }
        }

        if (next.size !== particlesByCell.size) hasChanged = true;

        particlesByCell = next;

        if (hasChanged) setLiveParticles([...next.values()]);

        for (const particle of next.values()) applyParticle(particle, refs.get(particle.id));
    };

    createEffect(
        on(
            getCellCount,
            () => {
                particlesByCell = new Map();
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

        let frameId: ReturnType<typeof requestAnimationFrame> | undefined;
        let timeout: ReturnType<typeof setTimeout> | undefined;
        let lastMs = performance.now();

        onCleanup(() => {
            if (frameId !== undefined) cancelAnimationFrame(frameId);

            clearTimeout(timeout);
        });

        const advance = (nowMs: number) => {
            const durationMs = getDurationMs();
            const elapsedMs = Math.max(nowMs - lastMs, 0);
            const next =
                durationMs > 0 ? Math.min(MathUtils.clamp01(untrack(getProgress)) + elapsedMs / durationMs, 1) : 1;

            lastMs = nowMs;
            setProgress(next);

            if (next < 1) {
                frameId = requestAnimationFrame(advance);

                return;
            }

            props.onIterationEnd?.();

            if (untrack(getCurrentIteration) + 1 >= getIterationCount()) {
                props.onAnimationEnd?.();
                setCurrentIteration((v) => v + 1);

                return;
            }

            timeout = setTimeout(() => {
                setProgress(NO_PROGRESS);
                setCurrentIteration((v) => v + 1);
                lastMs = performance.now();
                frameId = requestAnimationFrame(advance);
            }, getIterationDelayMs());
        };

        frameId = requestAnimationFrame(advance);
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
