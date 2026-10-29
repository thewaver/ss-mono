import { createEffect, createMemo, createSignal, on, onCleanup, onMount, untrack } from "solid-js";

import {
    type CellAnimationFn,
    CellAnimationKeyframeUtils,
    CellAnimationUtils,
    type CellStop,
    ElementObserverUtils,
    PARTICLE_FIELD_DEFAULTS,
    type ParticleFieldCellDefs,
    type ParticleFieldParticle,
    ParticleFieldStyles,
    ParticleFieldUtils,
    SignalMirrorSolidUtils,
    type SignalSource,
    access,
    useViewportContext,
} from "@thewaver/ss-components-solid";
import * as gpuStyles from "@thewaver/ss-playground/App/Pages/CellAnimationPage/CellAnimationPage.css";
import type {
    CellGpuCell,
    CellGpuItem,
} from "@thewaver/ss-playground/App/Pages/CellAnimationPage/CellGpu/CellGpu.types";
import { CellGpuUtils } from "@thewaver/ss-playground/App/Pages/CellAnimationPage/CellGpu/CellGpu.utils";
import { type Index2d, MathUtils, type Point2d, Size2d } from "@thewaver/ss-utils";

const NO_PROGRESS = 0;
const NO_STOPS: CellStop[] = [];
const LINEAR = CellGpuUtils.computeEasing(undefined);

export type GpuParticleFieldProps = {
    src: string;
    cellCount: Index2d | (() => Index2d);
    origin: Index2d | (() => Index2d);
    spawnChance?: number | (() => number);
    animationDurationMs?: number | (() => number);
    animationIterationCount?: number | (() => number);
    animationIterationDelayMs?: number | (() => number);
    particleLifetimeMs?: number | (() => number);
    playback?: SignalSource<boolean>;
    progress?: SignalSource<number>;
    animation: CellAnimationFn;
    computeParticleSize: (defs: ParticleFieldCellDefs) => Size2d;
    computeParticleTint?: (defs: ParticleFieldCellDefs) => string;
    computeCellWeights?: (count: Index2d) => number[][];
    computeShapePoints?: (size: Size2d) => Point2d[];
    shapeJoinRadii?: number[] | (() => number[] | undefined);
    computeParticlePos?: (defs: ParticleFieldCellDefs) => Point2d;
    onIterationEnd?: () => void;
    onAnimationEnd?: () => void;
};

