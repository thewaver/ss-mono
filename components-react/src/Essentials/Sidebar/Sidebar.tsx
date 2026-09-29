import { useEffect, useRef, useState } from "react";

import { AnchorUtils, HoverIntentUtils, SIDEBAR_DEFAULTS, SidebarStyles, SidebarUtils } from "@thewaver/ss-components";

import { DismisserReactUtils } from "../../Abstracts/Dismisser/DismisserReact.utils";
import { ElementFaderReactUtils } from "../../Abstracts/ElementFader/ElementFaderReact.utils";
import { ElevationReactUtils } from "../../Abstracts/Elevation/ElevationReact.utils";
import { HoverIntentReactUtils } from "../../Abstracts/HoverIntent/HoverIntentReact.utils";
import { useElement, useLatest } from "../../Utils/refUtils";
import type { SidebarProps } from "./Sidebar.types";

const NO_SKIP_WINDOW_MS = 0;

export const Sidebar = (props: SidebarProps) => {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const panelRef = useRef<HTMLDivElement | null>(null);
    const noPanelRef = useRef<HTMLElement | null>(null);
    const root = useElement(rootRef);

    const isOwnerExpanded = props.expanded?.[0] ?? false;

    const peekingState = useState(false);
    const [isPeeking, setIsPeeking] = peekingState;
    const [isWaitingOnPopup, setIsWaitingOnPopup] = useState(false);

    const edge = props.edge ?? SIDEBAR_DEFAULTS.edge;
    const isOverlay = (props.layout ?? SIDEBAR_DEFAULTS.layout) === "overlay";
    const transitionDurationMs = props.transitionDurationMs ?? SIDEBAR_DEFAULTS.transitionDurationMs;

    const isExpanded = isOwnerExpanded || isPeeking || isWaitingOnPopup;

    const [isArriving, setIsArriving] = useState(isExpanded);

    const appliedDurationMs = isArriving ? 0 : transitionDurationMs;

    const fader = ElementFaderReactUtils.useFader(isExpanded, {
        transitionDurationMs: appliedDurationMs,
        ref: panelRef,
    });

    const hasSeenFinishRef = useRef(fader.hasTransitionFinished);

    useEffect(() => {
        if (hasSeenFinishRef.current === fader.hasTransitionFinished) return;

        hasSeenFinishRef.current = fader.hasTransitionFinished;

        if (fader.hasTransitionFinished) setIsArriving(false);
    }, [fader.hasTransitionFinished]);

    const phase = SidebarUtils.computePhase(isExpanded, fader.hasTransitionFinished);

    const hoverAnchorRef = useLatest(props.isExpandedOnHover ? (root ?? null) : null);
    const [delayGroup] = useState(HoverIntentUtils.createDelayGroup);

    const hoverIntent = HoverIntentReactUtils.useHoverIntent(hoverAnchorRef, peekingState, {
        delayGroup,
        panelRef: noPanelRef,
        hoverShowDelayMs: props.hoverShowDelayMs ?? SIDEBAR_DEFAULTS.hoverShowDelayMs,
        skipDelayWindowMs: NO_SKIP_WINDOW_MS,
        isHeld: () => SidebarUtils.getHasOpenPopupOutside(rootRef.current ?? undefined),
        isTouchIgnored: true,
    });

    const collapseHover = () => {
        hoverIntent.cancel();
        setIsPeeking(false);
        setIsWaitingOnPopup(false);
    };

    const latestCollapseHover = useLatest(collapseHover);

    DismisserReactUtils.useLayer(isPeeking, {
        getRoots: () => [rootRef.current],
        onDismiss: collapseHover,
    });

    useEffect(() => {
        if (!isPeeking && !isWaitingOnPopup) return;

        return SidebarUtils.observePointerAway(rootRef.current ?? undefined, () => latestCollapseHover.current());
    }, [isPeeking, isWaitingOnPopup, latestCollapseHover]);

    const wasOwnerExpandedRef = useRef(isOwnerExpanded);

    useEffect(() => {
        if (wasOwnerExpandedRef.current === isOwnerExpanded) return;

        wasOwnerExpandedRef.current = isOwnerExpanded;

        if (isOwnerExpanded) return;

        if (SidebarUtils.getHasOpenPopupOutside(rootRef.current ?? undefined)) {
            setIsWaitingOnPopup(true);

            return;
        }

        latestCollapseHover.current();
    }, [isOwnerExpanded, latestCollapseHover]);

    const elevationBase = ElevationReactUtils.useBase(root);
    const isRaised = isOverlay && phase !== "collapsed";
    const zIndex = Math.max(AnchorUtils.getStackingBase(root), elevationBase) + 1;

    const panelWidth = fader.transitionTarget === 1 ? props.expandedWidth : props.collapsedWidth;

    return (
        <div
            ref={rootRef}
            id={props.id}
            className={SidebarStyles.sidebarRoot}
            style={{ width: isOverlay ? `${props.collapsedWidth}px` : undefined }}
        >
            <div
                ref={panelRef}
                className={[SidebarStyles.sidebarPanel, isOverlay && SidebarStyles.sidebarPanelOverlayVariants[edge]]
                    .filter(Boolean)
                    .join(" ")}
                style={{
                    width: `${panelWidth}px`,
                    zIndex: isRaised ? zIndex : undefined,
                    transitionDuration: `${appliedDurationMs}ms`,
                }}
            >
                {props.renderContent(phase, appliedDurationMs)}
            </div>
        </div>
    );
};
