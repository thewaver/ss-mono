import { createEffect, createMemo, createSignal, on, onCleanup, untrack } from "solid-js";

import { AnchorUtils } from "../../Abstracts/Anchor/Anchor.utils";
import { DismisserUtils } from "../../Abstracts/Dismisser/Dismisser.utils";
import { ElementFaderUtils } from "../../Abstracts/ElementFader/ElementFader.utils";
import { ElevationUtils } from "../../Abstracts/Elevation/Elevation.utils";
import { HoverIntentUtils } from "../../Abstracts/HoverIntent/HoverIntent.utils";
import { SignalMirrorUtils } from "../../Abstracts/SignalMirror/SignalMirror.utils";
import { access } from "../../Utils/propUtils";
import { SIDEBAR_DEFAULTS } from "./Sidebar.const";
import type { SidebarPhase, SidebarProps } from "./Sidebar.types";

import * as styles from "./Sidebar.css";

const NO_SKIP_WINDOW_MS = 0;
const OPEN_CONTROLLER_SELECTOR = '[aria-expanded="true"][aria-controls]';

const getHasOpenPopupOutside = (root: HTMLElement | undefined) =>
    root !== undefined &&
    [...root.querySelectorAll(OPEN_CONTROLLER_SELECTOR)].some((controller) =>
        (controller.getAttribute("aria-controls") ?? "").split(/s+/).some((id) => {
            const controlled = id ? document.getElementById(id) : null;

            return controlled !== null && !root.contains(controlled);
        }),
    );

export const Sidebar = (props: SidebarProps) => {
    const expandedSignal = SignalMirrorUtils.createOptional(() => props.expandedSignal, false);

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

    const { getTransitionTarget, getHasTransitionFinished } = ElementFaderUtils.createFader(getIsExpanded, {
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

    const getPhase = createMemo((): SidebarPhase => {
        const hasFinished = getHasTransitionFinished();

        if (getIsExpanded()) return hasFinished ? "expanded" : "expanding";

        return hasFinished ? "collapsed" : "collapsing";
    });

    const getIsHeld = () => getHasOpenPopupOutside(getRootRef());

    const collapseHover = () => {
        hoverIntent.cancel();
        setIsPeeking(false);
        setIsWaitingOnPopup(false);
    };

    const hoverIntent = HoverIntentUtils.create(
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

    DismisserUtils.createLayer(getIsPeeking, {
        getRoots: () => [getRootRef()],
        onDismiss: collapseHover,
    });

    createEffect(() => {
        if (!getIsPeeking() && !getIsWaitingOnPopup()) return;

        const handlePointerMove = (e: PointerEvent) => {
            if (getIsHeld() || DismisserUtils.getIsWithinOwnedLayer(e.target as Node | null, [getRootRef()])) return;

            collapseHover();
        };

        document.addEventListener("pointermove", handlePointerMove);

        onCleanup(() => {
            document.removeEventListener("pointermove", handlePointerMove);
        });
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

        return Math.max(AnchorUtils.getStackingBase(root), ElevationUtils.getBase(root)) + 1;
    };

    const getPanelWidth = () =>
        getTransitionTarget() === 1 ? access(props.expandedWidth) : access(props.collapsedWidth);

    return (
        <div
            ref={setRootRef}
            id={access(props.id)}
            class={styles.sidebarRoot}
            style={{ width: getIsOverlay() ? `${access(props.collapsedWidth)}px` : undefined }}
        >
            <div
                ref={setPanelRef}
                class={styles.sidebarPanel}
                classList={{ [styles.sidebarPanelOverlayVariants[getEdge()]]: getIsOverlay() }}
                style={{
                    "width": `${getPanelWidth()}px`,
                    "z-index": getIsRaised() ? getZIndex() : undefined,
                    "transition-duration": `${getAppliedDurationMs()}ms`,
                }}
            >
                {props.renderContent(getPhase, getAppliedDurationMs)}
            </div>
        </div>
    );
};