export const GpuParticleField = (props: GpuParticleFieldProps) => {
    const viewportContext = useViewportContext();

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
    const [getCanvasRef, setCanvasRef] = createSignal<HTMLCanvasElement>();
    const [getItem, setItem] = createSignal<CellGpuItem>();
    const [getIsWindowVisible, setIsWindowVisible] = createSignal(true);
    const [getIsPlaying] = SignalMirrorSolidUtils.createOptional(() => props.playback, true);
    const [getProgress, setProgress] = SignalMirrorSolidUtils.createOptional(() => props.progress, NO_PROGRESS);
    const [getCurrentIteration, setCurrentIteration] = createSignal(0);
    const [getRootSize, setRootSize] = createSignal<Size2d>({ width: 0, height: 0 }, { equals: Size2d.isSame });
    const [getSourceVersion, setSourceVersion] = createSignal(0);
    const [getShown, setShown] = createSignal<Size2d>({ width: 0, height: 0 }, { equals: Size2d.isSame });

    const getCellCount = createMemo(
        () => CellAnimationUtils.computeCellCount(access(props.cellCount), getRootSize()),
        undefined,
        { equals: CellAnimationUtils.getIsSameCount },
    );

    const getShapeContour = createMemo(() =>
        ParticleFieldUtils.computeContour(
            props.computeShapePoints?.(getRootSize()),
            access(props.shapeJoinRadii),
            undefined,
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

    const getTables = createMemo(() => {
        const animation = props.animation;
        const origin = access(props.origin);
        const indices = new Map<CellStop[], number>();
        const byCell = new Map<ParticleFieldCellDefs, number>();

        for (const cell of getCells()) {
            const stops = CellAnimationKeyframeUtils.resolveStops(animation, { ...cell, origin }) ?? NO_STOPS;

            if (!indices.has(stops)) indices.set(stops, indices.size);

            byCell.set(cell, indices.get(stops) ?? 0);
        }

        return { tables: [...indices.keys()], byCell };
    });

    const getArea = createMemo(() => {
        const size = getRootSize();
        const cells = getCells();
        const particleSize = cells.reduce(
            (most, cell) => {
                const next = props.computeParticleSize(cell);

                return { width: Math.max(most.width, next.width), height: Math.max(most.height, next.height) };
            },
            { width: 0, height: 0 },
        );
        const reach = CellGpuUtils.computeReach(getTables().tables, particleSize, undefined);

        return { x: -reach, y: -reach, width: size.width + 2 * reach, height: size.height + 2 * reach };
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

    const roster = ParticleFieldUtils.createRoster();

    let instances: CellGpuCell[] = [];

    const toInstance = (particle: ParticleFieldParticle): CellGpuCell => {
        const size = props.computeParticleSize(particle.cell);

        return {
            left: particle.pos.x - size.width * 0.5,
            top: particle.pos.y - size.height * 0.5,
            width: size.width,
            height: size.height,
            weight: particle.spawnMs,
            table: getTables().byCell.get(particle.cell) ?? 0,
            tint: props.computeParticleTint ? CellGpuUtils.toTint(props.computeParticleTint(particle.cell)) : undefined,
        };
    };

    const draw = (clockMs: number) => {
        const item = getItem();

        if (!item) return;

        const scale = window.devicePixelRatio * viewportContext.getScale();

        const presented = item.draw({
            mode: "particles",
            src: props.src,
            tables: getTables().tables,
            easing: LINEAR,
            cells: instances,
            size: getRootSize(),
            area: getArea(),
            scale,
            timeline: 0,
            half: 0,
            isDescending: false,
            isShown: true,
            hasPerspective: false,
            clockMs,
            lifetimeMs: getLifetimeMs(),
        });

        setShown({ width: presented.width / scale, height: presented.height / scale });
    };

    createEffect(
        on(
            getCellCount,
            () => {
                roster.clear();
                instances = [];
                setCurrentIteration(0);
                setProgress(NO_PROGRESS);
            },
            { defer: true },
        ),
    );

    createEffect(() => {
        const canvasRef = getCanvasRef();

        if (!canvasRef) return;

        const item = CellGpuUtils.createItem(canvasRef, () => setSourceVersion((version) => version + 1), "transfer");

        setItem(item);

        onCleanup(() => {
            item?.dispose();
            setItem(undefined);
        });
    });

    createEffect(() => {
        const progress = MathUtils.clamp01(getProgress());

        getCells();
        getTables();
        getArea();
        getHasEnded();
        getLifetimeMs();
        getSpawnChance();
        getCurrentIteration();
        getSourceVersion();
        getItem();

        untrack(() => {
            const clockMs = progress * getDurationMs();
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

            if (hasChanged || instances.length !== particles.length) instances = particles.map(toInstance);

            draw(clockMs);
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
        const rootRef = getRootRef();

        if (rootRef) onCleanup(ElementObserverUtils.observeBorderBoxSize(rootRef, setRootSize));
    });

    onMount(() => {
        const handleVisibilityChange = () => setIsWindowVisible(document.visibilityState === "visible");

        document.addEventListener("visibilitychange", handleVisibilityChange);

        onCleanup(() => document.removeEventListener("visibilitychange", handleVisibilityChange));
    });

    return (
        <div ref={setRootRef} class={ParticleFieldStyles.particleFieldRoot} role="presentation" aria-hidden="true">
            <canvas
                ref={setCanvasRef}
                class={gpuStyles.gpuCellsCanvas}
                style={{
                    left: `${getArea().x}px`,
                    top: `${getArea().y}px`,
                    width: `${getShown().width}px`,
                    height: `${getShown().height}px`,
                }}
                aria-hidden="true"
            />
        </div>
    );
};
