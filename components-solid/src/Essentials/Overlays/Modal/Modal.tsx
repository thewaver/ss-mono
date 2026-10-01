import { Show, createEffect, createMemo, createSignal, onCleanup } from "solid-js";
import { Portal } from "solid-js/web";

import { FocusManagerUtils, MODAL_DEFAULTS, ModalUtils, ModalStyles as styles } from "@thewaver/ss-components";
import { CSSUtils, GestureUtils, StringUtils } from "@thewaver/ss-utils";

import { DismisserSolidUtils } from "../../../Abstracts/Dismisser/DismisserSolid.utils";
import { ElementFaderSolidUtils } from "../../../Abstracts/ElementFader/ElementFaderSolid.utils";
import { FocusManagerSolidUtils } from "../../../Abstracts/FocusManager/FocusManagerSolid.utils";
import { InteractionTrackerSolidUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerSolid.utils";
import { useViewportContext } from "../../../Abstracts/Viewport/Viewport.context";
import { access } from "../../../Utils/propUtils";
import type { ModalProps } from "./ModalSolid.types";

export const Modal = (props: ModalProps) => {
    const viewportContext = useViewportContext();

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getContainerRef, setContainerRef] = createSignal<HTMLElement>();

    const getTransitionDurationMs = createMemo(
        () => access(props.transitionDurationMs) ?? MODAL_DEFAULTS.transitionDurationMs,
    );

    const getAlignment = createMemo(() => access(props.alignment) ?? MODAL_DEFAULTS.alignment);

    const getSwipeDirection = createMemo(() => ModalUtils.getSwipeDirection(getAlignment()));

    const getSwipeAxis = createMemo(() => ModalUtils.getSwipeAxis(getAlignment()));

    const getMargins = createMemo(() => {
        return access(props.margins) ?? CSSUtils.spreadMargin(0);
    });

    const { getIsVisible, getTransitionTarget, getHasTransitionFinished } = ElementFaderSolidUtils.createFader(
        () => props.visibility[0](),
        { getTransitionDurationMs, getRef: getRootRef, onShow: props.onShow, onHide: props.onHide },
    );

    FocusManagerSolidUtils.autoFocus(getContainerRef, getIsVisible, {
        getInitialRef: () => access(props.initialFocusRef),
    });

    const getIsDismissableOnOverlayClick = createMemo(
        () => access(props.isDismissableOnOverlayClick) ?? MODAL_DEFAULTS.isDismissableOnOverlayClick,
    );

    const handleDismiss = () => {
        props.visibility[1](false);
    };

    const handleOverlayClick = () => {
        if (!getIsDismissableOnOverlayClick()) return;

        handleDismiss();
    };

    const [getSwipeOffsetRatio, setSwipeOffsetRatio] = createSignal(0);

    const { getIsSwiping } = InteractionTrackerSolidUtils.trackAxialSwipe(
        getContainerRef,
        () => ModalUtils.getIsSwipeDisabled(getAlignment(), getIsDismissableOnOverlayClick()),
        {
            getAxis: getSwipeAxis,
            getCommitRatio: () => ModalUtils.SWIPE_COMMIT_RATIO,
            onSwipe: (progressRatio) => {
                const direction = getSwipeDirection();

                if (!direction) return;

                setSwipeOffsetRatio(GestureUtils.computeSwipeOffset(progressRatio, direction));
            },
            onSwipeEnd: (direction) => {
                if (ModalUtils.getIsSwipeDismissal(direction, getAlignment())) {
                    handleDismiss();

                    return;
                }

                setSwipeOffsetRatio(0);
            },
        },
    );

    const getSwipeTransform = () => ModalUtils.computeSwipeTransform(getAlignment(), getSwipeOffsetRatio());

    const getMaxSize = createMemo(() => ModalUtils.computeMaxSize(getMargins()));

    createEffect(() => {
        if (getIsVisible()) return;

        setSwipeOffsetRatio(0);
    });

    createEffect(() => {
        const root = getRootRef();

        if (!getIsVisible() || !root) return;

        onCleanup(FocusManagerUtils.sealAround(root));
        onCleanup(FocusManagerUtils.lockScroll());
    });

    DismisserSolidUtils.createLayer(getIsVisible, {
        getRoots: () => [getContainerRef()],
        onDismiss: (reason) => {
            const isDismissableOnEscape = access(props.isDismissableOnEscape) ?? MODAL_DEFAULTS.isDismissableOnEscape;

            if (!ModalUtils.getIsDismissedBy(reason, isDismissableOnEscape)) return;

            handleDismiss();
        },
    });

    createEffect(() => {
        const hasTransitionFinished = getHasTransitionFinished();

        props.onTransitionStatusChange?.(hasTransitionFinished);
    });

    return (
        <Show when={getIsVisible()}>
            <Portal
                mount={viewportContext.getPortalRef()}
                ref={(el) => {
                    el.style.display = "contents";
                }}
            >
                <div
                    ref={setRootRef}
                    class={[styles.modalRoot, styles.modalAlignmentVariants[getAlignment()]].join(" ")}
                    onKeyDown={(e) => FocusManagerUtils.focusTrapKeyDown(e, getContainerRef())}
                >
                    <div class={styles.modalOverlay} onClick={handleOverlayClick}>
                        {props.renderOverlay(getTransitionTarget, getTransitionDurationMs)}
                    </div>
                    <div
                        ref={setContainerRef}
                        class={styles.modalContainer}
                        style={{
                            ...CSSUtils.spreadableToStyle(getMargins(), (key) => StringUtils.camelToKebabCase(key)),
                            "max-width": getMaxSize().maxWidth,
                            "max-height": getMaxSize().maxHeight,
                            "transform": getSwipeTransform(),
                            "transition-property": "transform",
                            "transition-duration": `${getIsSwiping() ? 0 : getTransitionDurationMs()}ms`,
                        }}
                        tabIndex={-1}
                        role={access(props.role) ?? MODAL_DEFAULTS.role}
                        aria-modal="true"
                        aria-label={access(props.ariaLabel)}
                        aria-labelledby={access(props.ariaLabelledBy)}
                        aria-describedby={access(props.ariaDescribedBy)}
                    >
                        {props.renderContent(getTransitionTarget, getTransitionDurationMs)}
                    </div>
                </div>
            </Portal>
        </Show>
    );
};
