import { Show, createEffect, createMemo, createSignal } from "solid-js";
import { Portal } from "solid-js/web";

import { CSSUtils, GestureUtils, StringUtils } from "@thewaver/ss-utils";
import type { SwipeAxis, SwipeDirection } from "@thewaver/ss-utils";

import { DismisserStack } from "../../Abstracts/Dismisser/DismisserStack";
import { ElementFader } from "../../Abstracts/ElementFader/ElementFader";
import { FocusManager } from "../../Abstracts/FocusManager/FocusManager";
import { InteractionTracker } from "../../Abstracts/InteractionTracker/InteractionTracker";
import { useViewportContext } from "../../Exotics/Viewport/Viewport.context";
import { access } from "../../Utils/propUtils";
import type { ModalAlignment, ModalProps, ModalRole } from "./Modal.types";

import * as styles from "./Modal.css";

const DEFAULT_MODAL_TRANSITION_DURATION_MS = 200;
const DEFAULT_MODAL_ROLE: ModalRole = "dialog";
const DEFAULT_MODAL_ALIGNMENT: ModalAlignment = "center";

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

    const [getContainerRef, setContainerRef] = createSignal<HTMLElement>();

    const getTransitionDurationMs = createMemo(
        () => access(props.transitionDurationMs) ?? DEFAULT_MODAL_TRANSITION_DURATION_MS,
    );

    const getAlignment = createMemo(() => access(props.alignment) ?? DEFAULT_MODAL_ALIGNMENT);

    const getSwipeDirection = createMemo(() => MODAL_SWIPE_DIRECTIONS[getAlignment()]);

    const getSwipeAxis = createMemo(() => {
        const direction = getSwipeDirection();

        return direction ? GestureUtils.computeSwipeAxis(direction) : MODAL_SWIPE_FALLBACK_AXIS;
    });

    const getMargins = createMemo(() => {
        return access(props.margins) ?? CSSUtils.spreadMargin(0);
    });

    const { getIsVisible, getTransitionTarget, getHasTransitionFinished } = ElementFader.createFader(
        () => props.visibilitySignal[0](),
        { getTransitionDurationMs, onShow: props.onShow, onHide: props.onHide },
    );

    FocusManager.autoFocus(getContainerRef, getIsVisible, { getInitialRef: () => access(props.initialFocusRef) });

    const handleDismiss = () => {
        props.visibilitySignal[1](false);
    };

    const handleOverlayClick = () => {
        if (access(props.isDismissableOnOverlayClick) === false) return;

        handleDismiss();
    };

    const [getSwipeOffsetRatio, setSwipeOffsetRatio] = createSignal(0);

    const { getIsSwiping } = InteractionTracker.trackSwipe(
        getContainerRef,
        () => getSwipeDirection() === undefined || access(props.isDismissableOnOverlayClick) === false,
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

    DismisserStack.createLayer(getIsVisible, {
        getRoots: () => [getContainerRef()],
        onDismiss: (reason) => {
            if (reason !== "escape") return;

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
                    class={[styles.modalRoot, styles.modalAlignmentVariants[getAlignment()]].join(" ")}
                    onKeyDown={(e) => FocusManager.focusTrapKeyDown(e, getContainerRef())}
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
                        role={access(props.role) ?? DEFAULT_MODAL_ROLE}
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
