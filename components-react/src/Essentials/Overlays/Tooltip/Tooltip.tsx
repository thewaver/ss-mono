import { type CSSProperties, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { HoverIntentUtils, TOOLTIP_DEFAULTS, TooltipStyles, TooltipUtils } from "@thewaver/ss-components";
import { TooltipConst } from "@thewaver/ss-components/internal";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { AnchorReactUtils } from "../../../Abstracts/Anchor/AnchorReact.utils";
import { DismisserReactUtils } from "../../../Abstracts/Dismisser/DismisserReact.utils";
import { ElementFaderReactUtils } from "../../../Abstracts/ElementFader/ElementFaderReact.utils";
import { HoverIntentReactUtils } from "../../../Abstracts/HoverIntent/HoverIntentReact.utils";
import { useViewportContext } from "../../../Abstracts/Viewport/Viewport.context";
import { useLatest } from "../../../Utils/refUtils";
import type { TooltipProps } from "./Tooltip.types";

export const Tooltip = (props: TooltipProps) => {
    const viewportContext = useViewportContext();
    const tooltipId = useId();

    const shownState = useState(false);
    const [isShown, setIsShown] = shownState;

    const anchorRef = useLatest(props.anchorRef ?? null);
    const [isAnchorGroup] = useState(props.isAnchorGroup ?? false);
    const contentRef = useRef<HTMLDivElement | null>(null);

    const transitionDurationMs = props.transitionDurationMs ?? TOOLTIP_DEFAULTS.transitionDurationMs;

    const hoverIntent = HoverIntentReactUtils.useHoverIntent(anchorRef, shownState, {
        delayGroup: TooltipConst.TOOLTIP_DELAY_GROUP,
        panelRef: contentRef,
        hoverShowDelayMs: props.hoverShowDelayMs ?? TOOLTIP_DEFAULTS.hoverShowDelayMs,
        skipDelayWindowMs: props.skipDelayWindowMs ?? TOOLTIP_DEFAULTS.skipDelayWindowMs,
        focusShowDelayMs: props.focusShowDelayMs ?? TOOLTIP_DEFAULTS.focusShowDelayMs,
        isHiddenOnAnchorBlur: true,
        isFocusWithin: isAnchorGroup,
    });

    const fader = ElementFaderReactUtils.useFader(isShown, { transitionDurationMs, ref: contentRef });

    const { placement, position, arrowAim, zIndex, setContentRef } = AnchorReactUtils.usePortalPosition(
        anchorRef,
        fader.isVisible,
        {
            computePlacement: () => props.placement,
            offset: props.offset,
            reservedScreenSize: props.reservedScreenSize,
        },
    );

    const bridge = HoverIntentUtils.computeBridgeInsets(placement, props.offset);

    DismisserReactUtils.useLayer(isShown, {
        isPassive: true,
        getRoots: () => [props.anchorRef, contentRef.current],
        onDismiss: () => {
            hoverIntent.cancel();
            setIsShown(false);
        },
    });

    useEffect(() => {
        if (props.anchorRef) return;

        hoverIntent.cancel();
        setIsShown(false);
    }, [props.anchorRef]);

    const [isGliding, setIsGliding] = useState(false);
    const previousAnchorRef = useRef(props.anchorRef);
    const glideRef = useLatest({ isVisible: fader.isVisible, transitionDurationMs });

    useEffect(() => {
        const previous = previousAnchorRef.current;

        previousAnchorRef.current = props.anchorRef;

        if (!props.anchorRef || !previous || previous === props.anchorRef || !glideRef.current.isVisible) return;

        setIsGliding(true);

        const settle = setTimeout(() => setIsGliding(false), glideRef.current.transitionDurationMs);

        return () => clearTimeout(settle);
    }, [props.anchorRef]);

    useEffect(() => {
        if (!fader.isVisible) setIsGliding(false);
    }, [fader.isVisible]);

    useEffect(
        () => (props.anchorRef && fader.isVisible ? TooltipUtils.describe(props.anchorRef, tooltipId) : undefined),
        [props.anchorRef, fader.isVisible, tooltipId],
    );

    const [focusedControl, setFocusedControl] = useState<HTMLElement>();

    useEffect(() => {
        if (!props.anchorRef || !isAnchorGroup) return;

        const stop = TooltipUtils.followFocusWithin(props.anchorRef, setFocusedControl);

        return () => {
            stop();
            setFocusedControl(undefined);
        };
    }, [props.anchorRef, isAnchorGroup]);

    useEffect(
        () => (focusedControl && fader.isVisible ? TooltipUtils.describe(focusedControl, tooltipId) : undefined),
        [focusedControl, fader.isVisible, tooltipId],
    );

    if (!fader.isVisible) return null;

    const style: CSSProperties = {
        visibility: position ? "visible" : "hidden",
        transform: `translate(${position?.x ?? 0}px, ${position?.y ?? 0}px)`,
        transition: isGliding ? TooltipUtils.getGlideTransition(transitionDurationMs) : undefined,
        zIndex,
        pointerEvents: isShown ? "auto" : "none",
        ...(assignInlineVars({
            [TooltipStyles.bridgeTopVar]: `${-bridge.top}px`,
            [TooltipStyles.bridgeRightVar]: `${-bridge.right}px`,
            [TooltipStyles.bridgeBottomVar]: `${-bridge.bottom}px`,
            [TooltipStyles.bridgeLeftVar]: `${-bridge.left}px`,
        }) as CSSProperties),
    };

    return createPortal(
        <div
            ref={(element) => {
                contentRef.current = element;
                setContentRef(element);
            }}
            id={tooltipId}
            className={TooltipStyles.tooltipRoot}
            style={style}
            role="tooltip"
        >
            {props.renderContent(fader.transitionTarget, transitionDurationMs, placement, arrowAim)}
        </div>,
        viewportContext.getPortalRef() ?? document.body,
    );
};
