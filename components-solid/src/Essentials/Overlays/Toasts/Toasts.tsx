import type { ParentProps } from "solid-js";
import { For, createEffect, createMemo, createSignal, onCleanup, onMount, untrack } from "solid-js";
import { Portal } from "solid-js/web";

import {
    LiveAnnouncerUtils,
    type NavigatorDirection,
    TOASTS_DEFAULTS,
    type ToastRequest,
    type ToastState,
    ToastUtils,
    type ToastsContextType,
    ToastsStyles as styles,
} from "@thewaver/ss-components";
import { CSSUtils, GestureUtils, StringUtils } from "@thewaver/ss-utils";

import { ElementFaderSolidUtils } from "../../../Abstracts/ElementFader/ElementFaderSolid.utils";
import { ElementObserverSolidUtils } from "../../../Abstracts/ElementObserver/ElementObserverSolid.utils";
import { InteractionTrackerSolidUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerSolid.utils";
import { SignalMirrorSolidUtils } from "../../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { useViewportContext } from "../../../Abstracts/Viewport/Viewport.context";
import { access } from "../../../Utils/propUtils";
import { ToastsContextProvider } from "./Toasts.context";
import type { Toast, ToastRenderer, ToastsItemProps, ToastsProps } from "./ToastsSolid.types";

const ToastsItem = <T,>(props: ToastsItemProps<T>) => {
    const [getItemRef, setItemRef] = createSignal<HTMLElement>();

    const { getTransitionTarget, getHasTransitionFinished } = ElementFaderSolidUtils.createFader(
        () => !access(props.isExiting),
        {
            getTransitionDurationMs: () => access(props.transitionDurationMs),
            getRef: getItemRef,
            onShow: () => access(props.toast).onShow?.(),
            onHide: () => access(props.toast).onHide?.(),
        },
    );

    const getDurationMs = createMemo(() => access(props.toast).durationMs);

    const getSwipeDirection = createMemo(() => access(props.swipeDirection));

    const [getSwipeOffsetRatio, setSwipeOffsetRatio] = createSignal(0);

    const { getIsSwiping } = InteractionTrackerSolidUtils.trackAxialSwipe(
        getItemRef,
        () => getSwipeDirection() === undefined || access(props.isExiting),
        {
            getAxis: () => ToastUtils.computeSwipeAxis(getSwipeDirection()),
            getCommitRatio: () => ToastUtils.SWIPE_COMMIT_RATIO,
            onSwipe: (progressRatio) => {
                const direction = getSwipeDirection();

                if (!direction) return;

                setSwipeOffsetRatio(GestureUtils.computeSwipeOffset(progressRatio, direction));
            },
            onSwipeEnd: (direction) => {
                if (direction !== undefined && direction === getSwipeDirection()) {
                    props.onSwipeDismiss();

                    return;
                }

                setSwipeOffsetRatio(0);
            },
        },
    );

    const getIsPaused = createMemo(() => access(props.isPaused) || getIsSwiping());

    const getState = createMemo((): ToastState => ({
        index: access(props.index),
        count: access(props.count),
        isPaused: getIsPaused(),
        sizes: access(props.sizes),
        swipeDirection: getSwipeDirection(),
        swipeOffsetRatio: getSwipeOffsetRatio(),
        isSwiping: getIsSwiping(),
    }));

    const countdown = ToastUtils.createCountdown();

    createEffect(() => {
        const durationMs = getDurationMs();

        if (durationMs === undefined) return;

        const stop = countdown.run(durationMs, getIsPaused(), () => props.onElapse());

        if (stop) onCleanup(stop);
    });

    createEffect(() => {
        if (!access(props.isExiting) || !getHasTransitionFinished()) return;

        props.onExitEnd();
    });

    return (
        <div
            class={styles.toastsItem}
            dir={access(props.direction)}
            ref={(element) => {
                setItemRef(element);
                props.ref(element);
            }}
        >
            {props.renderToast?.(
                () => access(props.toast),
                getTransitionTarget,
                () => access(props.transitionDurationMs),
                getState,
            )}
        </div>
    );
};

export const Toasts = <T,>(props: ParentProps<ToastsProps<T>>) => {
    const [getToasts, setToasts] = SignalMirrorSolidUtils.createOptional<Toast<T>[]>(() => props.toasts, []);

    const viewportContext = useViewportContext();

    const registerOwner = {};

    const directions = new Map<string, NavigatorDirection>();

    const [getEntryIds, setEntryIds] = createSignal<string[]>([]);
    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getEntryRefs, setEntryRefs] = createSignal<Record<string, HTMLElement>>({});

    const getTransitionDurationMs = createMemo(
        () => access(props.transitionDurationMs) ?? TOASTS_DEFAULTS.transitionDurationMs,
    );

    const getAlignment = createMemo(() => access(props.alignment) ?? TOASTS_DEFAULTS.alignment);

    const getFlexDirection = createMemo(() => access(props.flexDirection) ?? TOASTS_DEFAULTS.flexDirection);

    const getOverflow = createMemo(() => access(props.overflow) ?? TOASTS_DEFAULTS.overflow);

    const getMargins = createMemo(() => access(props.margins) ?? CSSUtils.spreadMargin(0));

    const getStackAlignment = createMemo(() => ToastUtils.computeStackAlignment(getAlignment(), getFlexDirection()));

    const getSwipeDirection = createMemo(() =>
        (access(props.isDismissableOnSwipe) ?? TOASTS_DEFAULTS.isDismissableOnSwipe)
            ? ToastUtils.computeSwipeDirection(getAlignment())
            : undefined,
    );

    const getIsPaused = InteractionTrackerSolidUtils.trackHold(getRootRef);

    const getEntrySizes = ElementObserverSolidUtils.createBorderBoxSizeListObserver(() =>
        getEntryIds().map((id) => getEntryRefs()[id]),
    );

    const setEntryRef = (id: string, element: HTMLElement) => {
        setEntryRefs((prev) => (prev[id] === element ? prev : { ...prev, [id]: element }));
    };

    onMount(() => {
        LiveAnnouncerUtils.reserve("polite");
        LiveAnnouncerUtils.reserve("assertive");
    });

    const getAdmitted = createMemo(() => ToastUtils.computeAdmitted(getToasts(), access(props.limit), getOverflow()));

    createEffect(() => {
        const region = getRootRef();
        const scope = viewportContext.getPortalRef() ?? document.body;
        const alignment = getAlignment();

        if (!region) return;

        onCleanup(
            ToastUtils.registerStack(registerOwner, {
                region,
                scope,
                alignment,
                getHasToasts: () => untrack(getAdmitted).length > 0,
            }),
        );
    });

    const show = (toast: ToastRequest<Toast<T>>) => {
        const prev = untrack(getToasts);
        const { toasts: next, id } = ToastUtils.withRequestedToast(prev, toast);

        if (id === undefined) return undefined;

        directions.set(id, ToastUtils.readRaiserDirection());
        setToasts(next);

        return id;
    };

    const dismiss = (id: string) => {
        const prev = untrack(getToasts);
        const next = ToastUtils.withoutToast(prev, id);

        if (next === prev) return false;

        setToasts(next);

        return true;
    };

    const context: ToastsContextType<Toast<T>> = { show, dismiss };

    const handleExitEnd = (id: string) => {
        if (getAdmitted().some((toast) => toast.id === id)) return;

        directions.delete(id);
        setEntryIds((prev) => prev.filter((entryId) => entryId !== id));
        setEntryRefs((prev) => {
            if (!(id in prev)) return prev;

            const next = { ...prev };

            delete next[id];

            return next;
        });
    };

    createEffect(() => {
        const admitted = getAdmitted();

        setEntryIds((prev) => ToastUtils.computeEntryIds(prev, admitted));
    });

    createEffect<string[]>((previous) => {
        const entryIds = getEntryIds();

        ToastUtils.announceArrivals(previous, entryIds, getAdmitted());

        return entryIds;
    }, []);

    createEffect(() => {
        const trimmed = ToastUtils.computeOverflowTrim(getToasts(), access(props.limit), getOverflow());

        if (!trimmed) return;

        setToasts(trimmed);
    });

    return (
        <ToastsContextProvider value={context as ToastsContextType<Toast<unknown>>}>
            {props.children}

            <Portal
                mount={viewportContext.getPortalRef()}
                ref={(el) => {
                    el.style.display = "contents";
                }}
            >
                <div
                    ref={setRootRef}
                    class={styles.toastsRegion}
                    style={{
                        ...CSSUtils.spreadableToStyle(getMargins(), (key) => StringUtils.camelToKebabCase(key)),
                        "flex-direction": getFlexDirection(),
                        "justify-content": getStackAlignment().justifyContent,
                        "align-items": getStackAlignment().alignItems,
                        "gap": `${access(props.gap) ?? TOASTS_DEFAULTS.gap}px`,
                        "z-index": ToastUtils.Z_INDEX,
                    }}
                    dir="ltr"
                    role="region"
                    tabindex={-1}
                    aria-label={access(props.ariaLabel)}
                >
                    <For each={getEntryIds()}>
                        {(id, getIndex) => {
                            const findToast = () => getAdmitted().find((toast) => toast.id === id);
                            const getToast = createMemo((prev: Toast<T>) => findToast() ?? prev, findToast()!);
                            const renderDefault = props.renderToast;
                            const renderToast: ToastRenderer<T> | undefined =
                                getToast().renderToast ??
                                (renderDefault === undefined
                                    ? undefined
                                    : (getItemToast, getVisibilityTarget, getItemTransitionDurationMs, getState) =>
                                          renderDefault(
                                              getItemToast,
                                              getVisibilityTarget,
                                              getItemTransitionDurationMs,
                                              getState,
                                              () => dismiss(id),
                                          ));
                            const direction = directions.get(id) ?? ToastUtils.readPageDirection();

                            ToastUtils.warnIfUnpainted(renderToast !== undefined);

                            return (
                                <ToastsItem
                                    toast={getToast}
                                    index={getIndex}
                                    count={() => getEntryIds().length}
                                    isExiting={() => findToast() === undefined}
                                    isPaused={getIsPaused}
                                    transitionDurationMs={getTransitionDurationMs}
                                    sizes={getEntrySizes}
                                    swipeDirection={getSwipeDirection}
                                    direction={direction}
                                    ref={(element) => setEntryRef(id, element)}
                                    renderToast={renderToast}
                                    onElapse={() => dismiss(id)}
                                    onSwipeDismiss={() => dismiss(id)}
                                    onExitEnd={() => handleExitEnd(id)}
                                />
                            );
                        }}
                    </For>
                </div>
            </Portal>
        </ToastsContextProvider>
    );
};
