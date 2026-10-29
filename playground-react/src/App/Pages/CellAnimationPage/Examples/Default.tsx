import { useMemo, useRef, useState } from "react";

import {
    CellAnimation,
    CellAnimationBreakpointUtils,
    type CellAnimationEvaluationDefs,
    CellAnimationKeyframes,
    CellAnimationOrigins,
    CellAnimationPlaybackUtils,
    CellAnimationWeights,
} from "@thewaver/ss-components-react";
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
    const origin = useMemo(
        () => CellAnimationOrigins.computeOrigin(originType, otherProps.cellCount),
        [originType, otherProps.cellCount],
    );

    const settings = useMemo(
        () => ({
            animationType,
            breakpointOpts,
            playbackOpts,
            durationMs: otherProps.animationDurationMs,
            origin,
        }),
        [animationType, breakpointOpts, playbackOpts, otherProps.animationDurationMs, origin],
    );

    const [cellsWithOrigin] = useState(
        () => new WeakMap<CellAnimationEvaluationDefs, CellAnimationEvaluationDefs & { origin: Index2d }>(),
    );

    const computeFrame = (timeline: number, frameSettings: typeof settings) => ({
        timeline,
        settings: frameSettings,
        breakpointOpts: CellAnimationPlaybackUtils.computeBreakpointOpts(
            frameSettings.breakpointOpts,
            timeline,
            frameSettings.playbackOpts,
        ),
        globalTimeline: CellAnimationPlaybackUtils.computeGlobalTimeline(
            timeline,
            frameSettings.durationMs,
            frameSettings.playbackOpts,
        ),
    });

    const frameRef = useRef<ReturnType<typeof computeFrame>>(undefined);

    const getFrame = (timeline: number) => {
        const frame = frameRef.current;

        if (frame?.timeline === timeline && frame.settings === settings) return frame;

        frameRef.current = computeFrame(timeline, settings);

        return frameRef.current;
    };

    const withOrigin = (defs: CellAnimationEvaluationDefs, cellOrigin: Index2d) => {
        const cached = cellsWithOrigin.get(defs);

        if (cached?.origin === cellOrigin) return cached;

        const cell = { ...defs, origin: cellOrigin };

        cellsWithOrigin.set(defs, cell);

        return cell;
    };

    return (
        <CellAnimation
            {...otherProps}
            animationDurationMs={CellAnimationPlaybackUtils.computeCycleDurationMs(
                otherProps.animationDurationMs,
                playbackOpts,
            )}
            computeCellWeights={(count) =>
                CellAnimationWeights.computeCellWeights(weightType, count, origin, weightOpts)
            }
            computeCellAnimation={(defs, timeline) => {
                const {
                    settings: frameSettings,
                    breakpointOpts: cellBreakpointOpts,
                    globalTimeline,
                } = getFrame(timeline);

                return CellAnimationKeyframes.computeAnimation(
                    frameSettings.animationType,
                    CellAnimationBreakpointUtils.computeBreakpoints(defs.weight, cellBreakpointOpts),
                    withOrigin(defs, frameSettings.origin),
                    globalTimeline,
                    frameSettings.breakpointOpts.easing,
                );
            }}
        />
    );
};
