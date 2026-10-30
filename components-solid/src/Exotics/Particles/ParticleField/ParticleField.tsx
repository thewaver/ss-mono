import { For, Show, createEffect, createMemo, createSignal, on, onCleanup, onMount, untrack } from "solid-js";

import {
    CellAnimationUtils,
    ElementObserverUtils,
    PARTICLE_FIELD_DEFAULTS,
    type ParticleFieldCellDefs,
    type ParticleFieldParticle,
    ParticleFieldUtils,
    type SliceAnimationSlice,
    SliceAnimationUtils,
    type SliceRendererSlice,
    SliceRendererStyles,
    SliceRendererUtils,
    ParticleFieldStyles as styles,
} from "@thewaver/ss-components";
import { ParticleFieldConst } from "@thewaver/ss-components/internal";
import { MathUtils, Rect, Size2d } from "@thewaver/ss-utils";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { SignalMirrorSolidUtils } from "../../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { SliceRendererSolidUtils } from "../../../Abstracts/SliceRenderer/SliceRendererSolid.utils";
import { useViewportContext } from "../../../Abstracts/Viewport/Viewport.context";
import { access } from "../../../Utils/propUtils";
import type { ParticleFieldProps } from "./ParticleFieldSolid.types";

const LINEAR = SliceRendererUtils.computeEasing(undefined);
const NO_RECT: Rect = { x: 0, y: 0, width: 0, height: 0 };
const NO_TABLES = { tables: [[]], tableIndices: [] };

