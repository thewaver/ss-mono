import { Show, createEffect, createMemo, createSignal, onCleanup, onMount } from "solid-js";
import type { JSX } from "solid-js";
import { Portal } from "solid-js/web";

import {
    CutoutUtils,
    FocusManagerUtils,
    LiveAnnouncerUtils,
    SPOTLIGHT_DEFAULTS,
    SpotlightUtils,
    SpotlightStyles as styles,
} from "@thewaver/ss-components";
import { Rect } from "@thewaver/ss-utils";

import { AnchorSolidUtils } from "../../Abstracts/Anchor/AnchorSolid.utils";
import { ElementFaderSolidUtils } from "../../Abstracts/ElementFader/ElementFaderSolid.utils";
import { ElementObserverSolidUtils } from "../../Abstracts/ElementObserver/ElementObserverSolid.utils";
import { ElevationSolidUtils } from "../../Abstracts/Elevation/ElevationSolid.utils";
import { FocusManagerSolidUtils } from "../../Abstracts/FocusManager/FocusManagerSolid.utils";
import { useViewportContext } from "../../Abstracts/Viewport/Viewport.context";
import { access } from "../../Utils/propUtils";
import type { SpotlightProps } from "./SpotlightSolid.types";

export const Spotlight = (props: SpotlightProps) => {
    const viewportContext = useViewportContext();

    const [getElementRect, setElementRect] = createSignal<Rect | undefined>(undefined, {
        equals: Rect.isSame,
    });
    const [getPortalRef, setPortalRef] = createSignal<HTMLElement>();
    const [getPopupRef, setPopupRef] = createSignal<HTMLElement>();

    const getTransitionDurationMs = createMemo(
        () => access(props.transitionDurationMs) ?? SPOTLIGHT_DEFAULTS.transitionDurationMs,
    );

    const getPadding = createMemo(() => access(props.padding) ?? SPOTLIGHT_DEFAULTS.padding);

    const { getIsVisible, getTransitionTarget } = ElementFaderSolidUtils.createFader(() => props.visibility[0](), {
        getTransitionDurationMs,
        getRef: getPortalRef,
        onShow: props.onShow,
        onHide: props.onHide,
    });

    const getHasPopup = createMemo(() => access(props.mode) === "guide" && props.renderPopup !== undefined);

    ElementObserverSolidUtils.createViewportRectObserver(() => access(props.elementRef), getIsVisible, {
        setElementRect,
        getPadding,
    });

    ElevationSolidUtils.createElevation(
        () => access(props.elementRef),
        getIsVisible,
        () => styles.SPOTLIGHT_Z_INDEX,
    );

    createEffect(() => {
        const element = access(props.elementRef);

        if (!getIsVisible() || !element) return;

        element.scrollIntoView({ block: "nearest", inline: "nearest" });
    });

    const { getPlacement, getPosition, setContentRef } = AnchorSolidUtils.createPortalPosition(
        () => access(props.elementRef),
        () => getIsVisible() && getHasPopup(),
        {
            getPlacement: () => access(props.popupPlacement) ?? SPOTLIGHT_DEFAULTS.popupPlacement,
            getOffset: () => access(props.popupOffset) ?? SPOTLIGHT_DEFAULTS.popupOffset,
            getAnchorRect: getElementRect,
        },
    );

    const getMaskStyle = createMemo<JSX.CSSProperties>(() => {
        const rect = getElementRect();

        return rect ? CutoutUtils.getMaskStyle([rect]) : {};
    });

    const getClipPath = createMemo(() => {
        const rect = getElementRect();

        return rect ? SpotlightUtils.getHoleClipPath(rect) : undefined;
    });

    const dismiss = () => {
        props.visibility[1](false);
    };

    createEffect(() => {
        if (!getIsVisible()) return;

        onCleanup(SpotlightUtils.observeDismissKeys(() => access(props.mode), dismiss));
    });

    createEffect(() => {
        const element = access(props.elementRef);

        if (!getIsVisible() || access(props.mode) !== "prompt" || !element) return;

        onCleanup(SpotlightUtils.holdFocus(element));
    });

    createEffect(() => {
        const portal = getPortalRef();

        if (!getIsVisible() || access(props.mode) !== "guide" || !portal) return;

        onCleanup(FocusManagerUtils.sealAround(portal));
    });

    onMount(() => {
        if (props.announcement === undefined) return;

        LiveAnnouncerUtils.reserve("polite");
    });

    createEffect<string | undefined>((previous) => {
        const announcement = access(props.announcement);

        if (!getIsVisible()) return previous;
        if (SpotlightUtils.getIsAnnouncementDue(previous, announcement)) LiveAnnouncerUtils.announce(announcement!);

        return announcement;
    });

    const [getHasPlaced, setHasPlaced] = createSignal(false);

    createEffect(() => {
        if (!getIsVisible() || !getHasPopup()) {
            setHasPlaced(false);

            return;
        }

        if (getPosition()) setHasPlaced(true);
    });

    FocusManagerSolidUtils.autoFocus(getPopupRef, getHasPlaced);

    return (
        <Show when={getIsVisible() && getElementRect()}>
            <Portal ref={setPortalRef} mount={viewportContext.getPortalRef()}>
                <div class={styles.spotlightOverlay}>
                    {props.renderOverlay(getTransitionTarget, getTransitionDurationMs, getMaskStyle)}
                </div>

                <div
                    class={styles.spotlightBlocker}
                    style={{ "clip-path": getClipPath() }}
                    onClick={() => access(props.mode) === "hint" && dismiss()}
                />

                <Show when={props.renderHighlight && getElementRect()}>
                    {(getRect) => (
                        <div
                            class={styles.spotlightDecoration}
                            style={{
                                top: `${getRect().y}px`,
                                left: `${getRect().x}px`,
                                width: `${getRect().width}px`,
                                height: `${getRect().height}px`,
                            }}
                        >
                            {props.renderHighlight?.(getTransitionTarget, getTransitionDurationMs)}
                        </div>
                    )}
                </Show>

                <Show when={getHasPopup()}>
                    <div
                        ref={(element) => {
                            setPopupRef(element);
                            setContentRef(element);
                        }}
                        class={styles.spotlightPopup}
                        style={{
                            visibility: getPosition() ? "visible" : "hidden",
                            transform: `translate(${getPosition()?.x ?? 0}px, ${getPosition()?.y ?? 0}px)`,
                        }}
                        tabIndex={-1}
                        role="dialog"
                        aria-modal="true"
                        aria-label={access(props.ariaLabel)}
                        onKeyDown={(e) => FocusManagerUtils.focusTrapKeyDown(e, getPopupRef())}
                    >
                        {props.renderPopup?.(getTransitionTarget, getTransitionDurationMs, getPlacement)}
                    </div>
                </Show>
            </Portal>
        </Show>
    );
};
