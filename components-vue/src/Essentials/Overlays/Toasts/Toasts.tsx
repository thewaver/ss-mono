import { type SlotsType, Teleport, computed, defineComponent, shallowRef } from "vue";

import {
    LiveAnnouncerUtils,
    TOASTS_DEFAULTS,
    type Toast,
    type ToastState,
    ToastUtils,
    ToastsStyles,
} from "@thewaver/ss-components";
import { CSSUtils, GestureUtils } from "@thewaver/ss-utils";

import { ElementFaderVueUtils } from "../../../Abstracts/ElementFader/ElementFaderVue.utils";
import { ElementObserverVueUtils } from "../../../Abstracts/ElementObserver/ElementObserverVue.utils";
import { InteractionTrackerVueUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerVue.utils";
import { useViewportContext } from "../../../Abstracts/Viewport/Viewport.context";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { callSlot, declareProps, useTwoWay } from "../../../Utils/propUtils";
import { toElement } from "../../../Utils/refUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { ToastsItemProps, ToastsProps, ToastsSlots } from "./Toasts.types";

const DEFAULT_MARGINS = CSSUtils.spreadMargin(0);

const ToastsItem = defineComponent(
    <T,>(props: ToastsItemProps<T>, { slots }: SlotsContext<ToastsSlots<T>>) => {
        const itemRef = shallowRef<HTMLDivElement>();
        const swipeOffsetRatio = shallowRef(0);

        let isLeaving = false;

        const fader = ElementFaderVueUtils.useFader(() => !props.isExiting, {
            transitionDurationMs: () => props.transitionDurationMs,
            ref: itemRef,
            onShow: () => props.toast.onShow?.(),
            onHide: () => props.toast.onHide?.(),
        });

        const { isSwiping } = InteractionTrackerVueUtils.useAxialSwipe(
            itemRef,
            () => props.swipeDirection === undefined || props.isExiting,
            {
                axis: () => ToastUtils.computeSwipeAxis(props.swipeDirection),
                commitRatio: ToastUtils.SWIPE_COMMIT_RATIO,
                onSwipe: (progressRatio) => {
                    if (!props.swipeDirection) return;

                    swipeOffsetRatio.value = GestureUtils.computeSwipeOffset(progressRatio, props.swipeDirection);
                },
                onSwipeEnd: (direction) => {
                    if (direction !== undefined && direction === props.swipeDirection) {
                        props.onSwipeDismiss();

                        return;
                    }

                    swipeOffsetRatio.value = 0;
                },
            },
        );

        const isPaused = computed(() => props.isPaused || isSwiping.value);

        const countdown = ToastUtils.createCountdown();

        watchAfterRender([() => props.toast.durationMs, isPaused], ([durationMs, isHeld]) => {
            if (durationMs === undefined) return;

            return countdown.run(durationMs, isHeld, () => props.onElapse());
        });

        watchAfterRender([() => props.isExiting, fader.hasTransitionFinished], ([isExiting, hasTransitionFinished]) => {
            if (!isExiting) {
                isLeaving = false;

                return;
            }

            if (!hasTransitionFinished) {
                isLeaving = true;

                return;
            }

            if (isLeaving) props.onExitEnd();
        });

        return () => {
            const state: ToastState = {
                index: props.index,
                count: props.count,
                isPaused: isPaused.value,
                sizes: props.sizes,
                swipeDirection: props.swipeDirection,
                swipeOffsetRatio: swipeOffsetRatio.value,
                isSwiping: isSwiping.value,
            };

            return (
                <div class={ToastsStyles.toastsItem} ref={itemRef}>
                    {callSlot(slots.renderToast, {
                        toast: props.toast,
                        visibilityTarget: fader.transitionTarget.value,
                        transitionDurationMs: props.transitionDurationMs,
                        state,
                    })}
                </div>
            );
        };
    },
    {
        name: "ToastsItem",
        slots: Object as SlotsType<ToastsSlots<any>>,
        props: declareProps<ToastsItemProps<unknown>>({
            toast: null,
            index: null,
            count: null,
            isExiting: Boolean,
            isPaused: Boolean,
            transitionDurationMs: null,
            sizes: null,
            swipeDirection: null,
            onElapse: null,
            onSwipeDismiss: null,
            onExitEnd: null,
        }),
    },
);

export const Toasts = defineComponent(
    <T,>(props: ToastsProps<T>, { slots }: SlotsContext<ToastsSlots<T>>) => {
        const viewportContext = useViewportContext();

        const toasts = useTwoWay(props, "toasts", []);

        const rootRef = shallowRef<HTMLDivElement>();
        const lastSeen = new Map<string, Toast<T>>();

        let announcedIds: string[] = [];

        const entryIds = shallowRef<string[]>([]);
        const entryRefs = shallowRef<Record<string, HTMLElement>>({});

        const getOverflow = () => props.overflow ?? TOASTS_DEFAULTS.overflow;
        const getPoliteness = () => props.ariaLive ?? TOASTS_DEFAULTS.ariaLive;
        const getHasAnnouncer = () => props.computeAnnouncement !== undefined;

        const isPaused = InteractionTrackerVueUtils.useHold(rootRef);

        const entrySizes = ElementObserverVueUtils.useBorderBoxSizes(() =>
            entryIds.value.map((id) => entryRefs.value[id]),
        );

        const admitted = computed(() => ToastUtils.computeAdmitted(toasts.value, props.limit, getOverflow()));

        watchAfterRender([getHasAnnouncer], ([hasAnnouncer]) => {
            if (!hasAnnouncer) return;

            LiveAnnouncerUtils.reserve("polite");
            LiveAnnouncerUtils.reserve("assertive");
        });

        watchAfterRender([admitted], ([list]) => {
            entryIds.value = ToastUtils.computeEntryIds(entryIds.value, list);
        });

        watchAfterRender([entryIds], ([ids]) => {
            const previous = announcedIds;
            const computeAnnouncement = props.computeAnnouncement;

            announcedIds = ids;

            if (!computeAnnouncement) return;

            ToastUtils.announceArrivals(previous, ids, admitted.value, computeAnnouncement, getPoliteness());
        });

        watchAfterRender([rootRef, () => props.hotkey ?? TOASTS_DEFAULTS.hotkey], ([root, hotkey]) =>
            root ? ToastUtils.observeHotkey(root, hotkey) : undefined,
        );

        watchAfterRender([toasts, () => props.limit, getOverflow], ([list, limit, overflow]) => {
            const trimmed = ToastUtils.computeOverflowTrim(list, limit, overflow);

            if (trimmed) toasts.value = trimmed;
        });

        const dismiss = (id: string) => {
            const current = toasts.value;
            const next = ToastUtils.withoutToast(current, id);

            if (next !== current) toasts.value = next;
        };

        const handleExitEnd = (id: string) => {
            if (admitted.value.some((toast) => toast.id === id)) return;

            lastSeen.delete(id);
            entryIds.value = entryIds.value.filter((entryId) => entryId !== id);

            if (!(id in entryRefs.value)) return;

            const next = { ...entryRefs.value };

            delete next[id];

            entryRefs.value = next;
        };

        const setEntryRef = (id: string, element: HTMLElement | undefined) => {
            if (!element || entryRefs.value[id] === element) return;

            entryRefs.value = { ...entryRefs.value, [id]: element };
        };

        return () => {
            const alignment = props.alignment ?? TOASTS_DEFAULTS.alignment;
            const dir = props.dir ?? TOASTS_DEFAULTS.dir;
            const margins = props.margins ?? DEFAULT_MARGINS;
            const transitionDurationMs = props.transitionDurationMs ?? TOASTS_DEFAULTS.transitionDurationMs;
            const stackAlignment = ToastUtils.computeStackAlignment(alignment, dir);
            const swipeDirection =
                (props.isDismissableOnSwipe ?? TOASTS_DEFAULTS.isDismissableOnSwipe)
                    ? ToastUtils.computeSwipeDirection(alignment)
                    : undefined;
            const admittedToasts = admitted.value;
            const ids = entryIds.value;

            for (const toast of admittedToasts) lastSeen.set(toast.id, toast);

            return (
                <Teleport to={viewportContext.getPortalRef() ?? document.body}>
                    <div
                        ref={rootRef}
                        class={ToastsStyles.toastsRegion}
                        style={{
                            ...CSSUtils.spreadableToStyle(margins, (key) => key),
                            flexDirection: dir,
                            justifyContent: stackAlignment.justifyContent,
                            alignItems: stackAlignment.alignItems,
                            gap: `${props.gap ?? TOASTS_DEFAULTS.gap}px`,
                            zIndex: ToastUtils.Z_INDEX,
                        }}
                        role="region"
                        tabindex={-1}
                        aria-live={getHasAnnouncer() ? undefined : getPoliteness()}
                        aria-label={props.ariaLabel}
                    >
                        {ids.map((id, index) => {
                            const toast = admittedToasts.find((entry) => entry.id === id) ?? lastSeen.get(id);

                            if (!toast) return null;

                            return (
                                <ToastsItem
                                    key={id}
                                    ref={(target) => setEntryRef(id, toElement(target))}
                                    toast={toast}
                                    index={index}
                                    count={ids.length}
                                    isExiting={!admittedToasts.some((entry) => entry.id === id)}
                                    isPaused={isPaused.value}
                                    transitionDurationMs={transitionDurationMs}
                                    sizes={entrySizes.value}
                                    swipeDirection={swipeDirection}
                                    onElapse={() => dismiss(id)}
                                    onSwipeDismiss={() => dismiss(id)}
                                    onExitEnd={() => handleExitEnd(id)}
                                >
                                    {{ renderToast: slots.renderToast }}
                                </ToastsItem>
                            );
                        })}
                    </div>
                </Teleport>
            );
        };
    },
    {
        name: "Toasts",
        inheritAttrs: false,
        slots: Object as SlotsType<ToastsSlots<any>>,
        props: declareProps<ToastsProps<unknown>>({
            "ariaLabel": null,
            "ariaLive": null,
            "hotkey": null,
            "alignment": null,
            "dir": null,
            "gap": null,
            "margins": null,
            "overflow": null,
            "transitionDurationMs": null,
            "isDismissableOnSwipe": Boolean,
            "limit": null,
            "toasts": null,
            "onUpdate:toasts": null,
            "computeAnnouncement": null,
        }),
    },
);
