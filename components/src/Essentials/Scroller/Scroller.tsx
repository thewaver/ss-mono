import { Index, createEffect, createMemo, createSignal, onCleanup } from "solid-js";

import { MathUtils } from "@thewaver/ss-utils";

import { SignalMirrorUtils } from "../../Abstracts/SignalMirror/SignalMirror.utils";
import { access } from "../../Utils/propUtils";
import { SCROLLER_DEFAULTS } from "./Scroller.const";
import type { ScrollerProps, ScrollerStep, ScrollerStepper } from "./Scroller.types";

import * as styles from "./Scroller.css";

const SCROLL_EPSILON = 1;
const RATIO_MIN = 0;

const readMetrics = (track: HTMLElement) => ({
    start: track.scrollLeft,
    visible: track.clientWidth,
    total: track.scrollWidth,
});

const getIsAtStartOf = (metrics: { start: number }) => metrics.start <= SCROLL_EPSILON;

const getIsAtEndOf = (metrics: { start: number; visible: number; total: number }) =>
    metrics.start + metrics.visible >= metrics.total - SCROLL_EPSILON;

const computeScrollRange = (metrics: { visible: number; total: number }) =>
    Math.max(metrics.total - metrics.visible, 0);

const computeProgressRatio = (metrics: { start: number; visible: number; total: number }) => {
    const range = computeScrollRange(metrics);

    return range === 0 ? RATIO_MIN : MathUtils.clamp01(metrics.start / range);
};

const computeOffsetWithin = (element: HTMLElement, ancestor: HTMLElement) => {
    let offset = 0;
    let node: HTMLElement | null = element;

    while (node && node !== ancestor) {
        offset += node.offsetLeft;
        node = node.offsetParent as HTMLElement | null;
    }

    return offset;
};

const computeRevealTarget = (track: HTMLElement, offset: number, length: number, padding: number) => {
    const { start, visible } = readMetrics(track);

    if (offset - padding < start) return offset - padding;

    return offset + length + padding > start + visible ? offset + length + padding - visible : start;
};

const computeStepTarget = (track: HTMLElement, step: ScrollerStep) => {
    const { start, visible } = readMetrics(track);
    const offsets = [...track.children].map((child) => (child as HTMLElement).offsetLeft);

    if (step === "next") {
        const limit = start + visible;

        return offsets.filter((offset) => offset > start + SCROLL_EPSILON && offset <= limit).pop() ?? limit;
    }

    const limit = start - visible;

    return offsets.filter((offset) => offset < start - SCROLL_EPSILON && offset >= limit).shift() ?? limit;
};

export const Scroller = (props: ScrollerProps) => {
    const [getTrackRef, setTrackRef] = createSignal<HTMLElement>();
    const [getMetrics, setMetrics] = createSignal({ start: 0, visible: 0, total: 0 });

    const getGap = createMemo(() => access(props.gap) ?? SCROLLER_DEFAULTS.gap);

    const getPadding = createMemo(() => access(props.padding) ?? SCROLLER_DEFAULTS.padding);

    const getButtonPlacement = createMemo(() => access(props.buttonPlacement) ?? SCROLLER_DEFAULTS.buttonPlacement);

    const stepTo = (step: ScrollerStep) => {
        const track = getTrackRef();

        if (!track) return false;

        const metrics = readMetrics(track);

        if (step === "previous" ? getIsAtStartOf(metrics) : getIsAtEndOf(metrics)) return false;

        track.scrollTo({ left: computeStepTarget(track, step) });

        return true;
    };

    const stepper: ScrollerStepper = {
        getIsAtStart: () => getIsAtStartOf(getMetrics()),
        getIsAtEnd: () => getIsAtEndOf(getMetrics()),
        stepToPrevious: () => stepTo("previous"),
        stepToNext: () => stepTo("next"),
    };

    const getIsScrollable = createMemo(() => getMetrics().total > getMetrics().visible + SCROLL_EPSILON);

    const [getProgressRatio, setProgressRatio] = SignalMirrorUtils.createOptional(
        () => props.progressSignal,
        RATIO_MIN,
    );

    let reportedRatio = RATIO_MIN;

    createEffect(() => {
        reportedRatio = computeProgressRatio(getMetrics());

        setProgressRatio(reportedRatio);
    });

    createEffect(() => {
        const ratio = getProgressRatio();
        const track = getTrackRef();

        if (!track || ratio === reportedRatio) return;

        track.scrollTo({ left: ratio * computeScrollRange(readMetrics(track)) });
    });

    const getLeadingSteps = createMemo((): ScrollerStep[] => {
        const placement = getButtonPlacement();

        if (!getIsScrollable()) return [];
        if (placement === "start") return ["previous", "next"];

        return placement === "split" ? ["previous"] : [];
    });

    const getTrailingSteps = createMemo((): ScrollerStep[] => {
        const placement = getButtonPlacement();

        if (!getIsScrollable()) return [];
        if (placement === "end") return ["previous", "next"];

        return placement === "split" ? ["next"] : [];
    });

    createEffect(() => {
        const track = getTrackRef();

        if (!track) return;

        const update = () => setMetrics(readMetrics(track));
        const sizeObserver = new ResizeObserver(update);
        const childObserver = new MutationObserver(() => {
            for (const child of track.children) sizeObserver.observe(child);

            update();
        });

        sizeObserver.observe(track);

        for (const child of track.children) sizeObserver.observe(child);

        childObserver.observe(track, { childList: true });
        track.addEventListener("scroll", update, { passive: true });

        onCleanup(() => {
            sizeObserver.disconnect();
            childObserver.disconnect();
            track.removeEventListener("scroll", update);
        });

        update();
    });

    const handleFocusIn = (e: FocusEvent) => {
        const track = getTrackRef();
        const target = e.target as HTMLElement | null;

        if (!track || !target || target === track) return;

        const offset = computeOffsetWithin(target, track);

        track.scrollTo({ left: computeRevealTarget(track, offset, target.offsetWidth, getPadding()) });
    };

    return (
        <div class={styles.scrollerRoot} style={{ gap: `${getGap()}px` }}>
            <Index each={getLeadingSteps()}>{(getStep) => props.renderButton(getStep, stepper)}</Index>

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

            <Index each={getTrailingSteps()}>{(getStep) => props.renderButton(getStep, stepper)}</Index>
        </div>
    );
};
