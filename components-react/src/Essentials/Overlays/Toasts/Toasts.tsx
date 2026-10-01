import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import {
    LiveAnnouncerUtils,
    TOASTS_DEFAULTS,
    type Toast,
    type ToastState,
    ToastUtils,
    ToastsStyles,
} from "@thewaver/ss-components";
import { CSSUtils, GestureUtils } from "@thewaver/ss-utils";

import { ElementFaderReactUtils } from "../../../Abstracts/ElementFader/ElementFaderReact.utils";
import { ElementObserverReactUtils } from "../../../Abstracts/ElementObserver/ElementObserverReact.utils";
import { InteractionTrackerReactUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerReact.utils";
import { useViewportContext } from "../../../Abstracts/Viewport/Viewport.context";
import { useElement, useLatest } from "../../../Utils/refUtils";
import type { ToastsItemProps, ToastsProps } from "./Toasts.types";

const DEFAULT_MARGINS = CSSUtils.spreadMargin(0);

const ToastsItem = <T,>(props: ToastsItemProps<T>) => {
    const itemRef = useRef<HTMLDivElement | null>(null);
    const latest = useLatest(props);
    const isLeavingRef = useRef(false);

    const fader = ElementFaderReactUtils.useFader(!props.isExiting, {
        transitionDurationMs: props.transitionDurationMs,
        ref: itemRef,
        onShow: () => latest.current.toast.onShow?.(),
        onHide: () => latest.current.toast.onHide?.(),
    });

    const [swipeOffsetRatio, setSwipeOffsetRatio] = useState(0);

    const { isSwiping } = InteractionTrackerReactUtils.useAxialSwipe(
        itemRef,
        props.swipeDirection === undefined || props.isExiting,
        {
            axis: ToastUtils.computeSwipeAxis(props.swipeDirection),
            commitRatio: ToastUtils.SWIPE_COMMIT_RATIO,
            onSwipe: (progressRatio) => {
                if (!props.swipeDirection) return;

                setSwipeOffsetRatio(GestureUtils.computeSwipeOffset(progressRatio, props.swipeDirection));
            },
            onSwipeEnd: (direction) => {
                if (direction !== undefined && direction === props.swipeDirection) {
                    props.onSwipeDismiss();

                    return;
                }

                setSwipeOffsetRatio(0);
            },
        },
    );

    const isPaused = props.isPaused || isSwiping;
    const durationMs = props.toast.durationMs;

    const [countdown] = useState(ToastUtils.createCountdown);

    useEffect(() => {
        if (durationMs === undefined) return;

        return countdown.run(durationMs, isPaused, () => latest.current.onElapse());
    }, [countdown, durationMs, isPaused, latest]);

    useEffect(() => {
        if (!props.isExiting) {
            isLeavingRef.current = false;

            return;
        }

        if (!fader.hasTransitionFinished) {
            isLeavingRef.current = true;

            return;
        }

        if (isLeavingRef.current) latest.current.onExitEnd();
    }, [props.isExiting, fader.hasTransitionFinished, latest]);

    const state: ToastState = {
        index: props.index,
        count: props.count,
        isPaused,
        sizes: props.sizes,
        swipeDirection: props.swipeDirection,
        swipeOffsetRatio,
        isSwiping,
    };

    return (
        <div
            className={ToastsStyles.toastsItem}
            ref={(element) => {
                itemRef.current = element;
                props.ref(element);
            }}
        >
            {props.renderToast(props.toast, fader.transitionTarget, props.transitionDurationMs, state)}
        </div>
    );
};

export const Toasts = <T,>(props: ToastsProps<T>) => {
    const viewportContext = useViewportContext();

    const [toasts, setToasts] = props.toasts;

    const rootRef = useRef<HTMLDivElement | null>(null);
    const root = useElement(rootRef);
    const lastSeenRef = useRef(new Map<string, Toast<T>>());
    const announcedIdsRef = useRef<string[]>([]);
    const latest = useLatest(props);

    const [entryIds, setEntryIds] = useState<string[]>([]);
    const [entryRefs, setEntryRefs] = useState<Record<string, HTMLElement>>({});

    const transitionDurationMs = props.transitionDurationMs ?? TOASTS_DEFAULTS.transitionDurationMs;
    const alignment = props.alignment ?? TOASTS_DEFAULTS.alignment;
    const dir = props.dir ?? TOASTS_DEFAULTS.dir;
    const overflow = props.overflow ?? TOASTS_DEFAULTS.overflow;
    const margins = props.margins ?? DEFAULT_MARGINS;
    const hotkey = props.hotkey ?? TOASTS_DEFAULTS.hotkey;
    const politeness = props.ariaLive ?? TOASTS_DEFAULTS.ariaLive;
    const stackAlignment = ToastUtils.computeStackAlignment(alignment, dir);
    const swipeDirection =
        (props.isDismissableOnSwipe ?? TOASTS_DEFAULTS.isDismissableOnSwipe)
            ? ToastUtils.computeSwipeDirection(alignment)
            : undefined;

    const isPaused = InteractionTrackerReactUtils.useHold(rootRef);

    const entrySizes = ElementObserverReactUtils.useBorderBoxSizes(entryIds.map((id) => entryRefs[id]));

    const admitted = useMemo(
        () => ToastUtils.computeAdmitted(toasts, props.limit, overflow),
        [toasts, props.limit, overflow],
    );

    for (const toast of admitted) lastSeenRef.current.set(toast.id, toast);

    const hasAnnouncer = props.computeAnnouncement !== undefined;

    useEffect(() => {
        if (!hasAnnouncer) return;

        LiveAnnouncerUtils.reserve("polite");
        LiveAnnouncerUtils.reserve("assertive");
    }, [hasAnnouncer]);

    useEffect(() => {
        setEntryIds((previous) => ToastUtils.computeEntryIds(previous, admitted));
    }, [admitted]);

    useEffect(() => {
        const previous = announcedIdsRef.current;
        const computeAnnouncement = latest.current.computeAnnouncement;

        announcedIdsRef.current = entryIds;

        if (!computeAnnouncement) return;

        ToastUtils.announceArrivals(previous, entryIds, admitted, computeAnnouncement, politeness);
    }, [entryIds]);

    useEffect(() => (root ? ToastUtils.observeHotkey(root, hotkey) : undefined), [root, hotkey]);

    useEffect(() => {
        const trimmed = ToastUtils.computeOverflowTrim(toasts, props.limit, overflow);

        if (trimmed) setToasts(trimmed);
    }, [toasts, props.limit, overflow]);

    const dismiss = (id: string) => {
        const current = latest.current.toasts[0];
        const next = ToastUtils.withoutToast(current, id);

        if (next !== current) latest.current.toasts[1](next);
    };

    const handleExitEnd = (id: string) => {
        if (admitted.some((toast) => toast.id === id)) return;

        lastSeenRef.current.delete(id);
        setEntryIds((previous) => previous.filter((entryId) => entryId !== id));
        setEntryRefs((previous) => {
            if (!(id in previous)) return previous;

            const next = { ...previous };

            delete next[id];

            return next;
        });
    };

    const setEntryRef = (id: string, element: HTMLElement | null) => {
        if (!element) return;

        setEntryRefs((previous) => (previous[id] === element ? previous : { ...previous, [id]: element }));
    };

    return createPortal(
        <div
            ref={rootRef}
            className={ToastsStyles.toastsRegion}
            style={{
                ...CSSUtils.spreadableToStyle(margins, (key) => key),
                flexDirection: dir,
                justifyContent: stackAlignment.justifyContent,
                alignItems: stackAlignment.alignItems,
                gap: `${props.gap ?? TOASTS_DEFAULTS.gap}px`,
                zIndex: ToastUtils.Z_INDEX,
            }}
            role="region"
            tabIndex={-1}
            aria-live={hasAnnouncer ? undefined : politeness}
            aria-label={props.ariaLabel}
        >
            {entryIds.map((id, index) => {
                const toast = admitted.find((entry) => entry.id === id) ?? lastSeenRef.current.get(id);

                if (!toast) return null;

                return (
                    <ToastsItem
                        key={id}
                        toast={toast}
                        index={index}
                        count={entryIds.length}
                        isExiting={!admitted.some((entry) => entry.id === id)}
                        isPaused={isPaused}
                        transitionDurationMs={transitionDurationMs}
                        sizes={entrySizes}
                        swipeDirection={swipeDirection}
                        ref={(element) => setEntryRef(id, element)}
                        renderToast={props.renderToast}
                        onElapse={() => dismiss(id)}
                        onSwipeDismiss={() => dismiss(id)}
                        onExitEnd={() => handleExitEnd(id)}
                    />
                );
            })}
        </div>,
        viewportContext.getPortalRef() ?? document.body,
    );
};
