import { Index, createEffect, createMemo, createSignal, onCleanup } from "solid-js";

import {
    SCROLLER_DEFAULTS,
    type ScrollerStepper,
    ScrollerUtils,
    ScrollerStyles as styles,
} from "@thewaver/ss-components";

import { SignalMirrorSolidUtils } from "../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { access } from "../../Utils/propUtils";
import type { ScrollerProps } from "./ScrollerSolid.types";

export const Scroller = (props: ScrollerProps) => {
    const [getTrackRef, setTrackRef] = createSignal<HTMLElement>();
    const [getMetrics, setMetrics] = createSignal(ScrollerUtils.NO_METRICS);

    const getGap = createMemo(() => access(props.gap) ?? SCROLLER_DEFAULTS.gap);

    const getPadding = createMemo(() => access(props.padding) ?? SCROLLER_DEFAULTS.padding);

    const getButtonPlacement = createMemo(() => access(props.buttonPlacement) ?? SCROLLER_DEFAULTS.buttonPlacement);

    const stepper: ScrollerStepper = {
        getIsAtStart: () => ScrollerUtils.getIsAtStart(getMetrics()),
        getIsAtEnd: () => ScrollerUtils.getIsAtEnd(getMetrics()),
        stepToPrevious: () => ScrollerUtils.stepTo(getTrackRef(), "previous"),
        stepToNext: () => ScrollerUtils.stepTo(getTrackRef(), "next"),
    };

    const getIsScrollable = createMemo(() => ScrollerUtils.getIsScrollable(getMetrics()));

    const [getProgressRatio, setProgressRatio] = SignalMirrorSolidUtils.createOptional(
        () => props.progressSignal,
        ScrollerUtils.RATIO_MIN,
    );

    let reportedRatio = ScrollerUtils.RATIO_MIN;

    createEffect(() => {
        reportedRatio = ScrollerUtils.computeProgressRatio(getMetrics());

        setProgressRatio(reportedRatio);
    });

    createEffect(() => {
        const ratio = getProgressRatio();
        const track = getTrackRef();

        if (!track || ratio === reportedRatio) return;

        track.scrollTo({ left: ratio * ScrollerUtils.computeScrollRange(ScrollerUtils.readMetrics(track)) });
    });

    const getSteps = createMemo(() => ScrollerUtils.getSteps(getButtonPlacement(), getIsScrollable()));

    createEffect(() => {
        const track = getTrackRef();

        if (!track) return;

        onCleanup(ScrollerUtils.observe(track, setMetrics));
    });

    const handleFocusIn = (e: FocusEvent) => {
        const track = getTrackRef();
        const target = e.target as HTMLElement | null;

        if (!track || !target || target === track) return;

        track.scrollTo({ left: ScrollerUtils.computeRevealTarget(track, target, getPadding()) });
    };

    return (
        <div class={styles.scrollerRoot} style={{ gap: `${getGap()}px` }}>
            <Index each={getSteps().leading}>{(getStep) => props.renderButton(getStep, stepper)}</Index>

            <div
                ref={setTrackRef}
                class={styles.scrollerTrack}
                style={{
                    "padding-block": `${getPadding()}px`,
                    "padding-inline-start": `${getPadding()}px`,
                }}
                onFocusIn={handleFocusIn}
            >
                {props.children}

                <div class={styles.scrollerTrackEnd} style={{ "flex-basis": `${getPadding()}px` }} />
            </div>

            <Index each={getSteps().trailing}>{(getStep) => props.renderButton(getStep, stepper)}</Index>
        </div>
    );
};
