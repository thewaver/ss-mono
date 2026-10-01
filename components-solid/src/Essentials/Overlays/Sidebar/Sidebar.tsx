import { createEffect, createMemo, createSignal, on, onCleanup, untrack } from "solid-js";

import {
    AnchorUtils,
    HoverIntentUtils,
    SIDEBAR_DEFAULTS,
    SIDEBAR_SIZE_PROPERTIES,
    SidebarUtils,
    SidebarStyles as styles,
} from "@thewaver/ss-components";

import { DismisserSolidUtils } from "../../../Abstracts/Dismisser/DismisserSolid.utils";
import { ElementFaderSolidUtils } from "../../../Abstracts/ElementFader/ElementFaderSolid.utils";
import { ElevationSolidUtils } from "../../../Abstracts/Elevation/ElevationSolid.utils";
import { HoverIntentSolidUtils } from "../../../Abstracts/HoverIntent/HoverIntentSolid.utils";
import { SignalMirrorSolidUtils } from "../../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { access } from "../../../Utils/propUtils";
import type { SidebarProps } from "./SidebarSolid.types";

const NO_SKIP_WINDOW_MS = 0;

export const Sidebar = (props: SidebarProps) => {
    const expandedSignal = SignalMirrorSolidUtils.createOptional(() => props.expanded, false);

    const [getRootRef, setRootRef] = createSignal<HTMLElement>();
    const [getPanelRef, setPanelRef] = createSignal<HTMLElement>();
    const [getIsPeeking, setIsPeeking] = createSignal(false);
    const [getIsWaitingOnPopup, setIsWaitingOnPopup] = createSignal(false);

    const getEdge = createMemo(() => access(props.edge) ?? SIDEBAR_DEFAULTS.edge);

    const getIsOverlay = createMemo(() => (access(props.layout) ?? SIDEBAR_DEFAULTS.layout) === "overlay");

    const getTransitionDurationMs = createMemo(
        () => access(props.transitionDurationMs) ?? SIDEBAR_DEFAULTS.transitionDurationMs,
    );

    const getIsExpanded = createMemo(() => expandedSignal[0]() || getIsPeeking() || getIsWaitingOnPopup());

    const [getIsArriving, setIsArriving] = createSignal(untrack(getIsExpanded));

    const getAppliedDurationMs = () => (getIsArriving() ? 0 : getTransitionDurationMs());

    const { getTransitionTarget, getHasTransitionFinished } = ElementFaderSolidUtils.createFader(getIsExpanded, {
        getTransitionDurationMs: getAppliedDurationMs,
        getRef: getPanelRef,
    });

    createEffect(
        on(
            getHasTransitionFinished,
            (hasFinished) => {
                if (hasFinished) setIsArriving(false);
            },
            { defer: true },
        ),
    );

    const getPhase = createMemo(() => SidebarUtils.computePhase(getIsExpanded(), getHasTransitionFinished()));

    const getIsHeld = () => SidebarUtils.getHasOpenPopupOutside(getRootRef());

    const collapseHover = () => {
        hoverIntent.cancel();
        setIsPeeking(false);
        setIsWaitingOnPopup(false);
    };

    const hoverIntent = HoverIntentSolidUtils.create(
        () => (access(props.isExpandedOnHover) ? getRootRef() : undefined),
        [getIsPeeking, setIsPeeking],
        {
            delayGroup: HoverIntentUtils.createDelayGroup(),
            getPanelRef: () => undefined,
            getHoverShowDelayMs: () => access(props.hoverShowDelayMs) ?? SIDEBAR_DEFAULTS.hoverShowDelayMs,
            getSkipDelayWindowMs: () => NO_SKIP_WINDOW_MS,
            getIsHeld,
            isTouchIgnored: true,
        },
    );

    DismisserSolidUtils.createLayer(getIsPeeking, {
        getRoots: () => [getRootRef()],
        onDismiss: collapseHover,
    });

    createEffect(() => {
        if (!getIsPeeking() && !getIsWaitingOnPopup()) return;

        onCleanup(SidebarUtils.observePointerAway(getRootRef(), collapseHover));
    });

    createEffect(
        on(
            () => expandedSignal[0](),
            (isExpanded) => {
                if (isExpanded) return;

                if (getIsHeld()) {
                    setIsWaitingOnPopup(true);

                    return;
                }

                collapseHover();
            },
            { defer: true },
        ),
    );

    const getIsRaised = () => getIsOverlay() && getPhase() !== "collapsed";

    const getZIndex = () => {
        const root = getRootRef();

        return Math.max(AnchorUtils.getStackingBase(root), ElevationSolidUtils.getBase(root)) + 1;
    };

    const getSizeProperty = () => SIDEBAR_SIZE_PROPERTIES[getEdge()];

    const getPanelSize = () => (getTransitionTarget() === 1 ? access(props.expandedSize) : access(props.collapsedSize));

    return (
        <div
            ref={setRootRef}
            id={access(props.id)}
            class={[styles.sidebarRoot, styles.sidebarRootEdgeVariants[getEdge()]].join(" ")}
            style={{ [getSizeProperty()]: getIsOverlay() ? `${access(props.collapsedSize)}px` : undefined }}
        >
            <div
                ref={setPanelRef}
                class={[
                    styles.sidebarPanel,
                    styles.sidebarPanelEdgeVariants[getEdge()],
                    getIsOverlay() && styles.sidebarPanelOverlayVariants[getEdge()],
                ]
                    .filter(Boolean)
                    .join(" ")}
                style={{
                    [getSizeProperty()]: `${getPanelSize()}px`,
                    "z-index": getIsRaised() ? getZIndex() : undefined,
                    "transition-duration": `${getAppliedDurationMs()}ms`,
                }}
            >
                {props.renderContent(getPhase, getAppliedDurationMs)}
            </div>
        </div>
    );
};
