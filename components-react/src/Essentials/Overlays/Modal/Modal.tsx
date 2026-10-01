import { type CSSProperties, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { FocusManagerUtils, MODAL_DEFAULTS, ModalStyles, ModalUtils } from "@thewaver/ss-components";
import { CSSUtils, GestureUtils } from "@thewaver/ss-utils";

import { DismisserReactUtils } from "../../../Abstracts/Dismisser/DismisserReact.utils";
import { ElementFaderReactUtils } from "../../../Abstracts/ElementFader/ElementFaderReact.utils";
import { FocusManagerReactUtils } from "../../../Abstracts/FocusManager/FocusManagerReact.utils";
import { InteractionTrackerReactUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerReact.utils";
import { useViewportContext } from "../../../Abstracts/Viewport/Viewport.context";
import { useElement, useLatest } from "../../../Utils/refUtils";
import type { ModalProps } from "./Modal.types";

const DEFAULT_MARGINS = CSSUtils.spreadMargin(0);

export const Modal = (props: ModalProps) => {
    const viewportContext = useViewportContext();

    const rootRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const root = useElement(rootRef);
    const initialFocusRef = useLatest(props.initialFocusRef ?? null);
    const latest = useLatest(props);

    const [isOpen, setIsOpen] = props.visibility;

    const transitionDurationMs = props.transitionDurationMs ?? MODAL_DEFAULTS.transitionDurationMs;
    const alignment = props.alignment ?? MODAL_DEFAULTS.alignment;
    const margins = props.margins ?? DEFAULT_MARGINS;
    const isDismissableOnOverlayClick = props.isDismissableOnOverlayClick ?? MODAL_DEFAULTS.isDismissableOnOverlayClick;

    const fader = ElementFaderReactUtils.useFader(isOpen, {
        transitionDurationMs,
        ref: rootRef,
        onShow: props.onShow,
        onHide: props.onHide,
    });

    useEffect(() => {
        if (!fader.isVisible || !root) return;

        const unseal = FocusManagerUtils.sealAround(root);
        const unlock = FocusManagerUtils.lockScroll();

        return () => {
            unlock();
            unseal();
        };
    }, [fader.isVisible, root]);

    FocusManagerReactUtils.useAutoFocus(containerRef, fader.isVisible, { initialRef: initialFocusRef });

    const handleDismiss = () => {
        setIsOpen(false);
    };

    const handleOverlayClick = () => {
        if (!isDismissableOnOverlayClick) return;

        handleDismiss();
    };

    const [swipeOffsetRatio, setSwipeOffsetRatio] = useState(0);

    const { isSwiping } = InteractionTrackerReactUtils.useAxialSwipe(
        containerRef,
        ModalUtils.getIsSwipeDisabled(alignment, isDismissableOnOverlayClick),
        {
            axis: ModalUtils.getSwipeAxis(alignment),
            commitRatio: ModalUtils.SWIPE_COMMIT_RATIO,
            onSwipe: (progressRatio) => {
                const direction = ModalUtils.getSwipeDirection(alignment);

                if (!direction) return;

                setSwipeOffsetRatio(GestureUtils.computeSwipeOffset(progressRatio, direction));
            },
            onSwipeEnd: (direction) => {
                if (ModalUtils.getIsSwipeDismissal(direction, alignment)) {
                    handleDismiss();

                    return;
                }

                setSwipeOffsetRatio(0);
            },
        },
    );

    useEffect(() => {
        if (fader.isVisible) return;

        setSwipeOffsetRatio(0);
    }, [fader.isVisible]);

    DismisserReactUtils.useLayer(fader.isVisible, {
        getRoots: () => [containerRef.current],
        onDismiss: (reason) => {
            const isDismissableOnEscape = props.isDismissableOnEscape ?? MODAL_DEFAULTS.isDismissableOnEscape;

            if (!ModalUtils.getIsDismissedBy(reason, isDismissableOnEscape)) return;

            handleDismiss();
        },
    });

    useEffect(() => {
        latest.current.onTransitionStatusChange?.(fader.hasTransitionFinished);
    }, [fader.hasTransitionFinished, latest]);

    if (!fader.isVisible) return null;

    const maxSize = ModalUtils.computeMaxSize(margins);

    const containerStyle: CSSProperties = {
        ...CSSUtils.spreadableToStyle(margins, (key) => key),
        maxWidth: maxSize.maxWidth,
        maxHeight: maxSize.maxHeight,
        transform: ModalUtils.computeSwipeTransform(alignment, swipeOffsetRatio),
        transitionProperty: "transform",
        transitionDuration: `${isSwiping ? 0 : transitionDurationMs}ms`,
    };

    return createPortal(
        <div
            ref={rootRef}
            className={[ModalStyles.modalRoot, ModalStyles.modalAlignmentVariants[alignment]].join(" ")}
            onKeyDown={(e) =>
                FocusManagerUtils.focusTrapKeyDown(
                    e.nativeEvent as Parameters<typeof FocusManagerUtils.focusTrapKeyDown>[0],
                    containerRef.current ?? undefined,
                )
            }
        >
            <div className={ModalStyles.modalOverlay} onClick={handleOverlayClick}>
                {props.renderOverlay(fader.transitionTarget, transitionDurationMs)}
            </div>
            <div
                ref={containerRef}
                className={ModalStyles.modalContainer}
                style={containerStyle}
                tabIndex={-1}
                role={props.role ?? MODAL_DEFAULTS.role}
                aria-modal="true"
                aria-label={props.ariaLabel}
                aria-labelledby={props.ariaLabelledBy}
                aria-describedby={props.ariaDescribedBy}
            >
                {props.renderContent(fader.transitionTarget, transitionDurationMs)}
            </div>
        </div>,
        viewportContext.getPortalRef() ?? document.body,
    );
};
