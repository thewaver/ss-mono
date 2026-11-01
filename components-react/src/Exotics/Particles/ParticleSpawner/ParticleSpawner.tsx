import { type CSSProperties, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import {
    CellAnimationUtils,
    ElementObserverUtils,
    PARTICLE_SPAWNER_DEFAULTS,
    type ParticleSpawnIterationPattern,
    type ParticleSpawnerController,
    type ParticleSpawnerFrame,
    ParticleSpawnerStyles,
    ParticleSpawnerUtils,
    type ParticleTravelDefs,
    SliceAnimationUtils,
    type SliceRendererSlice,
    SliceRendererStyles,
    SliceRendererUtils,
    type SliceStop,
} from "@thewaver/ss-components";
import { ParticleSpawnerConst } from "@thewaver/ss-components/internal";
import { type Point2d, Rect, Size2d } from "@thewaver/ss-utils";
import { assignInlineVars, setElementVars } from "@vanilla-extract/dynamic";

import { InteractionTrackerReactUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerReact.utils";
import { MediaQueryMonitorReactUtils } from "../../../Abstracts/MediaQueryMonitor/MediaQueryMonitorReact.utils";
import { SignalMirrorReactUtils } from "../../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { SliceRendererReactUtils } from "../../../Abstracts/SliceRenderer/SliceRendererReact.utils";
import { useViewportContext } from "../../../Abstracts/Viewport/Viewport.context";
import { useElement, useLatest } from "../../../Utils/refUtils";
import { useStore } from "../../../Utils/storeUtils";
import type { ParticleSpawnerProps } from "./ParticleSpawner.types";

const LINEAR = SliceRendererUtils.computeEasing(undefined);
const NO_AREA: Rect = { x: 0, y: 0, width: 1, height: 1 };
const NO_RECT: Rect = { x: 0, y: 0, width: 0, height: 0 };
const UNUSED_SIZE: Size2d = { width: 1, height: 1 };
const NO_TABLES: SliceStop[][] = [];

type Placed = { defs: ParticleTravelDefs; pos: Point2d; t: number };

type LegTint = { legIndex: number; tint: string | undefined };

export const ParticleSpawner = (props: ParticleSpawnerProps) => {
    const travelDurationMs = props.travelDurationMs ?? PARTICLE_SPAWNER_DEFAULTS.travelDurationMs;
    const restDurationMs = props.restDurationMs ?? PARTICLE_SPAWNER_DEFAULTS.restDurationMs;
    const spawnDelayMs = props.spawnDelayMs ?? PARTICLE_SPAWNER_DEFAULTS.spawnDelayMs;
    const particleCount = ParticleSpawnerUtils.toParticleCount(props.particleCount);
    const renderer = props.renderer ?? PARTICLE_SPAWNER_DEFAULTS.renderer;

    const patternsKey = JSON.stringify(
        props.spawnIterationPatterns ?? PARTICLE_SPAWNER_DEFAULTS.spawnIterationPatterns,
    );
    const patterns = useMemo(() => JSON.parse(patternsKey) as ParticleSpawnIterationPattern[], [patternsKey]);

    const rootRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const elementsRef = useRef(new Map<number, HTMLDivElement>());
    const bodiesRef = useRef(new Map<number, HTMLDivElement>());
    const picturesRef = useRef(new Map<number, HTMLDivElement>());
    const placedRef = useRef(new Map<number, Placed>());
    const tintsRef = useRef(new Map<number, LegTint>());
    const drawnAreaRef = useRef<Rect>(undefined);

    const [isPlaying] = SignalMirrorReactUtils.useOptionalState(props.playback, true);
    const [progress, setProgressState] = SignalMirrorReactUtils.useOptionalState(
        props.progress,
        ParticleSpawnerConst.NO_PROGRESS,
    );
    const [shownRect, setShownRect] = useState<Rect>(NO_RECT);

    const progressRef = useLatest(progress);

    const setProgress = (value: number) => {
        progressRef.current = value;
        setProgressState(value);
    };

    const isWindowVisible = !InteractionTrackerReactUtils.usePageHidden();
    const prefersReducedMotion = MediaQueryMonitorReactUtils.useReducedMotion();

    const viewportContext = useViewportContext();
    const rootElement = useElement(rootRef);

    const isElementsOnly = renderer === "elements";

    const isAvailable = SliceRendererReactUtils.useIsAvailable(isElementsOnly);

    const picture = SliceRendererReactUtils.usePicture(props.src, false);

    const particleSize = picture?.size ?? UNUSED_SIZE;

    const isOnGraphicsCard = isAvailable && SliceRendererUtils.getCanDraw(renderer, picture);

    const item = SliceRendererReactUtils.useItem(canvasRef, isAvailable);

    const canSpawn = rootElement !== undefined && isWindowVisible && props.targets.length > 0;

    const latest = useLatest({
        props,
        viewportContext,
        prefersReducedMotion,
        canSpawn,
        timing: { spawnDelayMs, travelDurationMs, restDurationMs },
        particleCount,
        patterns,
        isOnGraphicsCard,
        item,
        particleSize,
        setProgress,
    });

    const [view] = useState(() => {
        const measureFrame = (): ParticleSpawnerFrame => {
            const root = rootRef.current;
            const current = latest.current;

            return {
                rootRect: root ? ElementObserverUtils.measureViewportRect(root, current.viewportContext) : undefined,
                targetRects: ElementObserverUtils.measureViewportRects(current.props.targets, current.viewportContext),
                modMarkerRects: ElementObserverUtils.measureViewportRects(
                    current.props.modMarkers ?? [],
                    current.viewportContext,
                ),
                prefersReducedMotion: current.prefersReducedMotion,
            };
        };

        const getTint = (defs: ParticleTravelDefs) => {
            const cached = tintsRef.current.get(defs.id);

            if (cached?.legIndex === defs.legIndex) return cached.tint;

            const tint = latest.current.props.computeParticleTint?.(defs);

            tintsRef.current.set(defs.id, { legIndex: defs.legIndex, tint });

            return tint;
        };

        const applyTint = (id: number, entry: Placed) => {
            const picture = picturesRef.current.get(id);

            const legIndex = String(entry.defs.legIndex);

            if (!picture || picture.dataset.tintedLeg === legIndex) return;

            const tint = getTint(entry.defs);

            picture.dataset.tintedLeg = legIndex;

            if (tint === undefined) {
                picture.classList.remove(SliceRendererStyles.sliceRendererPictureTinted);
                picture.style.opacity = "";

                return;
            }

            const tintStyle = SliceRendererUtils.toTintStyle(SliceRendererUtils.toTint(tint));

            setElementVars(picture, { [SliceRendererStyles.pictureTintVar]: tintStyle.color });
            picture.classList.add(SliceRendererStyles.sliceRendererPictureTinted);
            picture.style.opacity = `${tintStyle.opacity}`;
        };

        const applyParticle = (id: number) => {
            const body = bodiesRef.current.get(id);
            const entry = placedRef.current.get(id);
            const computeAnimation = latest.current.props.computeParticleAnimation;

            if (!body || !entry) return;

            applyTint(id, entry);

            if (computeAnimation) {
                SliceAnimationUtils.assignAnimationProps(body, computeAnimation(entry.defs, entry.t));
            }
        };

        const drawOnGraphicsCard = () => {
            const current = latest.current;
            const item = current.item;

            if (!item) return;

            const size = current.particleSize;
            const slices: SliceRendererSlice[] = [];

            let grown = drawnAreaRef.current;

            for (const particle of engine.particles.get()) {
                const entry = placedRef.current.get(particle.id);

                if (!entry) continue;

                const direct = ParticleSpawnerUtils.toDirectValues(
                    current.props.computeParticleAnimation?.(entry.defs, entry.t) ?? {},
                    size,
                );
                const center = { x: entry.pos.x + direct.shiftX, y: entry.pos.y + direct.shiftY };
                const tint = getTint(entry.defs);

                grown ??= ParticleSpawnerUtils.settleArea(engine.getPlacement(), size);
                grown = ParticleSpawnerUtils.growArea(grown, center, size, direct);
                slices.push({
                    left: center.x - size.width * 0.5,
                    top: center.y - size.height * 0.5,
                    width: size.width,
                    height: size.height,
                    weight: 0,
                    table: 0,
                    tint: tint === undefined ? undefined : SliceRendererUtils.toTint(tint),
                    direct: [direct.scaleX, direct.scaleY, direct.rotate, direct.opacity],
                });
            }

            drawnAreaRef.current = slices.length === 0 ? undefined : grown;

            const scale = window.devicePixelRatio * current.viewportContext.getScale();
            item.draw(
                {
                    mode: "direct",
                    src: current.props.src,
                    tables: NO_TABLES,
                    easing: LINEAR,
                    slices,
                    size: UNUSED_SIZE,
                    area: drawnAreaRef.current ?? NO_AREA,
                    scale,
                    timeline: 0,
                    half: 0,
                    isDescending: false,
                    isShown: slices.length > 0,
                    hasPerspective: false,
                },
                (next) => setShownRect((last) => (Rect.isSame(last, next) ? last : next)),
            );
        };

        const engine = ParticleSpawnerUtils.createEngine({
            getTargetCount: () => latest.current.props.targets.length,
            computeTarget: (index, targetCount) => latest.current.props.computeTarget?.(index, targetCount),
            computeRoute: (index, targetCount) => latest.current.props.computeRoute?.(index, targetCount),
            getElement: (id) => elementsRef.current.get(id),
            getIsDrawingElements: () => !latest.current.isOnGraphicsCard,
            getFrame: measureFrame,
            getTiming: () => latest.current.timing,
            getParticleCount: () => latest.current.particleCount,
            getPatterns: () => latest.current.patterns,
            getCanSpawn: () => latest.current.canSpawn,
            getProgress: () => progressRef.current,
            setProgress: (value) => latest.current.setProgress(value),
            computeParticlePos: (travel, t) => latest.current.props.computeParticlePos(travel, t),
            getModifiers: () => latest.current.props.particleModifiers,
            onParticlePlace: (travel, pos, t) => {
                placedRef.current.set(travel.id, { defs: travel, pos, t });

                if (!latest.current.isOnGraphicsCard) applyParticle(travel.id);
            },
            onParticleArrive: (index) => latest.current.props.onParticleArrive?.(index),
            onIterationEnd: () => latest.current.props.onIterationEnd?.(),
            onAnimationEnd: () => latest.current.props.onAnimationEnd?.(),
            onTick: () => {
                if (latest.current.isOnGraphicsCard) drawOnGraphicsCard();
            },
        });

        return { engine, applyParticle, drawOnGraphicsCard };
    });

    const engine = view.engine;

    const particles = useStore(engine.particles);

    const [controller] = useState<ParticleSpawnerController>(() => ({ emit: engine.emit }));

    useEffect(() => {
        latest.current.props.onMount?.(controller);
    }, [controller]);

    useEffect(
        () => () => {
            engine.stop();
            elementsRef.current.clear();
            bodiesRef.current.clear();
            picturesRef.current.clear();
            placedRef.current.clear();
            tintsRef.current.clear();
        },
        [engine],
    );

    useLayoutEffect(() => {
        const ids = new Set(particles.map((particle) => particle.id));

        for (const id of [...placedRef.current.keys()]) {
            if (!ids.has(id)) {
                placedRef.current.delete(id);
                tintsRef.current.delete(id);
            }
        }

        if (particles.length === 0 && latest.current.isOnGraphicsCard) view.drawOnGraphicsCard();
    }, [particles]);

    const restartKey = JSON.stringify([particleCount, spawnDelayMs, travelDurationMs, restDurationMs, patternsKey]);
    const restartKeyRef = useRef(restartKey);

    useEffect(() => {
        if (restartKeyRef.current === restartKey) return;

        restartKeyRef.current = restartKey;
        engine.restart();
    }, [engine, restartKey]);

    const wasPlayingRef = useRef(isPlaying);

    useEffect(() => {
        const wasPlaying = wasPlayingRef.current;

        wasPlayingRef.current = isPlaying;

        if (isPlaying && !wasPlaying && engine.getHasEnded()) engine.restart();
    }, [engine, isPlaying]);

    useEffect(() => {
        const isRunning = isPlaying && canSpawn;

        engine.setIsRunning(isRunning);

        if (!isRunning) engine.render();
    }, [engine, isPlaying, canSpawn]);

    const scrubbedProgressRef = useRef(progress);

    useEffect(() => {
        if (scrubbedProgressRef.current === progress) return;

        scrubbedProgressRef.current = progress;
        engine.scrub();
    }, [engine, progress]);

    const particleElements = useMemo(() => {
        const pictureStyle = assignInlineVars({
            [SliceRendererStyles.pictureSrcVar]: CellAnimationUtils.toSourceImage(props.src),
        }) as CSSProperties;

        return particles.map((particle) => (
            <div
                key={particle.id}
                className={ParticleSpawnerStyles.particleSpawnerItem}
                ref={(element) => {
                    if (!element) return;

                    elementsRef.current.set(particle.id, element);
                    engine.drawParticle(particle.id, element);

                    return () => {
                        elementsRef.current.delete(particle.id);
                    };
                }}
            >
                <div
                    className={ParticleSpawnerStyles.particleSpawnerBody}
                    style={{ width: `${particleSize.width}px`, height: `${particleSize.height}px` }}
                    ref={(element) => {
                        if (!element) return;

                        bodiesRef.current.set(particle.id, element);

                        return () => {
                            bodiesRef.current.delete(particle.id);
                        };
                    }}
                >
                    <div
                        className={SliceRendererStyles.sliceRendererPicture}
                        style={pictureStyle}
                        ref={(element) => {
                            if (!element) return;

                            picturesRef.current.set(particle.id, element);
                            view.applyParticle(particle.id);

                            return () => {
                                picturesRef.current.delete(particle.id);
                            };
                        }}
                    />
                </div>
            </div>
        ));
    }, [engine, view, particles, particleSize, props.src]);

    return (
        <div
            ref={rootRef}
            className={
                !isOnGraphicsCard && particles.length > 0
                    ? `${ParticleSpawnerStyles.particleSpawnerRoot} ${ParticleSpawnerStyles.particleSpawnerRootMoving}`
                    : ParticleSpawnerStyles.particleSpawnerRoot
            }
            role="presentation"
            aria-hidden="true"
        >
            {isOnGraphicsCard ? (
                <canvas
                    ref={canvasRef}
                    className={SliceRendererStyles.sliceRendererCanvas}
                    style={{
                        left: `${shownRect.x}px`,
                        top: `${shownRect.y}px`,
                        width: `${shownRect.width}px`,
                        height: `${shownRect.height}px`,
                    }}
                    aria-hidden="true"
                />
            ) : (
                particleElements
            )}
        </div>
    );
};
