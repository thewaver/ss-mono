import { type JSX, type ParentProps, Show, createEffect, createMemo, createSignal, on } from "solid-js";
import { onCleanup, untrack } from "solid-js";

import {
    type CellAnimationFn,
    CellAnimationUtils,
    ElementObserverSolidUtils,
    MediaQueryMonitorSolidUtils,
    PARTICLE_DISSOLVE_DEFAULTS,
    PaintedAreaUtils,
    type PaintedRegion,
    type PaintedSample,
    ParticleDissolveUtils,
    type ParticleFieldCellDefs,
    type SignalPair,
    access,
    ParticleDissolveStyles as styles,
} from "@thewaver/ss-components-solid";
import { Index2dUtils, RectUtils, type Size2d } from "@thewaver/ss-utils";

import { GpuParticleField } from "../ParticleFieldPage/GpuParticleField";

const NO_COLOR = "transparent";
const NEVER_PLAYING: SignalPair<boolean> = [() => false, () => undefined];
const SINGLE_PASS = 1;
const ORIGIN = { row: 0, col: 0 };

const getCellKey = (cell: ParticleFieldCellDefs) => Index2dUtils.toFlatIndex(cell.pos, cell.count.col);

export type GpuParticleDissolveProps = {
    src: string;
    isDissolved: boolean | (() => boolean);
    angleDegrees?: number | (() => number);
    originShare?: { x: number; y: number } | (() => { x: number; y: number } | undefined);
    durationMs?: number | (() => number);
    particleLifetimeMs?: number | (() => number);
    featherShare?: number | (() => number);
    spawnChance?: number | (() => number);
    cellSize?: number | (() => number);
    animation: CellAnimationFn;
    computeParticleSize: (defs: ParticleFieldCellDefs) => Size2d;
    onDissolveEnd?: () => void;
    onRebuildEnd?: () => void;
};

export const GpuParticleDissolve = (props: ParentProps<GpuParticleDissolveProps>) => {
    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getContentRef, setContentRef] = createSignal<HTMLElement>();

    const getIsDissolved = createMemo(() => access(props.isDissolved));

    const [getProgress, setProgress] = createSignal(untrack(getIsDissolved) ? 1 : 0);

    const getSize = ElementObserverSolidUtils.createBorderBoxSizeObserver(getRootRef);

    const getPrefersReducedMotion = MediaQueryMonitorSolidUtils.createReducedMotion();

    const getDurationMs = createMemo(() => access(props.durationMs) ?? PARTICLE_DISSOLVE_DEFAULTS.durationMs);

    const getLifetimeShare = createMemo(() =>
        ParticleDissolveUtils.computeLifetimeShare(
            getDurationMs(),
            access(props.particleLifetimeMs) ?? PARTICLE_DISSOLVE_DEFAULTS.particleLifetimeMs,
        ),
    );

    const getSweep = createMemo(() =>
        ParticleDissolveUtils.computeSweep(
            access(props.angleDegrees) ?? PARTICLE_DISSOLVE_DEFAULTS.angleDegrees,
            access(props.originShare),
            getSize(),
        ),
    );

    const getCellCount = createMemo(
        () =>
            ParticleDissolveUtils.computeCellCount(
                getSize(),
                access(props.cellSize) ?? PARTICLE_DISSOLVE_DEFAULTS.cellSize,
            ),
        undefined,
        { equals: CellAnimationUtils.getIsSameCount },
    );

    const getEdge = createMemo(() => ParticleDissolveUtils.computeEdge(getProgress(), getLifetimeShare()));

    const getMask = createMemo(() =>
        getPrefersReducedMotion()
            ? undefined
            : ParticleDissolveUtils.computeMask(
                  getEdge(),
                  access(props.featherShare) ?? PARTICLE_DISSOLVE_DEFAULTS.featherShare,
                  getSweep(),
                  getSize(),
              ),
    );

    const getContentStyle = createMemo((): JSX.CSSProperties => ({
        "mask-image": getMask(),
        "-webkit-mask-image": getMask(),
        "opacity": getPrefersReducedMotion() && getProgress() > 0 ? 1 - getProgress() : undefined,
    }));

    const getHasParticles = createMemo(() => !getPrefersReducedMotion() && getProgress() > 0 && getProgress() < 1);

    let regions: PaintedRegion[] = [];

    const samples = new Map<number, PaintedSample>();

    const computeParticlePos = (cell: ParticleFieldCellDefs) => {
        const key = getCellKey(cell);
        const painted = PaintedAreaUtils.computeSamples(regions, cell.rect);
        const sample = painted[Math.floor(Math.random() * painted.length)];

        if (!sample) {
            samples.delete(key);

            return RectUtils.getCenter(cell.rect);
        }

        samples.set(key, sample);

        return sample.pos;
    };

    const computeParticleTint = (cell: ParticleFieldCellDefs) => samples.get(getCellKey(cell))?.color ?? NO_COLOR;

    createEffect(
        on(
            getIsDissolved,
            (isDissolved) => {
                const to = isDissolved ? 1 : 0;
                const from = untrack(getProgress);

                if (from === to) return;

                const content = untrack(getContentRef);

                regions = content ? PaintedAreaUtils.measure(content) : [];

                samples.clear();

                onCleanup(
                    ParticleDissolveUtils.run({
                        from,
                        to,
                        durationMs: ParticleDissolveUtils.computeDurationMs(
                            untrack(getDurationMs),
                            untrack(getPrefersReducedMotion),
                        ),
                        onProgress: setProgress,
                        onEnd: () => (isDissolved ? props.onDissolveEnd : props.onRebuildEnd)?.(),
                    }),
                );
            },
            { defer: true },
        ),
    );

    return (
        <div ref={setRootRef} class={styles.particleDissolveRoot}>
            <div ref={setContentRef} inert={getProgress() > 0 ? true : undefined} style={getContentStyle()}>
                {props.children}
            </div>

            <Show when={getHasParticles()}>
                <div class={styles.particleDissolveParticles} aria-hidden="true">
                    <GpuParticleField
                        src={props.src}
                        cellCount={getCellCount}
                        origin={ORIGIN}
                        spawnChance={() => access(props.spawnChance) ?? PARTICLE_DISSOLVE_DEFAULTS.spawnChance}
                        animationDurationMs={getDurationMs}
                        animationIterationCount={SINGLE_PASS}
                        particleLifetimeMs={() => getLifetimeShare() * getDurationMs()}
                        playback={NEVER_PLAYING}
                        progress={[getProgress, () => undefined]}
                        animation={props.animation}
                        computeParticleSize={props.computeParticleSize}
                        computeParticleTint={computeParticleTint}
                        computeCellWeights={(count) =>
                            ParticleDissolveUtils.computeCellWeights(count, getSize(), getSweep())
                        }
                        computeParticlePos={computeParticlePos}
                    />
                </div>
            </Show>
        </div>
    );
};
