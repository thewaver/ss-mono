import { useEffect, useMemo, useRef, useState } from "react";

import {
    PARTICLE_SPAWNER_DEFAULTS,
    type ParticleSpawnIterationPattern,
    type ParticleSpawnerController,
    ParticleSpawnerStyles,
    ParticleSpawnerUtils,
} from "@thewaver/ss-components";

import { ElementObserverReactUtils } from "../../../Abstracts/ElementObserver/ElementObserverReact.utils";
import { InteractionTrackerReactUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerReact.utils";
import { MediaQueryMonitorReactUtils } from "../../../Abstracts/MediaQueryMonitor/MediaQueryMonitorReact.utils";
import { SignalMirrorReactUtils } from "../../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { useLatest } from "../../../Utils/refUtils";
import { useStore } from "../../../Utils/storeUtils";
import type { ParticleSpawnerProps } from "./ParticleSpawner.types";

const FIRST_STAGE = 0;
const NOT_STARTED = 0;

export const ParticleSpawner = (props: ParticleSpawnerProps) => {
    const travelDurationMs = props.travelDurationMs ?? PARTICLE_SPAWNER_DEFAULTS.travelDurationMs;
    const retentionMs = props.retentionMs ?? PARTICLE_SPAWNER_DEFAULTS.retentionMs;
    const spawnDelayMs = props.spawnDelayMs ?? PARTICLE_SPAWNER_DEFAULTS.spawnDelayMs;
    const particleCount = ParticleSpawnerUtils.toParticleCount(props.particleCount);

    const patternsKey = JSON.stringify(
        props.spawnIterationPatterns ?? PARTICLE_SPAWNER_DEFAULTS.spawnIterationPatterns,
    );
    const patterns = useMemo(() => JSON.parse(patternsKey) as ParticleSpawnIterationPattern[], [patternsKey]);

    const rootRef = useRef<HTMLDivElement | null>(null);
    const elementsRef = useRef(new Map<number, HTMLDivElement>());
    const tsRef = useRef(new Map<number, number>());

    const [isPlaying] = SignalMirrorReactUtils.useOptionalState(props.playback, true);
    const [stage, setStage] = useState({ index: FIRST_STAGE });
    const [, setFrame] = useState(NOT_STARTED);

    const isWindowVisible = !InteractionTrackerReactUtils.usePageHidden();
    const prefersReducedMotion = MediaQueryMonitorReactUtils.useReducedMotion();

    const rootRect = ElementObserverReactUtils.useViewportRect(rootRef, isWindowVisible);
    const targetRects = ElementObserverReactUtils.useViewportRects(props.targets, isWindowVisible);

    const canSpawn = rootRect !== undefined && isWindowVisible && props.targets.length > 0;

    const latest = useLatest({
        props,
        rootRect,
        targetRects,
        prefersReducedMotion,
        canSpawn,
        timing: { spawnDelayMs, travelDurationMs, retentionMs },
    });

    const [engine] = useState(() =>
        ParticleSpawnerUtils.createEngine({
            getTargetCount: () => latest.current.props.targets.length,
            computeTarget: (index, targetCount) => latest.current.props.computeTarget?.(index, targetCount),
            getElement: (id) => elementsRef.current.get(id),
            getFrame: () => ({
                rootRect: latest.current.rootRect,
                targetRects: latest.current.targetRects,
                prefersReducedMotion: latest.current.prefersReducedMotion,
            }),
            getTiming: () => latest.current.timing,
            getCanSpawn: () => latest.current.canSpawn,
            computeParticlePos: (travel, t) => latest.current.props.computeParticlePos(travel, t),
            onParticleT: (id, t) => tsRef.current.set(id, t),
            onParticleArrive: (index) => latest.current.props.onParticleArrive?.(index),
            onTick: () => setFrame((frame) => frame + 1),
        }),
    );

    const particles = useStore(engine.particles);

    const [controller] = useState<ParticleSpawnerController>(() => ({ emit: engine.emit }));

    useEffect(() => {
        latest.current.props.onMount?.(controller);
    }, [controller]);

    useEffect(() => engine.stop, [engine]);

    useEffect(() => {
        setStage({ index: FIRST_STAGE });
    }, [particleCount, spawnDelayMs, patterns]);

    const pattern = patterns[stage.index];

    useEffect(() => {
        if (!canSpawn || !isPlaying || particleCount <= 0 || !pattern) return;

        return engine.playPattern(pattern, particleCount, {
            onIterationEnd: () => latest.current.props.onIterationEnd?.(),
            onAnimationEnd: () => latest.current.props.onAnimationEnd?.(),
            onNextStage: (index) => setStage({ index }),
        });
    }, [engine, canSpawn, isPlaying, particleCount, pattern, stage, travelDurationMs, retentionMs, spawnDelayMs]);

    return (
        <div ref={rootRef} className={ParticleSpawnerStyles.particleSpawnerRoot} role="presentation" aria-hidden="true">
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className={ParticleSpawnerStyles.particleSpawnerItem}
                    ref={(element) => {
                        if (!element) return;

                        elementsRef.current.set(particle.id, element);
                        engine.drawParticle(particle.id, element);

                        return () => {
                            elementsRef.current.delete(particle.id);
                            tsRef.current.delete(particle.id);
                        };
                    }}
                >
                    {props.renderParticle(particle.index, tsRef.current.get(particle.id) ?? 0)}
                </div>
            ))}
        </div>
    );
};
