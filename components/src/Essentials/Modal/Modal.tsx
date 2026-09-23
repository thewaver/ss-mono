import { Show, createEffect, createMemo, createSignal, onCleanup } from "solid-js";
import { Portal } from "solid-js/web";

import { CSSUtils, GestureUtils, StringUtils } from "@thewaver/ss-utils";
import type { SwipeAxis, SwipeDirection } from "@thewaver/ss-utils";

import { DismisserUtils } from "../../Abstracts/Dismisser/Dismisser.utils";
import { ElementFaderUtils } from "../../Abstracts/ElementFader/ElementFader.utils";
import { FocusManagerUtils } from "../../Abstracts/FocusManager/FocusManager.utils";
import { InteractionTrackerUtils } from "../../Abstracts/InteractionTracker/InteractionTracker.utils";
import { useViewportContext } from "../../Abstracts/Viewport/Viewport.context";
import { access } from "../../Utils/propUtils";
import { MODAL_DEFAULTS } from "./Modal.const";
import type { ModalAlignment, ModalProps } from "./Modal.types";

import * as styles from "./Modal.css";

const MODAL_SWIPE_COMMIT_RATIO = 0.35;
const MODAL_SWIPE_FALLBACK_AXIS: SwipeAxis = "horizontal";
const MODAL_SWIPE_DIRECTIONS: Partial<Record<ModalAlignment, SwipeDirection>> = {
    left: "left",
    right: "right",
    top: "up",
    bottom: "down",
};
const PERCENT = 100;

export const Modal = (props: ModalProps) => {
    const viewportContext = useViewportContext();

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getContainerRef, setContainerRef] = createSignal<HTMLElement>();

    const getTransitionDurationMs = createMemo(
        () => access(props.transitionDurationMs) ?? MODAL_DEFAULTS.transitionDurationMs,
    );

    const getAlignment = createMemo(() => access(props.alignment) ?? MODAL_DEFAULTS.alignment);

    const getSwipeDirection = createMemo(() => MODAL_SWIPE_DIRECTIONS[getAlignment()]);

    const getSwipeAxis = createMemo(() => {
        const direction = getSwipeDirection();

        return direction ? GestureUtils.computeSwipeAxis(direction) : MODAL_SWIPE_FALLBACK_AXIS;
    });

    const getMargins = createMemo(() => {
        return access(props.margins) ?? CSSUtils.spreadMargin(0);
    });

    const { getIsVisible, getTransitionTarget, getHasTransitionFinished } = ElementFaderUtils.createFader(
        () => props.visibilitySignal[0](),
        { getTransitionDurationMs, getRef: getRootRef, onShow: props.onShow, onHide: props.onHide },
    );

    FocusManagerUtils.autoFocus(getContainerRef, getIsVisible, { getInitialRef: () => access(props.initialFocusRef) });

    const getIsDismissableOnOverlayClick = createMemo(
        () => access(props.isDismissableOnOverlayClick) ?? MODAL_DEFAULTS.isDismissableOnOverlayClick,
    );

    const handleDismiss = () => {
        props.visibilitySignal[1](false);
    };

    const handleOverlayClick = () => {
        if (!getIsDismissableOnOverlayClick()) return;

        handleDismiss();
    };

    const [getSwipeOffsetRatio, setSwipeOffsetRatio] = createSignal(0);

    const { getIsSwiping } = InteractionTrackerUtils.trackAxialSwipe(
        getContainerRef,
        () => getSwipeDirection() === undefined || !getIsDismissableOnOverlayClick(),
        {
            getAxis: getSwipeAxis,
            getCommitRatio: () => MODAL_SWIPE_COMMIT_RATIO,
            onSwipe: (progressRatio) => {
                const direction = getSwipeDirection();

                if (!direction) return;

                setSwipeOffsetRatio(GestureUtils.computeSwipeOffset(progressRatio, direction));
            },
            onSwipeEnd: (direction) => {
                if (direction !== undefined && direction === getSwipeDirection()) {
                    handleDismiss();

                    return;
                }

                setSwipeOffsetRatio(0);
            },
        },
    );

    const getSwipeTransform = () => {
        const direction = getSwipeDirection();
        const offsetRatio = getSwipeOffsetRatio();

        if (direction === undefined || offsetRatio === 0) return undefined;

        const distance = offsetRatio * PERCENT * (direction === "left" || direction === "up" ? -1 : 1);

        return getSwipeAxis() === "horizontal" ? `translateX(${distance}%)` : `translateY(${distance}%)`;
    };

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

    DismisserUtils.createLayer(getIsVisible, {
        getRoots: () => [getContainerRef()],
        onDismiss: (reason) => {
            if (reason !== "escape" || !(access(props.isDismissableOnEscape) ?? MODAL_DEFAULTS.isDismissableOnEscape))
                return;

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
                            "max-width": `calc(100% - ${getMargins().marginLeft + getMargins().marginRight}px)`,
                            "max-height": `calc(100% - ${getMargins().marginTop + getMargins().marginBottom}px)`,
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
