import { createMemo } from "solid-js";

import {
    CellAnimation,
    CellAnimationBreakpointUtils,
    type CellAnimationEvaluationDefs,
    CellAnimationKeyframes,
    CellAnimationOrigins,
    CellAnimationPlaybackUtils,
    CellAnimationWeights,
    access,
} from "@thewaver/ss-components-solid";
import type { Index2d } from "@thewaver/ss-utils";

import type { CellAnimationSourcedExampleProps } from "../CellAnimationPage.types";

export const DefaultExample = ({
    animationType,
    breakpointOpts,
    playbackOpts,
    originType,
    weightType,
    weightOpts,
    ...otherProps
}: CellAnimationSourcedExampleProps) => {
    const getOrigin = createMemo(() =>
        CellAnimationOrigins.computeOrigin(access(originType), access(otherProps.cellCount)),
    );

    const getSettings = createMemo(() => ({
        animationType: access(animationType),
        breakpointOpts: { ...access(breakpointOpts) },
        playbackOpts: { ...access(playbackOpts) },
        durationMs: access(otherProps.animationDurationMs),
        origin: getOrigin(),
    }));

    const cellsWithOrigin = new WeakMap<
        CellAnimationEvaluationDefs,
        CellAnimationEvaluationDefs & { origin: Index2d }
    >();

    const computeFrame = (timeline: number, settings: ReturnType<typeof getSettings>) => ({
        timeline,
        settings,
        breakpointOpts: CellAnimationPlaybackUtils.computeBreakpointOpts(
            settings.breakpointOpts,
            timeline,
            settings.playbackOpts,
        ),
        globalTimeline: CellAnimationPlaybackUtils.computeGlobalTimeline(
            timeline,
            settings.durationMs,
            settings.playbackOpts,
        ),
    });

    let frame: ReturnType<typeof computeFrame> | undefined;

    const getFrame = (timeline: number) => {
        const settings = getSettings();

        if (frame?.timeline !== timeline || frame.settings !== settings) frame = computeFrame(timeline, settings);

        return frame;
    };

    const withOrigin = (defs: CellAnimationEvaluationDefs, origin: Index2d) => {
        const cached = cellsWithOrigin.get(defs);

        if (cached?.origin === origin) return cached;

        const cell = { ...defs, origin };

        cellsWithOrigin.set(defs, cell);

        return cell;
    };

    return (
        <CellAnimation
            {...otherProps}
            animationDurationMs={() =>
                CellAnimationPlaybackUtils.computeCycleDurationMs(
                    access(otherProps.animationDurationMs),
                    access(playbackOpts),
                )
            }
            computeCellWeights={(count) =>
                CellAnimationWeights.computeCellWeights(access(weightType), count, getOrigin(), access(weightOpts))
            }
            computeSliceAnimation={(defs, timeline) => {
                const { settings, breakpointOpts: cellBreakpointOpts, globalTimeline } = getFrame(timeline);

                return CellAnimationKeyframes.computeAnimation(
                    settings.animationType,
                    CellAnimationBreakpointUtils.computeBreakpoints(defs.weight, cellBreakpointOpts),
                    withOrigin(defs, settings.origin),
                    globalTimeline,
                    settings.breakpointOpts.easing,
                );
            }}
        />
    );
};
