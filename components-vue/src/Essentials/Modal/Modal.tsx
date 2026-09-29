import { type SlotsType, Teleport, defineComponent, shallowRef } from "vue";

import { FocusManagerUtils, MODAL_DEFAULTS, ModalStyles, ModalUtils } from "@thewaver/ss-components";
import { CSSUtils, GestureUtils } from "@thewaver/ss-utils";

import { DismisserVueUtils } from "../../Abstracts/Dismisser/DismisserVue.utils";
import { ElementFaderVueUtils } from "../../Abstracts/ElementFader/ElementFaderVue.utils";
import { FocusManagerVueUtils } from "../../Abstracts/FocusManager/FocusManagerVue.utils";
import { InteractionTrackerVueUtils } from "../../Abstracts/InteractionTracker/InteractionTrackerVue.utils";
import { useViewportContext } from "../../Abstracts/Viewport/Viewport.context";
import { watchAfterRender } from "../../Utils/effectUtils";
import { callSlot, declareProps, useTwoWay } from "../../Utils/propUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type { ModalProps, ModalSlots } from "./Modal.types";

const DEFAULT_MARGINS = CSSUtils.spreadMargin(0);

export const Modal = defineComponent(
    (props: ModalProps, { slots }: SlotsContext<ModalSlots>) => {
        const viewportContext = useViewportContext();

        const rootRef = shallowRef<HTMLDivElement>();
        const containerRef = shallowRef<HTMLDivElement>();
        const swipeOffsetRatio = shallowRef(0);

        const isOpen = useTwoWay(props, "visibility", false);

        const getTransitionDurationMs = () => props.transitionDurationMs ?? MODAL_DEFAULTS.transitionDurationMs;
        const getAlignment = () => props.alignment ?? MODAL_DEFAULTS.alignment;
        const getIsDismissableOnOverlayClick = () =>
            props.isDismissableOnOverlayClick ?? MODAL_DEFAULTS.isDismissableOnOverlayClick;

        const fader = ElementFaderVueUtils.useFader(isOpen, {
            transitionDurationMs: getTransitionDurationMs,
            ref: rootRef,
            onShow: () => props.onShow?.(),
            onHide: () => props.onHide?.(),
        });

        watchAfterRender([fader.isVisible, rootRef], ([isVisible, root]) => {
            if (!isVisible || !root) return;

            const unseal = FocusManagerUtils.sealAround(root);
            const unlock = FocusManagerUtils.lockScroll();

            return () => {
                unlock();
                unseal();
            };
        });

        FocusManagerVueUtils.useAutoFocus(containerRef, fader.isVisible, { initialRef: () => props.initialFocusRef });

        const handleDismiss = () => {
            isOpen.value = false;
        };

        const handleOverlayClick = () => {
            if (!getIsDismissableOnOverlayClick()) return;

            handleDismiss();
        };

        const { isSwiping } = InteractionTrackerVueUtils.useAxialSwipe(
            containerRef,
            () => ModalUtils.getIsSwipeDisabled(getAlignment(), getIsDismissableOnOverlayClick()),
            {
                axis: () => ModalUtils.getSwipeAxis(getAlignment()),
                commitRatio: ModalUtils.SWIPE_COMMIT_RATIO,
                onSwipe: (progressRatio) => {
                    const direction = ModalUtils.getSwipeDirection(getAlignment());

                    if (!direction) return;

                    swipeOffsetRatio.value = GestureUtils.computeSwipeOffset(progressRatio, direction);
                },
                onSwipeEnd: (direction) => {
                    if (ModalUtils.getIsSwipeDismissal(direction, getAlignment())) {
                        handleDismiss();

                        return;
                    }

                    swipeOffsetRatio.value = 0;
                },
            },
        );

        watchAfterRender([fader.isVisible], ([isVisible]) => {
            if (isVisible) return;

            swipeOffsetRatio.value = 0;
        });

        DismisserVueUtils.useLayer(fader.isVisible, {
            getRoots: () => [containerRef.value],
            onDismiss: (reason) => {
                const isDismissableOnEscape = props.isDismissableOnEscape ?? MODAL_DEFAULTS.isDismissableOnEscape;

                if (!ModalUtils.getIsDismissedBy(reason, isDismissableOnEscape)) return;

                handleDismiss();
            },
        });

        watchAfterRender([fader.hasTransitionFinished], ([hasTransitionFinished]) => {
            props.onTransitionStatusChange?.(hasTransitionFinished);
        });

        return () => {
            if (!fader.isVisible.value) return null;

            const transitionDurationMs = getTransitionDurationMs();
            const alignment = getAlignment();
            const margins = props.margins ?? DEFAULT_MARGINS;
            const maxSize = ModalUtils.computeMaxSize(margins);
            const visibilityTarget = fader.transitionTarget.value;

            return (
                <Teleport to={viewportContext.getPortalRef() ?? document.body}>
                    <div
                        ref={rootRef}
                        class={[ModalStyles.modalRoot, ModalStyles.modalAlignmentVariants[alignment]]}
                        onKeydown={(e) =>
                            FocusManagerUtils.focusTrapKeyDown(
                                e as Parameters<typeof FocusManagerUtils.focusTrapKeyDown>[0],
                                containerRef.value,
                            )
                        }
                    >
                        <div class={ModalStyles.modalOverlay} onClick={handleOverlayClick}>
                            {callSlot(slots.renderOverlay, { visibilityTarget, transitionDurationMs })}
                        </div>
                        <div
                            ref={containerRef}
                            class={ModalStyles.modalContainer}
                            style={{
                                ...CSSUtils.spreadableToStyle(margins, (key) => key),
                                maxWidth: maxSize.maxWidth,
                                maxHeight: maxSize.maxHeight,
                                transform: ModalUtils.computeSwipeTransform(alignment, swipeOffsetRatio.value),
                                transitionProperty: "transform",
                                transitionDuration: `${isSwiping.value ? 0 : transitionDurationMs}ms`,
                            }}
                            tabindex={-1}
                            role={props.role ?? MODAL_DEFAULTS.role}
                            aria-modal="true"
                            aria-label={props.ariaLabel}
                            aria-labelledby={props.ariaLabelledBy}
                            aria-describedby={props.ariaDescribedBy}
                        >
                            {callSlot(slots.renderContent, { visibilityTarget, transitionDurationMs })}
                        </div>
                    </div>
                </Teleport>
            );
        };
    },
    {
        name: "Modal",
        inheritAttrs: false,
        slots: Object as SlotsType<ModalSlots>,
        props: declareProps<ModalProps>({
            "ariaLabel": null,
            "ariaLabelledBy": null,
            "ariaDescribedBy": null,
            "role": null,
            "alignment": null,
            "isDismissableOnOverlayClick": Boolean,
            "isDismissableOnEscape": Boolean,
            "visibility": Boolean,
            "onUpdate:visibility": null,
            "transitionDurationMs": null,
            "margins": null,
            "initialFocusRef": null,
            "onShow": null,
            "onHide": null,
            "onTransitionStatusChange": null,
        }),
    },
);
