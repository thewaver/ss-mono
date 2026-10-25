import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import {
    LiveAnnouncerUtils,
    type NavigatorDirection,
    TOASTS_DEFAULTS,
    type ToastRequest,
    type ToastState,
    ToastUtils,
    type ToastsContextType,
    ToastsStyles,
} from "@thewaver/ss-components";
import { ToastsConst } from "@thewaver/ss-components/internal";
import { CSSUtils, GestureUtils } from "@thewaver/ss-utils";

import { ElementFaderReactUtils } from "../../../Abstracts/ElementFader/ElementFaderReact.utils";
import { ElementObserverReactUtils } from "../../../Abstracts/ElementObserver/ElementObserverReact.utils";
import { InteractionTrackerReactUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerReact.utils";
import { SignalMirrorReactUtils } from "../../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { useViewportContext } from "../../../Abstracts/Viewport/Viewport.context";
import { useElement, useLatest } from "../../../Utils/refUtils";
import { ToastsContextProvider } from "./Toasts.context";
import type { Toast, ToastRenderer, ToastsItemProps, ToastsProps } from "./Toasts.types";

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
        ToastUtils.warnIfUnpainted(latest.current.renderToast !== undefined);
    }, [latest]);

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
            dir={props.direction}
            ref={(element) => {
                itemRef.current = element;
                props.ref(element);
            }}
        >
            {props.renderToast?.(props.toast, fader.transitionTarget, props.transitionDurationMs, state)}
        </div>
    );
};

export const Toasts = <T,>(props: ToastsProps<T>) => {
    const viewportContext = useViewportContext();

    const [toasts, setToasts] = SignalMirrorReactUtils.useOptionalState<Toast<T>[]>(props.toasts, []);

    const rootRef = useRef<HTMLDivElement | null>(null);
    const root = useElement(rootRef);
    const queueRef = useRef(toasts);
    const lastSeenRef = useRef(new Map<string, Toast<T>>());
    const firstSeenRef = useRef(new Map<string, Toast<T>>());
    const directionsRef = useRef(new Map<string, NavigatorDirection>());
    const announcedIdsRef = useRef<string[]>([]);
    const setToastsRef = useLatest(setToasts);
    const latest = useLatest(props);

    const [registerOwner] = useState(() => ({}));
    const [entryIds, setEntryIds] = useState<string[]>([]);
    const [entryRefs, setEntryRefs] = useState<Record<string, HTMLElement>>({});

    queueRef.current = toasts;

    const transitionDurationMs = props.transitionDurationMs ?? TOASTS_DEFAULTS.transitionDurationMs;
    const alignment = props.alignment ?? TOASTS_DEFAULTS.alignment;
    const flexDirection = props.flexDirection ?? TOASTS_DEFAULTS.flexDirection;
    const overflow = props.overflow ?? TOASTS_DEFAULTS.overflow;
    const margins = props.margins ?? ToastsConst.DEFAULT_MARGINS;
    const stackAlignment = ToastUtils.computeStackAlignment(alignment, flexDirection);
    const swipeDirection =
        (props.isDismissableOnSwipe ?? TOASTS_DEFAULTS.isDismissableOnSwipe)
            ? ToastUtils.computeSwipeDirection(alignment)
            : undefined;
    const portalRef = viewportContext.getPortalRef();

    const isPaused = InteractionTrackerReactUtils.useHold(rootRef);

    const entrySizes = ElementObserverReactUtils.useBorderBoxSizes(entryIds.map((id) => entryRefs[id]));

    const admitted = useMemo(
        () => ToastUtils.computeAdmitted(toasts, props.limit, overflow),
        [toasts, props.limit, overflow],
    );

    const admittedRef = useLatest(admitted);

    for (const toast of admitted) {
        lastSeenRef.current.set(toast.id, toast);

        if (!firstSeenRef.current.has(toast.id)) firstSeenRef.current.set(toast.id, toast);
        if (!directionsRef.current.has(toast.id)) directionsRef.current.set(toast.id, ToastUtils.readPageDirection());
    }

    const writeQueue = (next: Toast<T>[]) => {
        queueRef.current = next;
        setToastsRef.current(next);
    };

    const [context] = useState<ToastsContextType<Toast<T>>>(() => ({
        show: (toast: ToastRequest<Toast<T>>) => {
            const { toasts: next, id } = ToastUtils.withRequestedToast(queueRef.current, toast);

            if (id === undefined) return undefined;

            directionsRef.current.set(id, ToastUtils.readRaiserDirection());
            writeQueue(next);

            return id;
        },
        dismiss: (id: string) => {
            const prev = queueRef.current;
            const next = ToastUtils.withoutToast(prev, id);

            if (next === prev) return false;

            writeQueue(next);

            return true;
        },
    }));

    useEffect(() => {
        LiveAnnouncerUtils.reserve("polite");
        LiveAnnouncerUtils.reserve("assertive");
    }, []);

    useEffect(() => {
        if (!root) return undefined;

        return ToastUtils.registerStack(registerOwner, {
            region: root,
            scope: portalRef ?? document.body,
            alignment,
            getHasToasts: () => admittedRef.current.length > 0,
        });
    }, [root, portalRef, alignment, registerOwner, admittedRef]);

    useEffect(() => {
        setEntryIds((previous) => ToastUtils.computeEntryIds(previous, admitted));
    }, [admitted]);

    useEffect(() => {
        const previous = announcedIdsRef.current;

        announcedIdsRef.current = entryIds;

        ToastUtils.announceArrivals(previous, entryIds, admittedRef.current);
    }, [entryIds, admittedRef]);

    useEffect(() => {
        const trimmed = ToastUtils.computeOverflowTrim(toasts, props.limit, overflow);

        if (trimmed) writeQueue(trimmed);
    }, [toasts, props.limit, overflow]);

    const handleExitEnd = (id: string) => {
        if (admitted.some((toast) => toast.id === id)) return;

        lastSeenRef.current.delete(id);
        firstSeenRef.current.delete(id);
        directionsRef.current.delete(id);
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

    const resolvePainter = (id: string): ToastRenderer<T> | undefined => {
        const ownPainter = firstSeenRef.current.get(id)?.renderToast;
        const renderDefault = latest.current.renderToast;

        if (ownPainter) return ownPainter;
        if (!renderDefault) return undefined;

        return (toast, visibilityTarget, itemTransitionDurationMs, state) =>
            renderDefault(toast, visibilityTarget, itemTransitionDurationMs, state, () => context.dismiss(id));
    };

    return (
        <ToastsContextProvider value={context as ToastsContextType<Toast<unknown>>}>
            {props.children}

            {createPortal(
                <div
                    ref={rootRef}
                    className={ToastsStyles.toastsRegion}
                    style={{
                        ...CSSUtils.spreadableToStyle(margins, String),
                        flexDirection,
                        justifyContent: stackAlignment.justifyContent,
                        alignItems: stackAlignment.alignItems,
                        gap: `${props.gap ?? TOASTS_DEFAULTS.gap}px`,
                        zIndex: ToastUtils.Z_INDEX,
                    }}
                    dir="ltr"
                    role="region"
                    tabIndex={-1}
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
                                direction={directionsRef.current.get(id) ?? ToastUtils.readPageDirection()}
                                ref={(element) => setEntryRef(id, element)}
                                renderToast={resolvePainter(id)}
                                onElapse={() => context.dismiss(id)}
                                onSwipeDismiss={() => context.dismiss(id)}
                                onExitEnd={() => handleExitEnd(id)}
                            />
                        );
                    })}
                </div>,
                portalRef ?? document.body,
            )}
        </ToastsContextProvider>
    );
};
