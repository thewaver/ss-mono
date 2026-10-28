import { type Accessor, type JSX, type ParentProps, Show, createEffect, createMemo, createSignal, on } from "solid-js";
import { onCleanup, untrack } from "solid-js";

import {
    CellAnimationUtils,
    PARTICLE_DISSOLVE_DEFAULTS,
    PaintedAreaUtils,
    type PaintedRegion,
    type PaintedSample,
    ParticleDissolveUtils,
    type ParticleFieldCellDefs,
    ParticleDissolveStyles as styles,
} from "@thewaver/ss-components";
import { type CSSAnimationValues, Index2dUtils, RectUtils } from "@thewaver/ss-utils";

import { ElementObserverSolidUtils } from "../../../Abstracts/ElementObserver/ElementObserverSolid.utils";
import { MediaQueryMonitorSolidUtils } from "../../../Abstracts/MediaQueryMonitor/MediaQueryMonitorSolid.utils";
import { access } from "../../../Utils/propUtils";
import type { SignalPair } from "../../../Utils/typeUtils";
import { ParticleField } from "../ParticleField/ParticleField";
import type { ParticleDissolveProps } from "./ParticleDissolveSolid.types";

const NO_ANIMATION: CSSAnimationValues = {};
const NO_COLOR = "";
const NEVER_PLAYING: SignalPair<boolean> = [() => false, () => undefined];
const SINGLE_PASS = 1;

const getCellKey = (cell: ParticleFieldCellDefs) => Index2dUtils.toFlatIndex(cell.pos, cell.count.col);

export const ParticleDissolve = (props: ParentProps<ParticleDissolveProps>) => {
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

    const computeParticleAnimation = (cell: ParticleFieldCellDefs, t: number) =>
        props.computeParticleAnimation?.({ cell, color: samples.get(getCellKey(cell))?.color ?? NO_COLOR }, t) ??
        NO_ANIMATION;

    const renderParticle = (cell: ParticleFieldCellDefs, getT: Accessor<number>) => {
        const sample = samples.get(getCellKey(cell));

        return sample ? props.renderParticle({ cell, color: sample.color }, getT) : undefined;
    };

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
                    <ParticleField
                        cellCount={getCellCount}
                        spawnChance={() => access(props.spawnChance) ?? PARTICLE_DISSOLVE_DEFAULTS.spawnChance}
                        animationDurationMs={getDurationMs}
                        animationIterationCount={SINGLE_PASS}
                        particleLifetimeMs={() => getLifetimeShare() * getDurationMs()}
                        playback={NEVER_PLAYING}
                        progress={[getProgress, () => undefined]}
                        computeCellWeights={(count) =>
                            ParticleDissolveUtils.computeCellWeights(count, getSize(), getSweep())
                        }
                        computeParticlePos={computeParticlePos}
                        computeParticleAnimation={computeParticleAnimation}
                        renderParticle={renderParticle}
                    />
                </div>
            </Show>
        </div>
    );
};
