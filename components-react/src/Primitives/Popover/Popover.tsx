import { useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";

import { POPOVER_DEFAULTS, PopoverStyles, PopoverUtils } from "@thewaver/ss-components";

import { AnchorReactUtils } from "../../Abstracts/Anchor/AnchorReact.utils";
import { DismisserReactUtils } from "../../Abstracts/Dismisser/DismisserReact.utils";
import { ElementFaderReactUtils } from "../../Abstracts/ElementFader/ElementFaderReact.utils";
import { FocusManagerReactUtils } from "../../Abstracts/FocusManager/FocusManagerReact.utils";
import { useViewportContext } from "../../Abstracts/Viewport/Viewport.context";
import { useLatest } from "../../Utils/refUtils";
import type { PopoverProps } from "./Popover.types";

export const Popover = (props: PopoverProps) => {
    const viewportContext = useViewportContext();

    const rootRef = useRef<HTMLDivElement | null>(null);
    const anchorRef = useLatest(props.anchorRef ?? null);
    const latest = useLatest(props);
    const hasSeenAnchorRef = useRef(false);

    const transitionDurationMs = props.transitionDurationMs ?? POPOVER_DEFAULTS.transitionDurationMs;
    const isPinned = props.isPinned === true;

    const fader = ElementFaderReactUtils.useFader(props.isOpen, { transitionDurationMs, ref: rootRef });

    const { anchorRect, isAnchorOnScreen, placement, position, zIndex, setContentRef } =
        AnchorReactUtils.usePortalPosition(anchorRef, fader.isVisible, {
            placement: props.placement ?? POPOVER_DEFAULTS.placement,
            offset: props.offset,
            reservedScreenSize: props.reservedScreenSize,
            isPinned,
            anchorRect: props.anchorRect,
        });

    const anchorColor = useMemo(
        () => (props.anchorRef && fader.isVisible ? getComputedStyle(props.anchorRef).color : undefined),
        [props.anchorRef, fader.isVisible],
    );

    const hasFocus = (props.hasAutoFocus ?? false) && props.isOpen && position !== undefined;

    FocusManagerReactUtils.useAutoFocus(rootRef, hasFocus, { initialRef: rootRef });

    useEffect(() => {
        const presence = PopoverUtils.computeAnchorPresence(
            hasSeenAnchorRef.current,
            props.isOpen,
            isPinned,
            isAnchorOnScreen,
        );

        hasSeenAnchorRef.current = presence.hasSeenAnchor;

        if (presence.isGone) latest.current.onDismiss?.("anchorGone");
    }, [props.isOpen, isPinned, isAnchorOnScreen, latest]);

    DismisserReactUtils.useLayer(props.isOpen, {
        getRoots: () => [rootRef.current, props.anchorRect === undefined ? props.anchorRef : undefined],
        onDismiss: (reason) => props.onDismiss?.(reason),
    });

    useEffect(() => {
        latest.current.onTransitionStatusChange?.(fader.hasTransitionFinished);
    }, [fader.hasTransitionFinished, latest]);

    if (!fader.isVisible) return null;

    const className = [
        PopoverStyles.popoverRoot,
        props.isTransparentToPointer === true && PopoverStyles.popoverTransparent,
    ]
        .filter(Boolean)
        .join(" ");

    const contentClassName = [
        PopoverStyles.popoverContent,
        props.isCovered === true && PopoverStyles.popoverContentCovered,
    ]
        .filter(Boolean)
        .join(" ");

    return createPortal(
        <div
            ref={(element) => {
                rootRef.current = element;
                setContentRef(element);
            }}
            id={props.id}
            className={className}
            style={{
                visibility: position ? "visible" : "hidden",
                transform: `translate(${position?.x ?? 0}px, ${position?.y ?? 0}px)`,
                minWidth: props.hasAnchorMinWidth ? `${anchorRect?.width ?? 0}px` : undefined,
                color: anchorColor,
                zIndex,
            }}
            tabIndex={-1}
            inert={!props.isOpen}
            role={props.role}
            {...props.ariaAttributes}
            onKeyDown={(e) => props.onKeyDown?.(e)}
            onBlur={(e) => {
                if (e.target !== e.currentTarget) return;

                props.onBlur?.(e);
            }}
            onMouseDown={(e) => {
                if (!PopoverUtils.getIsFocusKeptOnPress(props.role)) return;

                e.preventDefault();
            }}
        >
            <div className={contentClassName}>
                {props.renderContent(fader.transitionTarget, transitionDurationMs, placement)}
            </div>
        </div>,
        viewportContext.getPortalRef() ?? document.body,
    );
};
