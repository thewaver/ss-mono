import { type SlotsType, computed, defineComponent, onScopeDispose, shallowRef } from "vue";

import {
    PARTICLE_SPAWNER_DEFAULTS,
    type ParticleSpawnIterationPattern,
    type ParticleSpawnerController,
    ParticleSpawnerStyles,
    ParticleSpawnerUtils,
} from "@thewaver/ss-components";

import { ElementObserverVueUtils } from "../../Abstracts/ElementObserver/ElementObserverVue.utils";
import { InteractionTrackerVueUtils } from "../../Abstracts/InteractionTracker/InteractionTrackerVue.utils";
import { MediaQueryMonitorVueUtils } from "../../Abstracts/MediaQueryMonitor/MediaQueryMonitorVue.utils";
import { watchAfterRender } from "../../Utils/effectUtils";
import { callSlot, declareProps, useTwoWay } from "../../Utils/propUtils";
import { toElement } from "../../Utils/refUtils";
import { useStore } from "../../Utils/storeUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type { ParticleSpawnerProps, ParticleSpawnerSlots } from "./ParticleSpawner.types";

const FIRST_STAGE = 0;
const NOT_STARTED = 0;

export const ParticleSpawner = defineComponent(
    (props: ParticleSpawnerProps, { slots }: SlotsContext<ParticleSpawnerSlots>) => {
        const getTravelDurationMs = () => props.travelDurationMs ?? PARTICLE_SPAWNER_DEFAULTS.travelDurationMs;
        const getRetentionMs = () => props.retentionMs ?? PARTICLE_SPAWNER_DEFAULTS.retentionMs;
        const getSpawnDelayMs = () => props.spawnDelayMs ?? PARTICLE_SPAWNER_DEFAULTS.spawnDelayMs;
        const getParticleCount = () => ParticleSpawnerUtils.toParticleCount(props.particleCount);

        const patternsKey = computed(() =>
            JSON.stringify(props.spawnIterationPatterns ?? PARTICLE_SPAWNER_DEFAULTS.spawnIterationPatterns),
        );
        const patterns = computed(() => JSON.parse(patternsKey.value) as ParticleSpawnIterationPattern[]);

        const rootRef = shallowRef<HTMLDivElement>();
        const elements = new Map<number, HTMLElement>();
        const ts = new Map<number, number>();

        const isPlaying = useTwoWay(props, "playback", true);
        const stage = shallowRef({ index: FIRST_STAGE });
        const frame = shallowRef(NOT_STARTED);

        const isPageHidden = InteractionTrackerVueUtils.usePageHidden();
        const isWindowVisible = computed(() => !isPageHidden.value);
        const prefersReducedMotion = MediaQueryMonitorVueUtils.useReducedMotion();

        const rootRect = ElementObserverVueUtils.useViewportRect(rootRef, isWindowVisible);
        const targetRects = ElementObserverVueUtils.useViewportRects(() => props.targets, isWindowVisible);

        const canSpawn = computed(
            () => rootRect.value !== undefined && isWindowVisible.value && props.targets.length > 0,
        );

        const engine = ParticleSpawnerUtils.createEngine({
            getTargetCount: () => props.targets.length,
            computeTarget: (index, targetCount) => props.computeTarget?.(index, targetCount),
            getElement: (id) => elements.get(id),
            getFrame: () => ({
                rootRect: rootRect.value,
                targetRects: targetRects.value,
                prefersReducedMotion: prefersReducedMotion.value,
            }),
            getTiming: () => ({
                spawnDelayMs: getSpawnDelayMs(),
                travelDurationMs: getTravelDurationMs(),
                retentionMs: getRetentionMs(),
            }),
            getCanSpawn: () => canSpawn.value,
            computeParticlePos: (travel, t) => props.computeParticlePos(travel, t),
            onParticleT: (id, t) => ts.set(id, t),
            onParticleArrive: (index) => props.onParticleArrive?.(index),
            onTick: () => {
                frame.value = frame.value + 1;
            },
        });

        const particles = useStore(engine.particles);

        const controller: ParticleSpawnerController = { emit: engine.emit };

        watchAfterRender([], () => {
            props.onMount?.(controller);
        });

        onScopeDispose(engine.stop);

        watchAfterRender([getParticleCount, getSpawnDelayMs, patterns], () => {
            stage.value = { index: FIRST_STAGE };
        });

        const pattern = computed(() => patterns.value[stage.value.index]);

        watchAfterRender(
            [
                canSpawn,
                isPlaying,
                getParticleCount,
                pattern,
                stage,
                getTravelDurationMs,
                getRetentionMs,
                getSpawnDelayMs,
            ],
            ([isSpawnable, isOn, particleCount, current]) => {
                if (!isSpawnable || !isOn || particleCount <= 0 || !current) return;

                return engine.playPattern(current, particleCount, {
                    onIterationEnd: () => props.onIterationEnd?.(),
                    onAnimationEnd: () => props.onAnimationEnd?.(),
                    onNextStage: (index) => {
                        stage.value = { index };
                    },
                });
            },
        );

        return () => {
            void frame.value;

            return (
                <div
                    ref={rootRef}
                    class={ParticleSpawnerStyles.particleSpawnerRoot}
                    role="presentation"
                    aria-hidden="true"
                >
                    {particles.value.map((particle) => (
                        <div
                            key={particle.id}
                            class={ParticleSpawnerStyles.particleSpawnerItem}
                            ref={(target) => {
                                const element = toElement(target);

                                if (!element) {
                                    elements.delete(particle.id);
                                    ts.delete(particle.id);

                                    return;
                                }

                                elements.set(particle.id, element);
                                engine.drawParticle(particle.id, element);
                            }}
                        >
                            {callSlot(slots.renderParticle, { index: particle.index, t: ts.get(particle.id) ?? 0 })}
                        </div>
                    ))}
                </div>
            );
        };
    },
    {
        name: "ParticleSpawner",
        slots: Object as SlotsType<ParticleSpawnerSlots>,
        props: declareProps<ParticleSpawnerProps>({
            "targets": null,
            "particleCount": null,
            "travelDurationMs": null,
            "retentionMs": null,
            "spawnDelayMs": null,
            "spawnIterationPatterns": null,
            "playback": Boolean,
            "onUpdate:playback": null,
            "computeTarget": null,
            "computeParticlePos": null,
            "onParticleArrive": null,
            "onIterationEnd": null,
            "onAnimationEnd": null,
            "onMount": null,
        }),
    },
);
