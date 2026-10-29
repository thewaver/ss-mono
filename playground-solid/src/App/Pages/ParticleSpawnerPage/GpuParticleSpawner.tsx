import { createEffect, createMemo, createSignal, on, onCleanup, onMount, untrack } from "solid-js";

import {
    ElementObserverUtils,
    MediaQueryMonitorSolidUtils,
    PARTICLE_SPAWNER_DEFAULTS,
    type ParticleSpawnIterationPattern,
    type ParticleSpawnerFrame,
    ParticleSpawnerStyles,
    ParticleSpawnerUtils,
    type ParticleTravelDefs,
    SignalMirrorSolidUtils,
    type SignalSource,
    access,
    accessStore,
    useViewportContext,
} from "@thewaver/ss-components-solid";
import * as gpuStyles from "@thewaver/ss-playground/App/Pages/CellAnimationPage/CellAnimationPage.css";
import type {
    CellGpuCell,
    CellGpuItem,
} from "@thewaver/ss-playground/App/Pages/CellAnimationPage/CellGpu/CellGpu.types";
import { CellGpuUtils } from "@thewaver/ss-playground/App/Pages/CellAnimationPage/CellGpu/CellGpu.utils";
import { type CSSAnimationValues, type Point2d, type Rect, Size2d } from "@thewaver/ss-utils";

const LINEAR = CellGpuUtils.computeEasing(undefined);
const AREA_STEP_PX = 64;
const NO_AREA: Rect = { x: 0, y: 0, width: 1, height: 1 };
const UNUSED_SIZE: Size2d = { width: 1, height: 1 };
const PERCENT = 100;

type Placed = { defs: ParticleTravelDefs; pos: Point2d; t: number };

const toValue = (value: number | number[] | undefined, idx: number) =>
    Array.isArray(value) ? value[idx] : idx === 0 ? value : undefined;

const toDirect = (values: CSSAnimationValues, size: Size2d) => {
    const scaleX =
        ((toValue(values.scale, 0) ?? PERCENT) * (toValue(values.scaleX, 0) ?? PERCENT)) / (PERCENT * PERCENT);
    const scaleY =
        ((toValue(values.scale, 1) ?? toValue(values.scale, 0) ?? PERCENT) * (toValue(values.scaleY, 0) ?? PERCENT)) /
        (PERCENT * PERCENT);
    const shiftX = (((toValue(values.translate, 0) ?? 0) + (Number(values.translateX) || 0)) * size.width) / PERCENT;
    const shiftY = (((toValue(values.translate, 1) ?? 0) + (Number(values.translateY) || 0)) * size.height) / PERCENT;
    const opacity = (Number(values.opacity ?? PERCENT) || 0) / PERCENT;
    const rotate = Number(values.rotate ?? 0) || 0;

    return { scaleX, scaleY, shiftX, shiftY, opacity, rotate };
};

const snapOut = (value: number) => Math.floor(value / AREA_STEP_PX) * AREA_STEP_PX;

const snapIn = (value: number) => Math.ceil(value / AREA_STEP_PX) * AREA_STEP_PX;

export type GpuParticleSpawnerProps = {
    src: string;
    particleSize: Size2d;
    targets: (HTMLElement | undefined)[] | (() => (HTMLElement | undefined)[]);
    particleCount: number | (() => number);
    travelDurationMs?: number | (() => number);
    restDurationMs?: number | (() => number);
    spawnDelayMs?: number | (() => number);
    spawnIterationPatterns?: ParticleSpawnIterationPattern[] | (() => ParticleSpawnIterationPattern[]);
    playback?: SignalSource<boolean>;
    computeTarget?: (index: number, targetCount: number) => number;
    computeParticlePos: (defs: ParticleTravelDefs, t: number) => Point2d;
    computeParticleAnimation?: (defs: ParticleTravelDefs, t: number) => CSSAnimationValues;
    computeParticleTint?: (defs: ParticleTravelDefs) => string;
    onParticleArrive?: (index: number) => void;
    onIterationEnd?: () => void;
    onAnimationEnd?: () => void;
};

