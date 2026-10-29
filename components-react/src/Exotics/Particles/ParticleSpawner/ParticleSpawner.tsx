import { useEffect, useMemo, useRef, useState } from "react";

import {
    ElementObserverUtils,
    PARTICLE_SPAWNER_DEFAULTS,
    type ParticleSpawnIterationPattern,
    type ParticleSpawnerController,
    type ParticleSpawnerFrame,
    ParticleSpawnerStyles,
    ParticleSpawnerUtils,
} from "@thewaver/ss-components";
import { ParticleSpawnerConst } from "@thewaver/ss-components/internal";

import { InteractionTrackerReactUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerReact.utils";
import { MediaQueryMonitorReactUtils } from "../../../Abstracts/MediaQueryMonitor/MediaQueryMonitorReact.utils";
import { SignalMirrorReactUtils } from "../../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { useViewportContext } from "../../../Abstracts/Viewport/Viewport.context";
import { useElement, useLatest } from "../../../Utils/refUtils";
import { useStore } from "../../../Utils/storeUtils";
import type { ParticleSpawnerProps } from "./ParticleSpawner.types";

export const ParticleSpawner = (props: ParticleSpawnerProps) => {
    const travelDurationMs = props.travelDurationMs ?? PARTICLE_SPAWNER_DEFAULTS.travelDurationMs;
    const restDurationMs = props.restDurationMs ?? PARTICLE_SPAWNER_DEFAULTS.restDurationMs;
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
    const [stage, setStage] = useState({ index: ParticleSpawnerConst.FIRST_STAGE });
    const [, setFrame] = useState(ParticleSpawnerConst.NOT_STARTED);

    const isWindowVisible = !InteractionTrackerReactUtils.usePageHidden();
    const prefersReducedMotion = MediaQueryMonitorReactUtils.useReducedMotion();

    const viewportContext = useViewportContext();
    const rootElement = useElement(rootRef);

    const canSpawn = rootElement !== undefined && isWindowVisible && props.targets.length > 0;

    const latest = useLatest({
        props,
        viewportContext,
        prefersReducedMotion,
        canSpawn,
        timing: { spawnDelayMs, travelDurationMs, restDurationMs },
    });

    const [engine] = useState(() => {
        const measureFrame = (): ParticleSpawnerFrame => {
            const root = rootRef.current;
            const current = latest.current;

            return {
                rootRect: root ? ElementObserverUtils.measureViewportRect(root, current.viewportContext) : undefined,
                targetRects: ElementObserverUtils.measureViewportRects(current.props.targets, current.viewportContext),
                prefersReducedMotion: current.prefersReducedMotion,
            };
        };

        return ParticleSpawnerUtils.createEngine({
            getTargetCount: () => latest.current.props.targets.length,
            computeTarget: (index, targetCount) => latest.current.props.computeTarget?.(index, targetCount),
            getElement: (id) => elementsRef.current.get(id),
            getFrame: measureFrame,
            getTiming: () => latest.current.timing,
            getCanSpawn: () => latest.current.canSpawn,
            computeParticlePos: (travel, t) => latest.current.props.computeParticlePos(travel, t),
            onParticleT: (id, t) => tsRef.current.set(id, t),
            onParticleArrive: (index) => latest.current.props.onParticleArrive?.(index),
            onTick: () => setFrame((frame) => frame + 1),
        });
    });

    const particles = useStore(engine.particles);

    const [controller] = useState<ParticleSpawnerController>(() => ({ emit: engine.emit }));

    useEffect(() => {
        latest.current.props.onMount?.(controller);
    }, [controller]);

    useEffect(() => engine.stop, [engine]);

    useEffect(() => {
        setStage({ index: ParticleSpawnerConst.FIRST_STAGE });
    }, [particleCount, spawnDelayMs, patterns]);

    const pattern = patterns[stage.index];

    useEffect(() => {
        if (!canSpawn || !isPlaying || particleCount <= 0 || !pattern) return;

        return engine.playPattern(pattern, particleCount, {
            onIterationEnd: () => latest.current.props.onIterationEnd?.(),
            onAnimationEnd: () => latest.current.props.onAnimationEnd?.(),
            onNextStage: (index) => setStage({ index }),
        });
    }, [engine, canSpawn, isPlaying, particleCount, pattern, stage, travelDurationMs, restDurationMs, spawnDelayMs]);

    return (
        <div
            ref={rootRef}
            className={
                particles.length > 0
                    ? `${ParticleSpawnerStyles.particleSpawnerRoot} ${ParticleSpawnerStyles.particleSpawnerRootMoving}`
                    : ParticleSpawnerStyles.particleSpawnerRoot
            }
            role="presentation"
            aria-hidden="true"
        >
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
