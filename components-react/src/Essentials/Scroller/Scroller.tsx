import { type FocusEvent, Fragment, useEffect, useLayoutEffect, useRef, useState } from "react";

import type { ScrollerMetrics, ScrollerStepper } from "@thewaver/ss-components";
import { SCROLLER_DEFAULTS, ScrollerStyles, ScrollerUtils } from "@thewaver/ss-components";

import { SignalMirrorReactUtils } from "../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { useElement } from "../../Utils/refUtils";
import type { ScrollerProps } from "./Scroller.types";

const getIsSameMetrics = (a: ScrollerMetrics, b: ScrollerMetrics) =>
    a.start === b.start && a.visible === b.visible && a.total === b.total;

export const Scroller = (props: ScrollerProps) => {
    const trackRef = useRef<HTMLDivElement | null>(null);
    const track = useElement(trackRef);

    const [metrics, setMetrics] = useState(ScrollerUtils.NO_METRICS);
    const [progressRatio, setProgressRatio] = SignalMirrorReactUtils.useOptionalState(
        props.progress,
        ScrollerUtils.RATIO_MIN,
    );

    const reportedRatioRef = useRef(ScrollerUtils.RATIO_MIN);

    const gap = props.gap ?? SCROLLER_DEFAULTS.gap;
    const padding = props.padding ?? SCROLLER_DEFAULTS.padding;
    const steps = ScrollerUtils.getSteps(
        props.buttonPlacement ?? SCROLLER_DEFAULTS.buttonPlacement,
        ScrollerUtils.getIsScrollable(metrics),
    );

    const stepper: ScrollerStepper = {
        getIsAtStart: () => ScrollerUtils.getIsAtStart(metrics),
        getIsAtEnd: () => ScrollerUtils.getIsAtEnd(metrics),
        stepToPrevious: () => ScrollerUtils.stepTo(trackRef.current ?? undefined, "previous"),
        stepToNext: () => ScrollerUtils.stepTo(trackRef.current ?? undefined, "next"),
    };

    useLayoutEffect(() => {
        if (!track) return undefined;

        return ScrollerUtils.observe(track, (next) =>
            setMetrics((prev) => (getIsSameMetrics(prev, next) ? prev : next)),
        );
    }, [track]);

    useEffect(() => {
        reportedRatioRef.current = ScrollerUtils.computeProgressRatio(metrics);

        setProgressRatio(reportedRatioRef.current);
    }, [metrics]);

    useEffect(() => {
        if (!track || progressRatio === reportedRatioRef.current) return;

        track.scrollTo({ left: progressRatio * ScrollerUtils.computeScrollRange(ScrollerUtils.readMetrics(track)) });
    }, [track, progressRatio]);

    const handleFocus = (e: FocusEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement | null;

        if (!track || !target || target === track) return;

        track.scrollTo({ left: ScrollerUtils.computeRevealTarget(track, target, padding) });
    };

    return (
        <div className={ScrollerStyles.scrollerRoot} style={{ gap: `${gap}px` }}>
            {steps.leading.map((step, index) => (
                <Fragment key={index}>{props.renderButton(step, stepper)}</Fragment>
            ))}

            <div
                ref={trackRef}
                className={ScrollerStyles.scrollerTrack}
                style={{ paddingBlock: `${padding}px`, paddingInlineStart: `${padding}px` }}
                onFocus={handleFocus}
            >
                {props.children}

                <div className={ScrollerStyles.scrollerTrackEnd} style={{ flexBasis: `${padding}px` }} />
            </div>

            {steps.trailing.map((step, index) => (
                <Fragment key={index}>{props.renderButton(step, stepper)}</Fragment>
            ))}
        </div>
    );
};
