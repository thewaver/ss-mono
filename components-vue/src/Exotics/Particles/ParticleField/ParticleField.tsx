import { computed, defineComponent, onScopeDispose, shallowRef } from "vue";

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
import { type Index2d, MathUtils, Rect } from "@thewaver/ss-utils";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ElementObserverVueUtils } from "../../../Abstracts/ElementObserver/ElementObserverVue.utils";
import { InteractionTrackerVueUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerVue.utils";
import { SliceRendererVueUtils } from "../../../Abstracts/SliceRenderer/SliceRendererVue.utils";
import { useViewportContext } from "../../../Abstracts/Viewport/Viewport.context";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { declareProps, useTwoWay } from "../../../Utils/propUtils";
import type { ParticleFieldProps } from "./ParticleField.types";

const LINEAR = SliceRendererUtils.computeEasing(undefined);
const NO_RECT: Rect = { x: 0, y: 0, width: 0, height: 0 };
const NO_TABLES = { tables: [[]], tableIndices: [] };
const NO_PARTICLES: ParticleFieldParticle[] = [];

export const ParticleField = defineComponent(
    (props: ParticleFieldProps) => {
        const viewportContext = useViewportContext();

        const getDurationMs = () => props.animationDurationMs ?? PARTICLE_FIELD_DEFAULTS.animationDurationMs;
        const getIterationCount = () =>
            props.animationIterationCount ?? PARTICLE_FIELD_DEFAULTS.animationIterationCount;
        const getIterationDelayMs = () =>
            props.animationIterationDelayMs ?? PARTICLE_FIELD_DEFAULTS.animationIterationDelayMs;
        const getLifetimeMs = () =>
            Math.min(props.particleLifetimeMs ?? PARTICLE_FIELD_DEFAULTS.particleLifetimeMs, getDurationMs());

        const rootRef = shallowRef<HTMLDivElement>();
        const canvasRef = shallowRef<HTMLCanvasElement>();
        const bodyRefs = new Map<number, HTMLElement>();
        const tints = new Map<number, string | undefined>();

        const isPageHidden = InteractionTrackerVueUtils.usePageHidden();

        const isPlaying = useTwoWay(props, "playback", true);
        const progress = useTwoWay(props, "progress", ParticleFieldConst.NO_PROGRESS);
        const currentIteration = shallowRef(ParticleFieldConst.FIRST_ITERATION);
        const shownRect = shallowRef<Rect>(NO_RECT);

        const rootSize = ElementObserverVueUtils.useBorderBoxSize(rootRef);

        const cellCount = computed<Index2d>((previous) => {
            const next = CellAnimationUtils.computeCellCount(props.cellCount, rootSize.value);

            return previous && CellAnimationUtils.getIsSameCount(previous, next) ? previous : next;
        });

        const contour = computed(() =>
            ParticleFieldUtils.computeContour(
                props.computeShapePoints?.(rootSize.value),
                props.shapeJoinRadii,
                props.shapeLameExponents,
            ),
        );

        const cells = computed(() =>
            ParticleFieldUtils.computeCells(
                cellCount.value,
                rootSize.value,
                props.computeCellWeights?.(cellCount.value) ?? ParticleFieldConst.NO_WEIGHTS,
                contour.value,
            ),
        );

        const slices = computed(() => {
            const origin = props.origin ?? PARTICLE_FIELD_DEFAULTS.origin;

            return new Map<ParticleFieldCellDefs, SliceAnimationSlice>(
                cells.value.map((cell) => [cell, { ...cell, origin }]),
            );
        });

        const renderer = computed(() => props.renderer ?? PARTICLE_FIELD_DEFAULTS.renderer);

        const isElementsOnly = computed(() => renderer.value === "elements");

        const isAvailable = SliceRendererVueUtils.useIsAvailable(isElementsOnly);

        const picture = SliceRendererVueUtils.usePicture(() => props.src, isElementsOnly);

        const tables = computed(() => {
            if (isElementsOnly.value) return undefined;

            const animation = props.computeParticleAnimation;

            return animation ? SliceAnimationUtils.resolveTables(animation, [...slices.value.values()]) : NO_TABLES;
        });

        const tableByCell = computed(() => {
            const tableIndices = tables.value?.tableIndices ?? [];

            return new Map(cells.value.map((cell, idx) => [cell, tableIndices[idx] ?? 0]));
        });

        const isOnGraphicsCard = computed(
            () => isAvailable.value && SliceRendererUtils.getCanDraw(renderer.value, picture.value) && !!tables.value,
        );

        const item = SliceRendererVueUtils.useItem(canvasRef, isAvailable);

        const area = computed(() => {
            const size = rootSize.value;
            const largest = cells.value.reduce(
                (most, cell) => ({
                    width: Math.max(most.width, cell.size.width),
                    height: Math.max(most.height, cell.size.height),
                }),
                { width: 0, height: 0 },
            );
            const reach = SliceRendererUtils.computeReach(tables.value?.tables ?? [], largest, undefined);

            return { x: -reach, y: -reach, width: size.width + 2 * reach, height: size.height + 2 * reach };
        });

        const hasEnded = computed(() => currentIteration.value >= getIterationCount());

        const isRunning = computed(
            () =>
                isPlaying.value &&
                !isPageHidden.value &&
                !hasEnded.value &&
                rootSize.value.width > 0 &&
                rootSize.value.height > 0,
        );

        const clockMs = computed(() => MathUtils.clamp01(progress.value) * getDurationMs());

        const roster = ParticleFieldUtils.createRoster();

        const particles = computed(
            () =>
                roster.refresh({
                    count: cellCount.value,
                    cells: cells.value,
                    clockMs: clockMs.value,
                    durationMs: getDurationMs(),
                    lifetimeMs: getLifetimeMs(),
                    spawnChance: props.spawnChance ?? PARTICLE_FIELD_DEFAULTS.spawnChance,
                    pass: currentIteration.value,
                    hasEnded: hasEnded.value,
                    computeParticlePos: props.computeParticlePos,
                }).particles,
        );

        const liveParticles = computed(() => (isOnGraphicsCard.value ? NO_PARTICLES : particles.value));

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
                table: tableByCell.value.get(particle.cell) ?? 0,
                tint: tint === undefined ? undefined : SliceRendererUtils.toTint(tint),
            };
        };

        let drawnCount = cellCount.value;
        let prunedParticles: ParticleFieldParticle[] | undefined;
        let slicedParticles: ParticleFieldParticle[] | undefined;
        let slicedTables: Map<ParticleFieldCellDefs, number> | undefined;
        let rendererSlices: SliceRendererSlice[] = [];

        watchAfterRender([cellCount], ([count]) => {
            if (CellAnimationUtils.getIsSameCount(drawnCount, count)) return;

            drawnCount = count;
            tints.clear();
            currentIteration.value = ParticleFieldConst.FIRST_ITERATION;
            progress.value = ParticleFieldConst.NO_PROGRESS;
        });

        watchAfterRender(
            [particles, clockMs, slices, tableByCell, area, rootSize, isOnGraphicsCard, item, picture],
            ([list, clock, currentSlices, currentTableByCell, currentArea, size, isOnCard, currentItem]) => {
                if (list !== prunedParticles) {
                    const ids = new Set(list.map((particle) => particle.id));

                    for (const id of [...tints.keys()]) {
                        if (!ids.has(id)) tints.delete(id);
                    }

                    prunedParticles = list;
                }

                if (!isOnCard) {
                    slicedParticles = undefined;

                    const animation = props.computeParticleAnimation;

                    if (!animation) return;

                    for (const particle of list) {
                        const body = bodyRefs.get(particle.id);
                        const slice = currentSlices.get(particle.cell);

                        if (!body || !slice) continue;

                        SliceAnimationUtils.assignAnimationProps(
                            body,
                            animation(ParticleFieldUtils.computeLife(clock, particle.spawnMs, getLifetimeMs()), slice),
                        );
                    }

                    return;
                }

                if (!currentItem) return;

                if (list !== slicedParticles || currentTableByCell !== slicedTables) {
                    rendererSlices = list.map(toRendererSlice);
                    slicedParticles = list;
                    slicedTables = currentTableByCell;
                }

                const scale = window.devicePixelRatio * viewportContext.getScale();
                currentItem.draw(
                    {
                        mode: "particles",
                        src: props.src,
                        tables: tables.value?.tables ?? [],
                        easing: LINEAR,
                        slices: rendererSlices,
                        size,
                        area: currentArea,
                        scale,
                        timeline: 0,
                        half: 0,
                        isDescending: false,
                        isShown: true,
                        hasPerspective: false,
                        clockMs: clock,
                        lifetimeMs: getLifetimeMs(),
                    },
                    (next) => {
                        if (!Rect.isSame(shownRect.value, next)) shownRect.value = next;
                    },
                );
            },
        );

        watchAfterRender([isRunning], ([running]) => {
            if (!running) return;

            return SliceAnimationUtils.runPasses({
                getProgress: () => progress.value,
                setProgress: (value) => {
                    progress.value = value;
                },
                getCurrentIteration: () => currentIteration.value,
                setCurrentIteration: (value) => {
                    currentIteration.value = value;
                },
                getDurationMs,
                getIterationCount,
                getIterationDelayMs,
                onIterationEnd: () => props.onIterationEnd?.(),
                onAnimationEnd: () => props.onAnimationEnd?.(),
            });
        });

        onScopeDispose(() => {
            bodyRefs.clear();
            tints.clear();
        });

        return () => (
            <div
                ref={rootRef}
                class={[
                    ParticleFieldStyles.particleFieldRoot,
                    liveParticles.value.length > 0 && ParticleFieldStyles.particleFieldRootMoving,
                ]}
                role="presentation"
                aria-hidden="true"
            >
                {isOnGraphicsCard.value ? (
                    <canvas
                        ref={canvasRef}
                        class={SliceRendererStyles.sliceRendererCanvas}
                        style={{
                            left: `${shownRect.value.x}px`,
                            top: `${shownRect.value.y}px`,
                            width: `${shownRect.value.width}px`,
                            height: `${shownRect.value.height}px`,
                        }}
                        aria-hidden="true"
                    />
                ) : (
                    liveParticles.value.map((particle) => {
                        const tint = getTint(particle);
                        const tintStyle =
                            tint === undefined
                                ? undefined
                                : SliceRendererUtils.toTintStyle(SliceRendererUtils.toTint(tint));

                        return (
                            <div
                                key={particle.id}
                                class={ParticleFieldStyles.particleFieldItem}
                                style={{ left: `${particle.pos.x}px`, top: `${particle.pos.y}px` }}
                            >
                                <div
                                    class={ParticleFieldStyles.particleFieldBody}
                                    style={{
                                        width: `${particle.cell.size.width}px`,
                                        height: `${particle.cell.size.height}px`,
                                    }}
                                    ref={(element) => {
                                        if (element instanceof HTMLElement) bodyRefs.set(particle.id, element);
                                        else bodyRefs.delete(particle.id);
                                    }}
                                >
                                    <div
                                        class={[
                                            SliceRendererStyles.sliceRendererPicture,
                                            tintStyle && SliceRendererStyles.sliceRendererPictureTinted,
                                        ]}
                                        style={{
                                            ...assignInlineVars({
                                                [SliceRendererStyles.pictureSrcVar]: CellAnimationUtils.toSourceImage(
                                                    props.src,
                                                ),
                                                [SliceRendererStyles.pictureTintVar]: tintStyle?.color ?? "",
                                            }),
                                            opacity: tintStyle ? `${tintStyle.opacity}` : undefined,
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        );
    },
    {
        name: "ParticleField",
        props: declareProps<ParticleFieldProps>({
            "src": null,
            "cellCount": null,
            "spawnChance": null,
            "animationDurationMs": null,
            "animationIterationCount": null,
            "animationIterationDelayMs": null,
            "particleLifetimeMs": null,
            "playback": Boolean,
            "onUpdate:playback": null,
            "progress": null,
            "onUpdate:progress": null,
            "computeShapePoints": null,
            "shapeJoinRadii": null,
            "shapeLameExponents": null,
            "origin": null,
            "renderer": null,
            "computeCellWeights": null,
            "computeParticlePos": null,
            "computeParticleAnimation": null,
            "computeParticleTint": null,
            "onIterationEnd": null,
            "onAnimationEnd": null,
        }),
    },
);
