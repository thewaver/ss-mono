import { type SlotsType, Teleport, computed, defineComponent, nextTick, shallowRef } from "vue";

import {
    type InteractionSettingsHotkeys,
    InteractionSettingsUtils,
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

import { ElementFaderVueUtils } from "../../../Abstracts/ElementFader/ElementFaderVue.utils";
import { ElementObserverVueUtils } from "../../../Abstracts/ElementObserver/ElementObserverVue.utils";
import { InteractionTrackerVueUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerVue.utils";
import { useViewportContext } from "../../../Abstracts/Viewport/Viewport.context";
import { useInteractionSettingsContext } from "../../../Primitives/InteractionSettings/InteractionSettings.context";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { declareProps, useTwoWay } from "../../../Utils/propUtils";
import { toElement } from "../../../Utils/refUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import { provideToastsContext } from "./Toasts.context";
import type { Toast, ToastRenderer, ToastsItemProps, ToastsProps, ToastsSlots } from "./Toasts.types";

const ToastsItem = defineComponent(
    <T,>(props: ToastsItemProps<T>) => {
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
                <div class={ToastsStyles.toastsItem} dir={props.direction} ref={itemRef}>
                    {props.renderToast?.({
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
        props: declareProps<ToastsItemProps<unknown>>({
            toast: null,
            index: null,
            count: null,
            isExiting: Boolean,
            isPaused: Boolean,
            transitionDurationMs: null,
            sizes: null,
            swipeDirection: null,
            direction: null,
            renderToast: null,
            onElapse: null,
            onSwipeDismiss: null,
            onExitEnd: null,
        }),
    },
);

export const Toasts = defineComponent(
    <T,>(props: ToastsProps<T>, { slots }: SlotsContext<ToastsSlots<T>>) => {
        const viewportContext = useViewportContext();

        const interactionSettings = useInteractionSettingsContext();

        const toasts = useTwoWay(props, "toasts", []);

        const registerOwner = {};

        const rootRef = shallowRef<HTMLDivElement>();
        const lastSeen = new Map<string, Toast<T>>();
        const ownPainters = new Map<string, ToastRenderer<T> | undefined>();
        const directions = new Map<string, NavigatorDirection>();

        let announcedIds: string[] = [];
        let pendingToasts: Toast<T>[] | undefined;

        const entryIds = shallowRef<string[]>([]);
        const entryRefs = shallowRef<Record<string, HTMLElement>>({});

        const getAlignment = () => props.alignment ?? TOASTS_DEFAULTS.alignment;
        const getOverflow = () => props.overflow ?? TOASTS_DEFAULTS.overflow;

        const isPaused = InteractionTrackerVueUtils.useHold(rootRef);

        const entrySizes = ElementObserverVueUtils.useBorderBoxSizes(() =>
            entryIds.value.map((id) => entryRefs.value[id]),
        );

        const admitted = computed(() => ToastUtils.computeAdmitted(toasts.value, props.limit, getOverflow()));

        watchAfterRender([], () => {
            LiveAnnouncerUtils.reserve("polite");
            LiveAnnouncerUtils.reserve("assertive");
        });

        const hotkeys = computed((previous?: InteractionSettingsHotkeys | null) => {
            const next = interactionSettings.getSettings().toastHotkeys;

            return previous !== undefined && InteractionSettingsUtils.getAreHotkeysEqual(previous, next)
                ? previous
                : next;
        });

        watchAfterRender(
            [rootRef, () => viewportContext.getPortalRef() ?? document.body, getAlignment, hotkeys],
            ([region, scope, alignment, pair]) => {
                if (!region) return;

                return ToastUtils.registerStack(registerOwner, {
                    region,
                    scope,
                    alignment,
                    hotkeys: pair,
                    getHasToasts: () => admitted.value.length > 0,
                });
            },
        );

        watchAfterRender([admitted], ([list]) => {
            entryIds.value = ToastUtils.computeEntryIds(entryIds.value, list);
        });

        watchAfterRender([entryIds], ([ids]) => {
            const previous = announcedIds;

            announcedIds = ids;

            ToastUtils.announceArrivals(previous, ids, admitted.value);
        });

        const readToasts = () => pendingToasts ?? toasts.value;

        const writeToasts = (next: Toast<T>[]) => {
            pendingToasts = next;
            toasts.value = next;

            void nextTick(() => {
                pendingToasts = undefined;
            });
        };

        watchAfterRender([toasts, () => props.limit, getOverflow], ([list, limit, overflow]) => {
            const trimmed = ToastUtils.computeOverflowTrim(list, limit, overflow);

            if (trimmed) writeToasts(trimmed);
        });

        const show = (toast: ToastRequest<Toast<T>>) => {
            const prev = readToasts();
            const { toasts: next, id } = ToastUtils.withRequestedToast(prev, toast);

            if (id === undefined) return undefined;

            directions.set(id, ToastUtils.readRaiserDirection());
            writeToasts(next);

            return id;
        };

        const dismiss = (id: string) => {
            const prev = readToasts();
            const next = ToastUtils.withoutToast(prev, id);

            if (next === prev) return false;

            writeToasts(next);

            return true;
        };

        const context: ToastsContextType<Toast<T>> = { show, dismiss };

        provideToastsContext(context as ToastsContextType<Toast<unknown>>);

        const handleExitEnd = (id: string) => {
            if (admitted.value.some((toast) => toast.id === id)) return;

            lastSeen.delete(id);
            ownPainters.delete(id);
            directions.delete(id);
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

        const resolvePainter = (id: string, toast: Toast<T>): ToastRenderer<T> | undefined => {
            if (!ownPainters.has(id)) {
                ownPainters.set(id, toast.renderToast);
                ToastUtils.warnIfUnpainted(toast.renderToast !== undefined || slots.renderToast !== undefined);
            }

            const ownPainter = ownPainters.get(id);

            if (ownPainter) return ownPainter;

            const renderDefault = slots.renderToast;

            return renderDefault === undefined
                ? undefined
                : (renderProps) => renderDefault({ ...renderProps, dismiss: () => dismiss(id) });
        };

        return () => {
            const alignment = getAlignment();
            const flexDirection = props.flexDirection ?? TOASTS_DEFAULTS.flexDirection;
            const margins = props.margins ?? ToastsConst.DEFAULT_MARGINS;
            const transitionDurationMs = props.transitionDurationMs ?? TOASTS_DEFAULTS.transitionDurationMs;
            const stackAlignment = ToastUtils.computeStackAlignment(alignment, flexDirection);
            const swipeDirection =
                (props.isDismissableOnSwipe ?? TOASTS_DEFAULTS.isDismissableOnSwipe)
                    ? ToastUtils.computeSwipeDirection(alignment)
                    : undefined;
            const admittedToasts = admitted.value;
            const ids = entryIds.value;

            for (const toast of admittedToasts) lastSeen.set(toast.id, toast);

            return (
                <>
                    {slots.default?.()}

                    <Teleport to={viewportContext.getPortalRef() ?? document.body}>
                        <div
                            ref={rootRef}
                            class={ToastsStyles.toastsRegion}
                            style={{
                                ...CSSUtils.spreadableToStyle(margins, (key) => key),
                                flexDirection,
                                justifyContent: stackAlignment.justifyContent,
                                alignItems: stackAlignment.alignItems,
                                gap: `${props.gap ?? TOASTS_DEFAULTS.gap}px`,
                                zIndex: ToastUtils.Z_INDEX,
                            }}
                            dir="ltr"
                            role="region"
                            tabindex={-1}
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
                                        direction={directions.get(id) ?? ToastUtils.readPageDirection()}
                                        renderToast={resolvePainter(id, toast)}
                                        onElapse={() => dismiss(id)}
                                        onSwipeDismiss={() => dismiss(id)}
                                        onExitEnd={() => handleExitEnd(id)}
                                    />
                                );
                            })}
                        </div>
                    </Teleport>
                </>
            );
        };
    },
    {
        name: "Toasts",
        inheritAttrs: false,
        slots: Object as SlotsType<ToastsSlots<any>>,
        props: declareProps<ToastsProps<unknown>>({
            "ariaLabel": null,
            "alignment": null,
            "flexDirection": null,
            "gap": null,
            "margins": null,
            "overflow": null,
            "transitionDurationMs": null,
            "isDismissableOnSwipe": Boolean,
            "limit": null,
            "toasts": null,
            "onUpdate:toasts": null,
        }),
    },
);