export const GpuParticleSpawner = (props: GpuParticleSpawnerProps) => {
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
    const [getCanvasRef, setCanvasRef] = createSignal<HTMLCanvasElement>();
    const [getItem, setItem] = createSignal<CellGpuItem>();
    const [getArea, setArea] = createSignal<Rect>(NO_AREA);
    const [getShown, setShown] = createSignal<Size2d>({ width: 0, height: 0 }, { equals: Size2d.isSame });
    const [getIsWindowVisible, setIsWindowVisible] = createSignal(true);
    const [getIsPlaying] = SignalMirrorSolidUtils.createOptional(() => props.playback, true);
    const [getStageIndex, setStageIndex] = createSignal(0, { equals: false });

    const getPrefersReducedMotion = MediaQueryMonitorSolidUtils.createReducedMotion();

    const viewportContext = useViewportContext();

    const stand = new Map<number, HTMLElement>();
    const placed = new Map<number, Placed>();

    const getCanSpawn = () => !!getRootRef() && getIsWindowVisible() && getTargets().length > 0;

    const measureFrame = (): ParticleSpawnerFrame => {
        const rootRef = getRootRef();

        return {
            rootRect: rootRef ? ElementObserverUtils.measureViewportRect(rootRef, viewportContext) : undefined,
            targetRects: ElementObserverUtils.measureViewportRects(getTargets(), viewportContext),
            prefersReducedMotion: getPrefersReducedMotion(),
        };
    };

    const draw = () => {
        const item = getItem();
        const rootRef = getRootRef();

        if (!item || !rootRef) return;

        const live = untrack(getLiveParticles);
        const cells: CellGpuCell[] = [];

        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        for (const particle of live) {
            const entry = placed.get(particle.id);

            if (!entry) continue;

            const direct = toDirect(props.computeParticleAnimation?.(entry.defs, entry.t) ?? {}, props.particleSize);
            const x = entry.pos.x + direct.shiftX;
            const y = entry.pos.y + direct.shiftY;
            const reach =
                Math.max(direct.scaleX, direct.scaleY, 1) *
                Math.hypot(props.particleSize.width, props.particleSize.height) *
                0.5;

            minX = Math.min(minX, x - reach);
            minY = Math.min(minY, y - reach);
            maxX = Math.max(maxX, x + reach);
            maxY = Math.max(maxY, y + reach);
            cells.push({
                left: x - props.particleSize.width * 0.5,
                top: y - props.particleSize.height * 0.5,
                width: props.particleSize.width,
                height: props.particleSize.height,
                weight: 0,
                table: 0,
                tint: props.computeParticleTint
                    ? CellGpuUtils.toTint(props.computeParticleTint(entry.defs))
                    : undefined,
                direct: [direct.scaleX, direct.scaleY, direct.rotate, direct.opacity],
            });
        }

        const current = untrack(getArea);
        const area =
            cells.length === 0
                ? NO_AREA
                : {
                      x: Math.min(current === NO_AREA ? Infinity : current.x, snapOut(minX)),
                      y: Math.min(current === NO_AREA ? Infinity : current.y, snapOut(minY)),
                      width: 0,
                      height: 0,
                  };

        if (cells.length > 0) {
            const right = Math.max(current === NO_AREA ? -Infinity : current.x + current.width, snapIn(maxX));
            const bottom = Math.max(current === NO_AREA ? -Infinity : current.y + current.height, snapIn(maxY));

            area.width = right - area.x;
            area.height = bottom - area.y;
        }

        if (
            area.x !== current.x ||
            area.y !== current.y ||
            area.width !== current.width ||
            area.height !== current.height
        ) {
            setArea(area);
        }

        const scale = window.devicePixelRatio * viewportContext.getScale();

        const presented = item.draw({
            mode: "direct",
            src: props.src,
            tables: [],
            easing: LINEAR,
            cells,
            size: UNUSED_SIZE,
            area,
            scale,
            timeline: 0,
            half: 0,
            isDescending: false,
            isShown: cells.length > 0,
            hasPerspective: false,
        });

        setShown({ width: presented.width / scale, height: presented.height / scale });
    };

    const engine = ParticleSpawnerUtils.createEngine({
        getTargetCount: () => getTargets().length,
        computeTarget: (index, targetCount) => props.computeTarget?.(index, targetCount),
        getElement: (id) => {
            const existing = stand.get(id);

            if (existing) return existing;

            const next = { style: {} } as HTMLElement;

            stand.set(id, next);

            return next;
        },
        getFrame: measureFrame,
        getTiming: () => ({
            spawnDelayMs: getSpawnDelayMs(),
            travelDurationMs: getTravelDurationMs(),
            restDurationMs: getRestDurationMs(),
        }),
        getCanSpawn,
        computeParticlePos: (travel, t) => {
            const pos = props.computeParticlePos(travel, t);

            placed.set(travel.id, { defs: travel, pos, t });

            return pos;
        },
        onParticleArrive: (index) => props.onParticleArrive?.(index),
        onTick: draw,
    });

    const getLiveParticles = accessStore(engine.particles);

    createEffect(
        on(getLiveParticles, (particles) => {
            const ids = new Set(particles.map((particle) => particle.id));

            for (const id of [...placed.keys()]) {
                if (!ids.has(id)) {
                    placed.delete(id);
                    stand.delete(id);
                }
            }

            if (particles.length === 0) untrack(draw);
        }),
    );

    createEffect(() => CellGpuUtils.preloadSource(props.src, () => undefined));

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

    createEffect(() => {
        const canvasRef = getCanvasRef();

        if (!canvasRef) return;

        const item = CellGpuUtils.createItem(canvasRef, () => undefined, "transfer");

        setItem(item);

        onCleanup(() => {
            item?.dispose();
            setItem(undefined);
        });
    });

    onMount(() => {
        const handleVisibilityChange = () => setIsWindowVisible(document.visibilityState === "visible");

        document.addEventListener("visibilitychange", handleVisibilityChange);

        onCleanup(() => document.removeEventListener("visibilitychange", handleVisibilityChange));
    });

    onCleanup(() => {
        engine.stop();
        placed.clear();
        stand.clear();
    });

    return (
        <div ref={setRootRef} class={ParticleSpawnerStyles.particleSpawnerRoot} role="presentation" aria-hidden="true">
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
