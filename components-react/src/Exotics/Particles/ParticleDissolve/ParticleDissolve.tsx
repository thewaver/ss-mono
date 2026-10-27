import { type RefObject, useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";

import {
    PARTICLE_DISSOLVE_DEFAULTS,
    PaintedAreaUtils,
    type PaintedRegion,
    type PaintedSample,
    ParticleDissolveUtils,
    type ParticleFieldCellDefs,
    ParticleDissolveStyles as styles,
} from "@thewaver/ss-components";
import { type CSSAnimationValues, type Index2d, Index2dUtils, RectUtils } from "@thewaver/ss-utils";

import { ElementObserverReactUtils } from "../../../Abstracts/ElementObserver/ElementObserverReact.utils";
import { MediaQueryMonitorReactUtils } from "../../../Abstracts/MediaQueryMonitor/MediaQueryMonitorReact.utils";
import { useLatest } from "../../../Utils/refUtils";
import { ParticleField } from "../ParticleField/ParticleField";
import type { ParticleDissolveProps } from "./ParticleDissolve.types";

const NO_ANIMATION: CSSAnimationValues = {};
const NO_COLOR = "";
const NEVER_PLAYING = [false, () => undefined] as const;
const SINGLE_PASS = 1;

const ignoreWrite = () => undefined;

const getCellKey = (cell: ParticleFieldCellDefs) => Index2dUtils.toFlatIndex(cell.pos, cell.count.col);

type ParticleDissolveLayerProps = Pick<ParticleDissolveProps, "computeParticleAnimation" | "renderParticle"> & {
    regionsRef: RefObject<PaintedRegion[]>;
    layers: Set<Map<number, PaintedSample>>;
    cellCount: Index2d;
    spawnChance: number;
    durationMs: number;
    lifetimeMs: number;
    progress: number;
    computeCellWeights: (count: Index2d) => number[][];
};

const ParticleDissolveLayer = (props: ParticleDissolveLayerProps) => {
    const [samples] = useState(() => new Map<number, PaintedSample>());

    const latest = useLatest(props);

    useLayoutEffect(() => {
        props.layers.add(samples);

        return () => {
            props.layers.delete(samples);
        };
    }, [props.layers, samples]);

    const computeParticlePos = (cell: ParticleFieldCellDefs) => {
        const key = getCellKey(cell);
        const painted = PaintedAreaUtils.computeSamples(latest.current.regionsRef.current, cell.rect);
        const sample = painted[Math.floor(Math.random() * painted.length)];

        if (!sample) {
            samples.delete(key);

            return RectUtils.getCenter(cell.rect);
        }

        samples.set(key, sample);

        return sample.pos;
    };

    const computeParticleAnimation = (cell: ParticleFieldCellDefs, t: number) =>
        latest.current.computeParticleAnimation?.(
            { cell, color: samples.get(getCellKey(cell))?.color ?? NO_COLOR },
            t,
        ) ?? NO_ANIMATION;

    const renderParticle = (cell: ParticleFieldCellDefs, t: number) => {
        const sample = samples.get(getCellKey(cell));

        return sample ? props.renderParticle({ cell, color: sample.color }, t) : undefined;
    };

    return (
        <div className={styles.particleDissolveParticleLayer}>
            <ParticleField
                cellCount={props.cellCount}
                spawnChance={props.spawnChance}
                animationDurationMs={props.durationMs}
                animationIterationCount={SINGLE_PASS}
                particleLifetimeMs={props.lifetimeMs}
                playback={NEVER_PLAYING}
                progress={[props.progress, ignoreWrite]}
                computeCellWeights={props.computeCellWeights}
                computeParticlePos={computeParticlePos}
                computeParticleAnimation={computeParticleAnimation}
                renderParticle={renderParticle}
            />
        </div>
    );
};

export const ParticleDissolve = (props: ParticleDissolveProps) => {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const regionsRef = useRef<PaintedRegion[]>([]);

    const [progress, setProgressState] = useState(props.isDissolved ? 1 : 0);
    const [layers] = useState(() => new Set<Map<number, PaintedSample>>());

    const progressRef = useRef(progress);

    const setProgress = (value: number) => {
        progressRef.current = value;
        setProgressState(value);
    };

    const size = ElementObserverReactUtils.useBorderBoxSize(rootRef);

    const prefersReducedMotion = MediaQueryMonitorReactUtils.useReducedMotion();

    const durationMs = props.durationMs ?? PARTICLE_DISSOLVE_DEFAULTS.durationMs;
    const angleDegrees = props.angleDegrees ?? PARTICLE_DISSOLVE_DEFAULTS.angleDegrees;

    const lifetimeShare = ParticleDissolveUtils.computeLifetimeShare(
        durationMs,
        props.particleLifetimeMs ?? PARTICLE_DISSOLVE_DEFAULTS.particleLifetimeMs,
    );

    const sweep = useMemo(
        () => ParticleDissolveUtils.computeSweep(angleDegrees, props.originShare, size),
        [angleDegrees, props.originShare, size],
    );

    const cellCount = ParticleDissolveUtils.computeCellCount(
        size,
        props.cellSize ?? PARTICLE_DISSOLVE_DEFAULTS.cellSize,
    );

    const computeCellWeights = useCallback(
        (count: Index2d) => ParticleDissolveUtils.computeCellWeights(count, size, sweep),
        [size, sweep],
    );

    const mask = prefersReducedMotion
        ? undefined
        : ParticleDissolveUtils.computeMask(
              ParticleDissolveUtils.computeEdge(progress, lifetimeShare),
              props.featherShare ?? PARTICLE_DISSOLVE_DEFAULTS.featherShare,
              sweep,
              size,
          );

    const layerIndexes = Array.from(
        {
            length: ParticleDissolveUtils.computeParticlesPerCell(
                props.particlesPerCell ?? PARTICLE_DISSOLVE_DEFAULTS.particlesPerCell,
            ),
        },
        (_, index) => index,
    );

    const hasParticles = !prefersReducedMotion && progress > 0 && progress < 1;

    const latest = useLatest({ props, durationMs, prefersReducedMotion, setProgress });

    useLayoutEffect(() => {
        const isDissolved = latest.current.props.isDissolved;
        const to = isDissolved ? 1 : 0;
        const from = progressRef.current;

        if (from === to) return undefined;

        regionsRef.current = contentRef.current ? PaintedAreaUtils.measure(contentRef.current) : [];

        for (const samples of layers) samples.clear();

        return ParticleDissolveUtils.run({
            from,
            to,
            durationMs: ParticleDissolveUtils.computeDurationMs(
                latest.current.durationMs,
                latest.current.prefersReducedMotion,
            ),
            onProgress: (value) => latest.current.setProgress(value),
            onEnd: () => (isDissolved ? latest.current.props.onDissolveEnd : latest.current.props.onRebuildEnd)?.(),
        });
    }, [props.isDissolved, layers]);

    return (
        <div ref={rootRef} className={styles.particleDissolveRoot}>
            <div
                ref={contentRef}
                inert={progress > 0}
                style={{
                    maskImage: mask,
                    WebkitMaskImage: mask,
                    opacity: prefersReducedMotion && progress > 0 ? 1 - progress : undefined,
                }}
            >
                {props.children}
            </div>

            {hasParticles && (
                <div className={styles.particleDissolveParticles} aria-hidden="true">
                    {layerIndexes.map((index) => (
                        <ParticleDissolveLayer
                            key={index}
                            regionsRef={regionsRef}
                            layers={layers}
                            cellCount={cellCount}
                            spawnChance={props.spawnChance ?? PARTICLE_DISSOLVE_DEFAULTS.spawnChance}
                            durationMs={durationMs}
                            lifetimeMs={lifetimeShare * durationMs}
                            progress={progress}
                            computeCellWeights={computeCellWeights}
                            computeParticleAnimation={props.computeParticleAnimation}
                            renderParticle={props.renderParticle}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
