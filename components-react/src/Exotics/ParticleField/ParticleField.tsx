import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

import {
    CellAnimationUtils,
    PARTICLE_FIELD_DEFAULTS,
    ParticleFieldStyles,
    ParticleFieldUtils,
} from "@thewaver/ss-components";
import { MathUtils } from "@thewaver/ss-utils";

import { ElementObserverReactUtils } from "../../Abstracts/ElementObserver/ElementObserverReact.utils";
import { InteractionTrackerReactUtils } from "../../Abstracts/InteractionTracker/InteractionTrackerReact.utils";
import { SignalMirrorReactUtils } from "../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { useLatest } from "../../Utils/refUtils";
import type { ParticleFieldProps } from "./ParticleField.types";

const NO_PROGRESS = 0;
const FIRST_ITERATION = 0;
const NO_WEIGHTS: number[][] = [];

export const ParticleField = (props: ParticleFieldProps) => {
    const spawnChance = props.spawnChance ?? PARTICLE_FIELD_DEFAULTS.spawnChance;
    const durationMs = props.animationDurationMs ?? PARTICLE_FIELD_DEFAULTS.animationDurationMs;
    const iterationCount = props.animationIterationCount ?? PARTICLE_FIELD_DEFAULTS.animationIterationCount;
    const iterationDelayMs = props.animationIterationDelayMs ?? PARTICLE_FIELD_DEFAULTS.animationIterationDelayMs;
    const lifetimeMs = Math.min(props.particleLifetimeMs ?? PARTICLE_FIELD_DEFAULTS.particleLifetimeMs, durationMs);

    const rootRef = useRef<HTMLDivElement | null>(null);
    const bodyRefs = useRef(new Map<number, HTMLDivElement>());

    const isPageHidden = InteractionTrackerReactUtils.usePageHidden();

    const [isPlaying] = SignalMirrorReactUtils.useOptionalState(props.playbackState, true);
    const [progress, setProgressState] = SignalMirrorReactUtils.useOptionalState(props.progressState, NO_PROGRESS);
    const [currentIteration, setCurrentIterationState] = useState(FIRST_ITERATION);

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

    const outline = useMemo(
        () =>
            ParticleFieldUtils.computeOutline(
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
                props.computeCellWeights?.(cellCount) ?? NO_WEIGHTS,
                outline,
            ),
        [cellCount.col, cellCount.row, rootSize, props.computeCellWeights, outline],
    );

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

    const drawnCountRef = useRef(cellCount);

    useLayoutEffect(() => {
        if (CellAnimationUtils.getIsSameCount(drawnCountRef.current, cellCount)) return;

        drawnCountRef.current = cellCount;
        latest.current.setCurrentIteration(FIRST_ITERATION);
        latest.current.setProgress(NO_PROGRESS);
    }, [cellCount.col, cellCount.row]);

    useLayoutEffect(() => {
        const computeAnimation = latest.current.props.computeParticleAnimation;

        if (!computeAnimation) return;

        for (const particle of particles) {
            const body = bodyRefs.current.get(particle.id);

            if (!body) continue;

            CellAnimationUtils.assignAnimationProps(
                body,
                computeAnimation(particle.cell, ParticleFieldUtils.computeLife(clockMs, particle.spawnMs, lifetimeMs)),
            );
        }
    });

    useEffect(() => {
        if (!isRunning) return;

        return CellAnimationUtils.runPasses({
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

    return (
        <div ref={rootRef} className={ParticleFieldStyles.particleFieldRoot} role="presentation" aria-hidden="true">
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className={ParticleFieldStyles.particleFieldItem}
                    style={{ left: `${particle.pos.x}px`, top: `${particle.pos.y}px` }}
                >
                    <div
                        className={ParticleFieldStyles.particleFieldBody}
                        ref={(element) => {
                            if (element) bodyRefs.current.set(particle.id, element);

                            return () => {
                                bodyRefs.current.delete(particle.id);
                            };
                        }}
                    >
                        {props.renderParticle(
                            particle.cell,
                            ParticleFieldUtils.computeLife(clockMs, particle.spawnMs, lifetimeMs),
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};
