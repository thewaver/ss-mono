import { type SlotsType, computed, defineComponent, shallowRef } from "vue";

import {
    CellAnimationUtils,
    PARTICLE_DISSOLVE_DEFAULTS,
    PaintedAreaUtils,
    type PaintedRegion,
    type PaintedSample,
    ParticleDissolveStyles,
    ParticleDissolveUtils,
    type ParticleFieldCellDefs,
} from "@thewaver/ss-components";
import { type CSSAnimationValues, type Index2d, Index2dUtils, type Point2d, RectUtils } from "@thewaver/ss-utils";

import { ElementObserverVueUtils } from "../../../Abstracts/ElementObserver/ElementObserverVue.utils";
import { MediaQueryMonitorVueUtils } from "../../../Abstracts/MediaQueryMonitor/MediaQueryMonitorVue.utils";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { callSlot, declareProps } from "../../../Utils/propUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import { ParticleField } from "../ParticleField/ParticleField";
import type { ParticleFieldSlots } from "../ParticleField/ParticleField.types";
import type { ParticleDissolveProps, ParticleDissolveSlots } from "./ParticleDissolve.types";

const NO_ANIMATION: CSSAnimationValues = {};
const NO_COLOR = "";
const SINGLE_PASS = 1;

type ParticleDissolveLayer = {
    samples: Map<number, PaintedSample>;
    computeParticlePos: (cell: ParticleFieldCellDefs) => Point2d;
    computeParticleAnimation: (cell: ParticleFieldCellDefs, t: number) => CSSAnimationValues;
    renderParticle: ParticleFieldSlots["renderParticle"];
};

const getCellKey = (cell: ParticleFieldCellDefs) => Index2dUtils.toFlatIndex(cell.pos, cell.count.col);

const ignoreWrite = () => undefined;

