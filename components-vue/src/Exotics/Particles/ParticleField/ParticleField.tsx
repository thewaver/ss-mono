import { type SlotsType, computed, defineComponent, onMounted, onUpdated, shallowRef } from "vue";

import {
    CellAnimationUtils,
    PARTICLE_FIELD_DEFAULTS,
    ParticleFieldStyles,
    ParticleFieldUtils,
} from "@thewaver/ss-components";
import { type Index2d, MathUtils } from "@thewaver/ss-utils";

import { ElementObserverVueUtils } from "../../../Abstracts/ElementObserver/ElementObserverVue.utils";
import { InteractionTrackerVueUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerVue.utils";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { callSlot, declareProps, useTwoWay } from "../../../Utils/propUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { ParticleFieldProps, ParticleFieldSlots } from "./ParticleField.types";

const NO_PROGRESS = 0;
const FIRST_ITERATION = 0;
const NO_WEIGHTS: number[][] = [];

export const ParticleField = defineComponent(
    (props: ParticleFieldProps, { slots }: SlotsContext<ParticleFieldSlots>) => {
        const getDurationMs = () => props.animationDurationMs ?? PARTICLE_FIELD_DEFAULTS.animationDurationMs;
        const getIterationCount = () =>
            props.animationIterationCount ?? PARTICLE_FIELD_DEFAULTS.animationIterationCount;
        const getIterationDelayMs = () =>
            props.animationIterationDelayMs ?? PARTICLE_FIELD_DEFAULTS.animationIterationDelayMs;
        const getLifetimeMs = () =>
            Math.min(props.particleLifetimeMs ?? PARTICLE_FIELD_DEFAULTS.particleLifetimeMs, getDurationMs());

        const rootRef = shallowRef<HTMLDivElement>();
        const bodyRefs = new Map<number, HTMLElement>();

        const isPageHidden = InteractionTrackerVueUtils.usePageHidden();

        const isPlaying = useTwoWay(props, "playback", true);
        const progress = useTwoWay(props, "progress", NO_PROGRESS);
        const currentIteration = shallowRef(FIRST_ITERATION);

        const rootSize = ElementObserverVueUtils.useBorderBoxSize(rootRef);

        const cellCount = computed<Index2d>((previous) => {
            const next = CellAnimationUtils.computeCellCount(props.cellCount, rootSize.value);

            return previous && CellAnimationUtils.getIsSameCount(previous, next) ? previous : next;
        });

        const outline = computed(() =>
            ParticleFieldUtils.computeOutline(
                props.computeShapePoints?.(rootSize.value),
                props.shapeJoinRadii,
                props.shapeLameExponents,
            ),
        );

        const cells = computed(() =>
            ParticleFieldUtils.computeCells(
                cellCount.value,
                rootSize.value,
                props.computeCellWeights?.(cellCount.value) ?? NO_WEIGHTS,
                outline.value,
            ),
        );

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

        let drawnCount = cellCount.value;

        watchAfterRender([cellCount], ([count]) => {
            if (CellAnimationUtils.getIsSameCount(drawnCount, count)) return;

            drawnCount = count;
            currentIteration.value = FIRST_ITERATION;
            progress.value = NO_PROGRESS;
        });

        const animateBodies = () => {
            const computeAnimation = props.computeParticleAnimation;

            if (!computeAnimation) return;

            for (const particle of particles.value) {
                const body = bodyRefs.get(particle.id);

                if (!body) continue;

                CellAnimationUtils.assignAnimationProps(
                    body,
                    computeAnimation(
                        particle.cell,
                        ParticleFieldUtils.computeLife(clockMs.value, particle.spawnMs, getLifetimeMs()),
                    ),
                );
            }
        };

        onMounted(animateBodies);
        onUpdated(animateBodies);

        watchAfterRender([isRunning], ([running]) => {
            if (!running) return;

            return CellAnimationUtils.runPasses({
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

        return () => (
            <div ref={rootRef} class={ParticleFieldStyles.particleFieldRoot} role="presentation" aria-hidden="true">
                {particles.value.map((particle) => (
                    <div
                        key={particle.id}
                        class={ParticleFieldStyles.particleFieldItem}
                        style={{ left: `${particle.pos.x}px`, top: `${particle.pos.y}px` }}
                    >
                        <div
                            class={ParticleFieldStyles.particleFieldBody}
                            ref={(element) => {
                                if (element instanceof HTMLElement) bodyRefs.set(particle.id, element);
                                else bodyRefs.delete(particle.id);
                            }}
                        >
                            {callSlot(slots.renderParticle, {
                                defs: particle.cell,
                                t: ParticleFieldUtils.computeLife(clockMs.value, particle.spawnMs, getLifetimeMs()),
                            })}
                        </div>
                    </div>
                ))}
            </div>
        );
    },
    {
        name: "ParticleField",
        slots: Object as SlotsType<ParticleFieldSlots>,
        props: declareProps<ParticleFieldProps>({
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
            "computeCellWeights": null,
            "computeParticlePos": null,
            "computeParticleAnimation": null,
            "onIterationEnd": null,
            "onAnimationEnd": null,
        }),
    },
);
