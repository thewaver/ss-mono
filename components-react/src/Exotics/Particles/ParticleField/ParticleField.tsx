import { type CSSProperties, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import {
    CellAnimationUtils,
    PARTICLE_FIELD_DEFAULTS,
    type ParticleFieldCellDefs,
    type ParticleFieldParticle,
    ParticleFieldStyles,
    ParticleFieldUtils,
    type SliceAnimationSlice,
    SliceAnimationUtils,
    type SliceRendererSlice,
    SliceRendererStyles,
    SliceRendererUtils,
} from "@thewaver/ss-components";
import { ParticleFieldConst } from "@thewaver/ss-components/internal";
import { MathUtils, Size2d } from "@thewaver/ss-utils";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ElementObserverReactUtils } from "../../../Abstracts/ElementObserver/ElementObserverReact.utils";
import { InteractionTrackerReactUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerReact.utils";
import { SignalMirrorReactUtils } from "../../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { SliceRendererReactUtils } from "../../../Abstracts/SliceRenderer/SliceRendererReact.utils";
import { useViewportContext } from "../../../Abstracts/Viewport/Viewport.context";
import { useLatest } from "../../../Utils/refUtils";
import type { ParticleFieldProps } from "./ParticleField.types";

const LINEAR = SliceRendererUtils.computeEasing(undefined);
const NO_TABLES = { tables: [[]], tableIndices: [] };

export const ParticleField = (props: ParticleFieldProps) => {
    const spawnChance = props.spawnChance ?? PARTICLE_FIELD_DEFAULTS.spawnChance;
    const durationMs = props.animationDurationMs ?? PARTICLE_FIELD_DEFAULTS.animationDurationMs;
    const iterationCount = props.animationIterationCount ?? PARTICLE_FIELD_DEFAULTS.animationIterationCount;
    const iterationDelayMs = props.animationIterationDelayMs ?? PARTICLE_FIELD_DEFAULTS.animationIterationDelayMs;
    const lifetimeMs = Math.min(props.particleLifetimeMs ?? PARTICLE_FIELD_DEFAULTS.particleLifetimeMs, durationMs);
    const origin = props.origin ?? PARTICLE_FIELD_DEFAULTS.origin;
    const renderer = props.renderer ?? PARTICLE_FIELD_DEFAULTS.renderer;

    const viewportContext = useViewportContext();

    const rootRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const bodyRefs = useRef(new Map<number, HTMLDivElement>());
    const tintsRef = useRef(new Map<number, string | undefined>());

    const isPageHidden = InteractionTrackerReactUtils.usePageHidden();

    const [isPlaying] = SignalMirrorReactUtils.useOptionalState(props.playback, true);
    const [progress, setProgressState] = SignalMirrorReactUtils.useOptionalState(
        props.progress,
        ParticleFieldConst.NO_PROGRESS,
    );
    const [currentIteration, setCurrentIterationState] = useState(ParticleFieldConst.FIRST_ITERATION);
    const [shownSize, setShownSize] = useState<Size2d>({ width: 0, height: 0 });

    const rootSize = ElementObserverReactUtils.useBorderBoxSize(rootRef);

    const progressRef = useLatest(progress);
    const iterationRef = useLatest(currentIteration);

    const setProgress = (value: number) => {
        progressRef.current = value;
        setProgressState(value);
    };

    const setCurrentIteration = (value: number) => {
        iterationRef.current = value;
        setCurrentIterationState(value);
    };

    const latest = useLatest({ props, durationMs, iterationCount, iterationDelayMs, setProgress, setCurrentIteration });

    const cellCount = CellAnimationUtils.computeCellCount(props.cellCount, rootSize);

    const contour = useMemo(
        () =>
            ParticleFieldUtils.computeContour(
                props.computeShapePoints?.(rootSize),
                props.shapeJoinRadii,
                props.shapeLameExponents,
            ),
        [props.computeShapePoints, props.shapeJoinRadii, props.shapeLameExponents, rootSize],
    );

    const cells = useMemo(
        () =>
            ParticleFieldUtils.computeCells(
                cellCount,
                rootSize,
                props.computeCellWeights?.(cellCount) ?? ParticleFieldConst.NO_WEIGHTS,
                contour,
            ),
        [cellCount.col, cellCount.row, rootSize, props.computeCellWeights, contour],
    );

    const slices = useMemo(
        () => new Map<ParticleFieldCellDefs, SliceAnimationSlice>(cells.map((cell) => [cell, { ...cell, origin }])),
        [cells, origin.row, origin.col],
    );

    const isElementsOnly = renderer === "elements";

    const isAvailable = SliceRendererReactUtils.useIsAvailable(isElementsOnly);

    const picture = SliceRendererReactUtils.usePicture(props.src, isElementsOnly);

    const tables = useMemo(() => {
        if (isElementsOnly) return undefined;

        const animation = props.computeParticleAnimation;

        return animation ? SliceAnimationUtils.resolveTables(animation, [...slices.values()]) : NO_TABLES;
    }, [isElementsOnly, props.computeParticleAnimation, slices]);

    const tableByCell = useMemo(() => {
        const tableIndices = tables?.tableIndices ?? [];

        return new Map(cells.map((cell, idx) => [cell, tableIndices[idx] ?? 0]));
    }, [cells, tables]);

    const isOnGraphicsCard = isAvailable && SliceRendererUtils.getCanDraw(renderer, picture) && !!tables;

    const item = SliceRendererReactUtils.useItem(canvasRef, isAvailable);

    const area = useMemo(() => {
        const largest = cells.reduce(
            (most, cell) => ({
                width: Math.max(most.width, cell.size.width),
                height: Math.max(most.height, cell.size.height),
            }),
            { width: 0, height: 0 },
        );
        const reach = SliceRendererUtils.computeReach(tables?.tables ?? [], largest, undefined);

        return { x: -reach, y: -reach, width: rootSize.width + 2 * reach, height: rootSize.height + 2 * reach };
    }, [cells, tables, rootSize]);

    const hasEnded = currentIteration >= iterationCount;

    const isRunning = isPlaying && !isPageHidden && !hasEnded && rootSize.width > 0 && rootSize.height > 0;

    const clockMs = MathUtils.clamp01(progress) * durationMs;

    const [roster] = useState(() => ParticleFieldUtils.createRoster());

    const particles = useMemo(
        () =>
            roster.refresh({
                count: cellCount,
                cells,
                clockMs,
                durationMs,
                lifetimeMs,
                spawnChance,
                pass: currentIteration,
                hasEnded,
                computeParticlePos: latest.current.props.computeParticlePos,
            }).particles,
        [roster, cells, clockMs, durationMs, lifetimeMs, spawnChance, currentIteration, hasEnded],
    );

    const getTint = (particle: ParticleFieldParticle) => {
        const tints = tintsRef.current;

        if (!tints.has(particle.id)) tints.set(particle.id, latest.current.props.computeParticleTint?.(particle.cell));

        return tints.get(particle.id);
    };

    const rendererSlices = useMemo(
        () =>
            isOnGraphicsCard
                ? particles.map((particle): SliceRendererSlice => {
                      const tint = getTint(particle);

                      return {
                          left: particle.pos.x - particle.cell.size.width * 0.5,
                          top: particle.pos.y - particle.cell.size.height * 0.5,
                          width: particle.cell.size.width,
                          height: particle.cell.size.height,
                          weight: particle.spawnMs,
                          table: tableByCell.get(particle.cell) ?? 0,
                          tint: tint === undefined ? undefined : SliceRendererUtils.toTint(tint),
                      };
                  })
                : [],
        [isOnGraphicsCard, particles, tableByCell],
    );

    const drawnCountRef = useRef(cellCount);

    useLayoutEffect(() => {
        if (CellAnimationUtils.getIsSameCount(drawnCountRef.current, cellCount)) return;

        drawnCountRef.current = cellCount;
        tintsRef.current.clear();
        latest.current.setCurrentIteration(ParticleFieldConst.FIRST_ITERATION);
        latest.current.setProgress(ParticleFieldConst.NO_PROGRESS);
    }, [cellCount.col, cellCount.row]);

    useLayoutEffect(() => {
        const ids = new Set(particles.map((particle) => particle.id));

        for (const id of [...tintsRef.current.keys()]) {
            if (!ids.has(id)) tintsRef.current.delete(id);
        }
    }, [particles]);

    useLayoutEffect(() => {
        const animation = latest.current.props.computeParticleAnimation;

        if (isOnGraphicsCard || !animation) return;

        for (const particle of particles) {
            const body = bodyRefs.current.get(particle.id);
            const slice = slices.get(particle.cell);

            if (!body || !slice) continue;

            SliceAnimationUtils.assignAnimationProps(
                body,
                animation(ParticleFieldUtils.computeLife(clockMs, particle.spawnMs, lifetimeMs), slice),
            );
        }
    });

    useLayoutEffect(() => {
        if (!item || !isOnGraphicsCard) return;

        const scale = window.devicePixelRatio * viewportContext.getScale();
        const shown = item.draw({
            mode: "particles",
            src: latest.current.props.src,
            tables: tables?.tables ?? [],
            easing: LINEAR,
            slices: rendererSlices,
            size: rootSize,
            area,
            scale,
            timeline: 0,
            half: 0,
            isDescending: false,
            isShown: true,
            hasPerspective: false,
            clockMs,
            lifetimeMs,
        });
        const next = { width: shown.width / scale, height: shown.height / scale };

        setShownSize((previous) => (Size2d.isSame(previous, next) ? previous : next));
    }, [item, isOnGraphicsCard, tables, rendererSlices, rootSize, area, clockMs, lifetimeMs, picture]);

    useEffect(() => {
        if (!isRunning) return;

        return SliceAnimationUtils.runPasses({
            getProgress: () => progressRef.current,
            setProgress: (value) => latest.current.setProgress(value),
            getCurrentIteration: () => iterationRef.current,
            setCurrentIteration: (value) => latest.current.setCurrentIteration(value),
            getDurationMs: () => latest.current.durationMs,
            getIterationCount: () => latest.current.iterationCount,
            getIterationDelayMs: () => latest.current.iterationDelayMs,
            onIterationEnd: () => latest.current.props.onIterationEnd?.(),
            onAnimationEnd: () => latest.current.props.onAnimationEnd?.(),
        });
    }, [isRunning]);

    const pictureSrc = CellAnimationUtils.toSourceImage(props.src);

    return (
        <div
            ref={rootRef}
            className={
                !isOnGraphicsCard && particles.length > 0
                    ? `${ParticleFieldStyles.particleFieldRoot} ${ParticleFieldStyles.particleFieldRootMoving}`
                    : ParticleFieldStyles.particleFieldRoot
            }
            role="presentation"
            aria-hidden="true"
        >
            {isOnGraphicsCard ? (
                <canvas
                    ref={canvasRef}
                    className={SliceRendererStyles.sliceRendererCanvas}
                    style={{
                        left: `${area.x}px`,
                        top: `${area.y}px`,
                        width: `${shownSize.width}px`,
                        height: `${shownSize.height}px`,
                    }}
                    aria-hidden="true"
                />
            ) : (
                particles.map((particle) => {
                    const tint = getTint(particle);
                    const tintStyle =
                        tint === undefined
                            ? undefined
                            : SliceRendererUtils.toTintStyle(SliceRendererUtils.toTint(tint));

                    return (
                        <div
                            key={particle.id}
                            className={ParticleFieldStyles.particleFieldItem}
                            style={{ left: `${particle.pos.x}px`, top: `${particle.pos.y}px` }}
                        >
                            <div
                                className={ParticleFieldStyles.particleFieldBody}
                                style={{
                                    width: `${particle.cell.size.width}px`,
                                    height: `${particle.cell.size.height}px`,
                                }}
                                ref={(element) => {
                                    if (element) bodyRefs.current.set(particle.id, element);

                                    return () => {
                                        bodyRefs.current.delete(particle.id);
                                    };
                                }}
                            >
                                <div
                                    className={
                                        tintStyle
                                            ? `${SliceRendererStyles.sliceRendererPicture} ${SliceRendererStyles.sliceRendererPictureTinted}`
                                            : SliceRendererStyles.sliceRendererPicture
                                    }
                                    style={{
                                        ...(assignInlineVars({
                                            [SliceRendererStyles.pictureSrcVar]: pictureSrc,
                                            [SliceRendererStyles.pictureTintVar]: tintStyle?.color ?? "",
                                        }) as CSSProperties),
                                        opacity: tintStyle?.opacity,
                                    }}
                                />
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};