export const ParticleDissolve = defineComponent(
    (props: ParticleDissolveProps, { slots }: SlotsContext<ParticleDissolveSlots>) => {
        const rootRef = shallowRef<HTMLDivElement>();
        const contentRef = shallowRef<HTMLDivElement>();

        const progress = shallowRef(props.isDissolved ? 1 : 0);

        const size = ElementObserverVueUtils.useBorderBoxSize(rootRef);

        const prefersReducedMotion = MediaQueryMonitorVueUtils.useReducedMotion();

        const getDurationMs = () => props.durationMs ?? PARTICLE_DISSOLVE_DEFAULTS.durationMs;

        const lifetimeShare = computed(() =>
            ParticleDissolveUtils.computeLifetimeShare(
                getDurationMs(),
                props.particleLifetimeMs ?? PARTICLE_DISSOLVE_DEFAULTS.particleLifetimeMs,
            ),
        );

        const sweep = computed(() =>
            ParticleDissolveUtils.computeSweep(
                props.angleDegrees ?? PARTICLE_DISSOLVE_DEFAULTS.angleDegrees,
                props.originShare,
                size.value,
            ),
        );

        const cellCount = computed<Index2d>((previous) => {
            const next = ParticleDissolveUtils.computeCellCount(
                size.value,
                props.cellSize ?? PARTICLE_DISSOLVE_DEFAULTS.cellSize,
            );

            return previous && CellAnimationUtils.getIsSameCount(previous, next) ? previous : next;
        });

        const hasParticles = computed(() => !prefersReducedMotion.value && progress.value > 0 && progress.value < 1);

        let regions: PaintedRegion[] = [];

        const layers = new Map<number, ParticleDissolveLayer>();

        const getLayer = (index: number) => {
            const existing = layers.get(index);

            if (existing) return existing;

            const samples = new Map<number, PaintedSample>();

            const layer: ParticleDissolveLayer = {
                samples,
                computeParticlePos: (cell) => {
                    const key = getCellKey(cell);
                    const painted = PaintedAreaUtils.computeSamples(regions, cell.rect);
                    const sample = painted[Math.floor(Math.random() * painted.length)];

                    if (!sample) {
                        samples.delete(key);

                        return RectUtils.getCenter(cell.rect);
                    }

                    samples.set(key, sample);

                    return sample.pos;
                },
                computeParticleAnimation: (cell, t) =>
                    props.computeParticleAnimation?.(
                        { cell, color: samples.get(getCellKey(cell))?.color ?? NO_COLOR },
                        t,
                    ) ?? NO_ANIMATION,
                renderParticle: ({ defs, t }) => {
                    const sample = samples.get(getCellKey(defs));

                    return sample
                        ? callSlot(slots.renderParticle, { defs: { cell: defs, color: sample.color }, t })
                        : undefined;
                },
            };

            layers.set(index, layer);

            return layer;
        };

        const computeCellWeights = (count: Index2d) =>
            ParticleDissolveUtils.computeCellWeights(count, size.value, sweep.value);

        watchAfterRender([() => props.isDissolved], ([isDissolved]) => {
            const to = isDissolved ? 1 : 0;
            const from = progress.value;

            if (from === to) return;

            const content = contentRef.value;

            regions = content ? PaintedAreaUtils.measure(content) : [];

            for (const layer of layers.values()) layer.samples.clear();

            return ParticleDissolveUtils.run({
                from,
                to,
                durationMs: ParticleDissolveUtils.computeDurationMs(getDurationMs(), prefersReducedMotion.value),
                onProgress: (value) => {
                    progress.value = value;
                },
                onEnd: () => (isDissolved ? props.onDissolveEnd : props.onRebuildEnd)?.(),
            });
        });

        return () => {
            const mask = prefersReducedMotion.value
                ? undefined
                : ParticleDissolveUtils.computeMask(
                      ParticleDissolveUtils.computeEdge(progress.value, lifetimeShare.value),
                      props.featherShare ?? PARTICLE_DISSOLVE_DEFAULTS.featherShare,
                      sweep.value,
                      size.value,
                  );

            const layerIndexes = Array.from(
                {
                    length: ParticleDissolveUtils.computeParticlesPerCell(
                        props.particlesPerCell ?? PARTICLE_DISSOLVE_DEFAULTS.particlesPerCell,
                    ),
                },
                (_, index) => index,
            );

            return (
                <div ref={rootRef} class={ParticleDissolveStyles.particleDissolveRoot}>
                    <div
                        ref={contentRef}
                        inert={progress.value > 0}
                        style={{
                            maskImage: mask,
                            WebkitMaskImage: mask,
                            opacity: prefersReducedMotion.value && progress.value > 0 ? 1 - progress.value : undefined,
                        }}
                    >
                        {slots.default?.()}
                    </div>

                    {hasParticles.value && (
                        <div class={ParticleDissolveStyles.particleDissolveParticles} aria-hidden="true">
                            {layerIndexes.map((index) => {
                                const layer = getLayer(index);

                                return (
                                    <div key={index} class={ParticleDissolveStyles.particleDissolveParticleLayer}>
                                        <ParticleField
                                            {...{
                                                "cellCount": cellCount.value,
                                                "spawnChance":
                                                    props.spawnChance ?? PARTICLE_DISSOLVE_DEFAULTS.spawnChance,
                                                "animationDurationMs": getDurationMs(),
                                                "animationIterationCount": SINGLE_PASS,
                                                "particleLifetimeMs": lifetimeShare.value * getDurationMs(),
                                                "playback": false,
                                                "onUpdate:playback": ignoreWrite,
                                                "progress": progress.value,
                                                "onUpdate:progress": ignoreWrite,
                                                "computeCellWeights": computeCellWeights,
                                                "computeParticlePos": layer.computeParticlePos,
                                                "computeParticleAnimation": layer.computeParticleAnimation,
                                            }}
                                        >
                                            {{ renderParticle: layer.renderParticle } satisfies ParticleFieldSlots}
                                        </ParticleField>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            );
        };
    },
    {
        name: "ParticleDissolve",
        slots: Object as SlotsType<ParticleDissolveSlots>,
        props: declareProps<ParticleDissolveProps>({
            isDissolved: Boolean,
            angleDegrees: null,
            originShare: null,
            durationMs: null,
            particleLifetimeMs: null,
            featherShare: null,
            spawnChance: null,
            particlesPerCell: null,
            cellSize: null,
            computeParticleAnimation: null,
            onDissolveEnd: null,
            onRebuildEnd: null,
        }),
    },
);
