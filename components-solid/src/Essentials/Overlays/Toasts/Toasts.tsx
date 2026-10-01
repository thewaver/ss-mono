import { For, createEffect, createMemo, createSignal, onCleanup, onMount } from "solid-js";
import { Portal } from "solid-js/web";

import {
    LiveAnnouncerUtils,
    TOASTS_DEFAULTS,
    type Toast,
    type ToastState,
    ToastUtils,
    ToastsStyles as styles,
} from "@thewaver/ss-components";
import { CSSUtils, GestureUtils, StringUtils } from "@thewaver/ss-utils";

import { ElementFaderSolidUtils } from "../../../Abstracts/ElementFader/ElementFaderSolid.utils";
import { ElementObserverSolidUtils } from "../../../Abstracts/ElementObserver/ElementObserverSolid.utils";
import { InteractionTrackerSolidUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerSolid.utils";
import { useViewportContext } from "../../../Abstracts/Viewport/Viewport.context";
import { access, accessSignal } from "../../../Utils/propUtils";
import type { ToastsItemProps, ToastsProps } from "./ToastsSolid.types";

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
            ref={(element) => {
                setItemRef(element);
                props.ref(element);
            }}
        >
            {props.renderToast(
                () => access(props.toast),
                getTransitionTarget,
                () => access(props.transitionDurationMs),
                getState,
            )}
        </div>
    );
};

export const Toasts = <T,>(props: ToastsProps<T>) => {
    const toastsSignal = accessSignal(() => props.toasts);

    const viewportContext = useViewportContext();

    const [getEntryIds, setEntryIds] = createSignal<string[]>([]);
    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getEntryRefs, setEntryRefs] = createSignal<Record<string, HTMLElement>>({});

    const getTransitionDurationMs = createMemo(
        () => access(props.transitionDurationMs) ?? TOASTS_DEFAULTS.transitionDurationMs,
    );

    const getAlignment = createMemo(() => access(props.alignment) ?? TOASTS_DEFAULTS.alignment);

    const getDir = createMemo(() => access(props.dir) ?? TOASTS_DEFAULTS.dir);

    const getOverflow = createMemo(() => access(props.overflow) ?? TOASTS_DEFAULTS.overflow);

    const getMargins = createMemo(() => access(props.margins) ?? CSSUtils.spreadMargin(0));

    const getStackAlignment = createMemo(() => ToastUtils.computeStackAlignment(getAlignment(), getDir()));

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

    const getHotkey = createMemo(() => access(props.hotkey) ?? TOASTS_DEFAULTS.hotkey);

    const getAnnouncementPoliteness = createMemo(() => access(props.ariaLive) ?? TOASTS_DEFAULTS.ariaLive);

    onMount(() => {
        if (props.computeAnnouncement === undefined) return;

        LiveAnnouncerUtils.reserve("polite");
        LiveAnnouncerUtils.reserve("assertive");
    });

    const getAdmitted = createMemo(() =>
        ToastUtils.computeAdmitted(toastsSignal[0](), access(props.limit), getOverflow()),
    );

    const dismiss = (id: string) => {
        toastsSignal[1]((prev) => ToastUtils.withoutToast(prev, id));
    };

    const handleExitEnd = (id: string) => {
        if (getAdmitted().some((toast) => toast.id === id)) return;

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
        const computeAnnouncement = props.computeAnnouncement;

        if (!computeAnnouncement) return entryIds;

        ToastUtils.announceArrivals(
            previous,
            entryIds,
            getAdmitted(),
            computeAnnouncement,
            getAnnouncementPoliteness(),
        );

        return entryIds;
    }, []);

    createEffect(() => {
        const hotkey = getHotkey();
        const root = getRootRef();

        if (!root) return;

        onCleanup(ToastUtils.observeHotkey(root, hotkey));
    });

    createEffect(() => {
        const [getToasts, setToasts] = toastsSignal;
        const trimmed = ToastUtils.computeOverflowTrim(getToasts(), access(props.limit), getOverflow());

        if (!trimmed) return;

        setToasts(trimmed);
    });

    return (
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
                    "flex-direction": getDir(),
                    "justify-content": getStackAlignment().justifyContent,
                    "align-items": getStackAlignment().alignItems,
                    "gap": `${access(props.gap) ?? TOASTS_DEFAULTS.gap}px`,
                    "z-index": ToastUtils.Z_INDEX,
                }}
                role="region"
                tabindex={-1}
                aria-live={props.computeAnnouncement === undefined ? getAnnouncementPoliteness() : undefined}
                aria-label={access(props.ariaLabel)}
            >
                <For each={getEntryIds()}>
                    {(id, getIndex) => {
                        const findToast = () => getAdmitted().find((toast) => toast.id === id);
                        const getToast = createMemo((prev: Toast<T>) => findToast() ?? prev, findToast()!);

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
                                ref={(element) => setEntryRef(id, element)}
                                renderToast={props.renderToast}
                                onElapse={() => dismiss(id)}
                                onSwipeDismiss={() => dismiss(id)}
                                onExitEnd={() => handleExitEnd(id)}
                            />
                        );
                    }}
                </For>
            </div>
        </Portal>
    );
};