export const ParticleField = (props: ParticleFieldProps) => {
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

    const getOrigin = createMemo(() => access(props.origin) ?? PARTICLE_FIELD_DEFAULTS.origin);

    const getRenderer = createMemo(() => access(props.renderer) ?? PARTICLE_FIELD_DEFAULTS.renderer);

    const getSource = createMemo(() => access(props.src));

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getCanvasRef, setCanvasRef] = createSignal<HTMLCanvasElement>();
    const [getIsWindowVisible, setIsWindowVisible] = createSignal(true);
    const [getIsPlaying] = SignalMirrorSolidUtils.createOptional(() => props.playback, true);
    const [getProgress, setProgress] = SignalMirrorSolidUtils.createOptional(
        () => props.progress,
        ParticleFieldConst.NO_PROGRESS,
    );
    const [getCurrentIteration, setCurrentIteration] = createSignal(0);
    const [getRootSize, setRootSize] = createSignal<Size2d>({ width: 0, height: 0 }, { equals: Size2d.isSame });
    const [getLiveParticles, setLiveParticles] = createSignal<ParticleFieldParticle[]>([]);
    const [getShownRect, setShownRect] = createSignal<Rect>(NO_RECT, { equals: Rect.isSame });

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

    const getSlices = createMemo(() => {
        const origin = getOrigin();

        return new Map<ParticleFieldCellDefs, SliceAnimationSlice>(
            getCells().map((cell) => [cell, { ...cell, origin }]),
        );
    });

    const getIsElementsOnly = createMemo(() => getRenderer() === "elements");

    const getIsAvailable = SliceRendererSolidUtils.createIsAvailable(getIsElementsOnly);

    const getPicture = SliceRendererSolidUtils.createPicture(getSource, getIsElementsOnly);

    const getTables = createMemo(() => {
        if (getIsElementsOnly()) return undefined;

        const animation = props.computeParticleAnimation;

        return animation ? SliceAnimationUtils.resolveTables(animation, [...getSlices().values()]) : NO_TABLES;
    });

    const getTableByCell = createMemo(() => {
        const tableIndices = getTables()?.tableIndices ?? [];

        return new Map(getCells().map((cell, idx) => [cell, tableIndices[idx] ?? 0]));
    });

    const getIsOnGraphicsCard = createMemo(
        () => getIsAvailable() && SliceRendererUtils.getCanDraw(getRenderer(), getPicture()) && !!getTables(),
    );

    const getItem = SliceRendererSolidUtils.createItem(getCanvasRef, getIsAvailable);

    const getArea = createMemo(() => {
        const size = getRootSize();
        const largest = getCells().reduce(
            (most, cell) => ({
                width: Math.max(most.width, cell.size.width),
                height: Math.max(most.height, cell.size.height),
            }),
            { width: 0, height: 0 },
        );
        const reach = SliceRendererUtils.computeReach(getTables()?.tables ?? [], largest, undefined);

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
    const refs = new Map<number, HTMLElement>();
    const tints = new Map<number, string | undefined>();

    let clockMs = 0;
    let particlesNow: ParticleFieldParticle[] = [];
    let rendererSlices: SliceRendererSlice[] = [];
    let slicedTableByCell: Map<ParticleFieldCellDefs, number> | undefined;

    const getTint = (particle: ParticleFieldParticle) => {
        if (!tints.has(particle.id)) tints.set(particle.id, props.computeParticleTint?.(particle.cell));

        return tints.get(particle.id);
    };

    const toRendererSlice = (particle: ParticleFieldParticle): SliceRendererSlice => {
        const tint = getTint(particle);

        return {
            left: particle.pos.x - particle.cell.size.width * 0.5,
            top: particle.pos.y - particle.cell.size.height * 0.5,
            width: particle.cell.size.width,
            height: particle.cell.size.height,
            weight: particle.spawnMs,
            table: untrack(getTableByCell).get(particle.cell) ?? 0,
            tint: tint === undefined ? undefined : SliceRendererUtils.toTint(tint),
        };
    };

    const applyParticle = (particle: ParticleFieldParticle, el: HTMLElement | undefined) => {
        const animation = props.computeParticleAnimation;
        const slice = untrack(getSlices).get(particle.cell);

        if (!el || !animation || !slice) return;

        const t = ParticleFieldUtils.computeLife(clockMs, particle.spawnMs, getLifetimeMs());

        SliceAnimationUtils.assignAnimationProps(el, animation(t, slice));
    };

    const drawOnGraphicsCard = () => {
        const item = getItem();

        if (!item) return;

        const scale = window.devicePixelRatio * viewportContext.getScale();
        item.draw(
            {
                mode: "particles",
                src: getSource(),
                tables: getTables()?.tables ?? [],
                easing: LINEAR,
                slices: rendererSlices,
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
            },
            setShownRect,
        );
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

        particlesNow = particles;

        if (hasChanged) {
            const ids = new Set(particles.map((particle) => particle.id));

            for (const id of [...tints.keys()]) {
                if (!ids.has(id)) tints.delete(id);
            }
        }

        if (getIsOnGraphicsCard()) {
            if (hasChanged || rendererSlices.length !== particles.length || slicedTableByCell !== getTableByCell()) {
                slicedTableByCell = getTableByCell();
                rendererSlices = particles.map(toRendererSlice);
            }

            drawOnGraphicsCard();

            return;
        }

        if (hasChanged) setLiveParticles(particles);

        for (const particle of particles) applyParticle(particle, refs.get(particle.id));
    };

    createEffect(
        on(
            getCellCount,
            () => {
                roster.clear();
                tints.clear();
                particlesNow = [];
                rendererSlices = [];
                setLiveParticles([]);
                setCurrentIteration(0);
                setProgress(ParticleFieldConst.NO_PROGRESS);
            },
            { defer: true },
        ),
    );

    createEffect(
        on(getIsOnGraphicsCard, (isOnGraphicsCard) => {
            rendererSlices = isOnGraphicsCard ? particlesNow.map(toRendererSlice) : [];
            setLiveParticles(isOnGraphicsCard ? [] : particlesNow);
        }),
    );

    createEffect(() => {
        const progress = MathUtils.clamp01(getProgress());

        getCells();
        getTables();
        getArea();
        getHasEnded();
        getLifetimeMs();
        getSpawnChance();
        getCurrentIteration();
        getIsOnGraphicsCard();
        getItem();
        getPicture();

        untrack(() => {
            clockMs = progress * getDurationMs();
            refresh();
        });
    });

    createEffect(() => {
        if (!getIsRunning()) return;

        onCleanup(
            SliceAnimationUtils.runPasses({
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

    onCleanup(() => {
        refs.clear();
        tints.clear();
    });

    return (
        <div
            ref={setRootRef}
            class={styles.particleFieldRoot}
            classList={{ [styles.particleFieldRootMoving]: getLiveParticles().length > 0 }}
            role="presentation"
            aria-hidden="true"
        >
            <Show
                when={getIsOnGraphicsCard()}
                fallback={
                    <For each={getLiveParticles()}>
                        {(particle) => {
                            const tint = getTint(particle);
                            const tintStyle =
                                tint === undefined
                                    ? undefined
                                    : SliceRendererUtils.toTintStyle(SliceRendererUtils.toTint(tint));

                            onCleanup(() => refs.delete(particle.id));

                            return (
                                <div
                                    class={styles.particleFieldItem}
                                    style={{ left: `${particle.pos.x}px`, top: `${particle.pos.y}px` }}
                                >
                                    <div
                                        class={styles.particleFieldBody}
                                        style={{
                                            width: `${particle.cell.size.width}px`,
                                            height: `${particle.cell.size.height}px`,
                                        }}
                                        ref={(el) => {
                                            refs.set(particle.id, el);
                                            applyParticle(particle, el);
                                        }}
                                    >
                                        <div
                                            class={SliceRendererStyles.sliceRendererPicture}
                                            classList={{
                                                [SliceRendererStyles.sliceRendererPictureTinted]: !!tintStyle,
                                            }}
                                            style={{
                                                ...assignInlineVars({
                                                    [SliceRendererStyles.pictureSrcVar]:
                                                        CellAnimationUtils.toSourceImage(getSource()),
                                                    [SliceRendererStyles.pictureTintVar]: tintStyle?.color ?? "",
                                                }),
                                                opacity: tintStyle ? `${tintStyle.opacity}` : undefined,
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        }}
                    </For>
                }
            >
                <canvas
                    ref={setCanvasRef}
                    class={SliceRendererStyles.sliceRendererCanvas}
                    style={{
                        left: `${getShownRect().x}px`,
                        top: `${getShownRect().y}px`,
                        width: `${getShownRect().width}px`,
                        height: `${getShownRect().height}px`,
                    }}
                    aria-hidden="true"
                />
            </Show>
        </div>
    );
};
