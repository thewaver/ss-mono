import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import {
    CutoutUtils,
    DismisserUtils,
    FocusManagerUtils,
    LiveAnnouncerUtils,
    SPOTLIGHT_DEFAULTS,
    SpotlightStyles,
    SpotlightUtils,
} from "@thewaver/ss-components";
import { StringUtils } from "@thewaver/ss-utils";

import { AnchorReactUtils } from "../../Abstracts/Anchor/AnchorReact.utils";
import { ElementFaderReactUtils } from "../../Abstracts/ElementFader/ElementFaderReact.utils";
import { ElementObserverReactUtils } from "../../Abstracts/ElementObserver/ElementObserverReact.utils";
import { ElevationReactUtils } from "../../Abstracts/Elevation/ElevationReact.utils";
import { FocusManagerReactUtils } from "../../Abstracts/FocusManager/FocusManagerReact.utils";
import { useViewportContext } from "../../Abstracts/Viewport/Viewport.context";
import { useLatest } from "../../Utils/refUtils";
import { useStore } from "../../Utils/storeUtils";
import type { SpotlightProps } from "./Spotlight.types";

const toReactStyle = (style: Record<string, string>) =>
    Object.fromEntries(
        Object.entries(style).map(([key, value]) => [StringUtils.kebabToCamelCase(key), value]),
    ) as CSSProperties;

export const Spotlight = (props: SpotlightProps) => {
    const viewportContext = useViewportContext();

    const isOpen = props.visibility[0];

    const elementRef = useLatest(props.elementRef ?? null);
    const portalRef = useRef<HTMLDivElement | null>(null);
    const popupRef = useRef<HTMLDivElement | null>(null);
    const announcedRef = useRef<string | undefined>(undefined);
    const latest = useLatest(props);

    const [portal, setPortal] = useState<HTMLDivElement | null>(null);
    const [hasPlaced, setHasPlaced] = useState(false);

    const transitionDurationMs = props.transitionDurationMs ?? SPOTLIGHT_DEFAULTS.transitionDurationMs;
    const padding = props.padding ?? SPOTLIGHT_DEFAULTS.padding;
    const hasPopup = props.mode === "guide" && props.renderPopup !== undefined;

    const layer = useMemo(
        () =>
            SpotlightUtils.createLayer(
                () => latest.current.mode,
                () => latest.current.visibility[1](false),
            ),
        [latest],
    );

    const isOnTop = useStore(DismisserUtils.openLayers, () => SpotlightUtils.getIsOnTop(layer));

    const fader = ElementFaderReactUtils.useFader(isOpen && isOnTop, { transitionDurationMs, ref: portalRef });

    const isVisible = fader.isVisible;
    const isRegistered = isOpen || isVisible;
    const isActing = isVisible && isOnTop;

    useEffect(() => (isRegistered ? DismisserUtils.addLayer(layer) : undefined), [isRegistered, layer]);

    const wasOpenRef = useRef(false);

    useEffect(() => {
        if (isOpen === wasOpenRef.current) return;

        wasOpenRef.current = isOpen;

        if (isOpen) latest.current.onShow?.();
        else latest.current.onHide?.();
    }, [isOpen, latest]);

    const rect = ElementObserverReactUtils.useViewportRect(elementRef, isVisible, { padding });

    ElevationReactUtils.useElevation(elementRef, isActing, SpotlightStyles.SPOTLIGHT_Z_INDEX);

    useEffect(() => {
        if (!isVisible || !props.elementRef) return;

        props.elementRef.scrollIntoView({ block: "nearest", inline: "nearest" });
    }, [isVisible, props.elementRef]);

    const { placement, position, setContentRef } = AnchorReactUtils.usePortalPosition(
        elementRef,
        isVisible && hasPopup,
        {
            computePlacement: () => props.popupPlacement ?? SPOTLIGHT_DEFAULTS.popupPlacement,
            offset: props.popupOffset ?? SPOTLIGHT_DEFAULTS.popupOffset,
            anchorRect: rect,
        },
    );

    const dismiss = () => {
        latest.current.visibility[1](false);
    };

    useEffect(() => {
        if (!isActing) return;

        return SpotlightUtils.observeDismissKeys(
            layer,
            () => latest.current.mode,
            () => latest.current.visibility[1](false),
        );
    }, [isActing, layer, latest]);

    useEffect(() => {
        if (!isActing || props.mode !== "prompt" || !props.elementRef) return;

        return SpotlightUtils.holdFocus(props.elementRef);
    }, [isActing, props.mode, props.elementRef]);

    useEffect(() => {
        if (!isActing || props.mode !== "guide" || !portal) return;

        return FocusManagerUtils.sealAround(portal);
    }, [isActing, props.mode, portal]);

    const hasAnnouncement = props.announcement !== undefined;

    useEffect(() => {
        if (!hasAnnouncement) return;

        LiveAnnouncerUtils.reserve("polite");
    }, [hasAnnouncement]);

    useEffect(() => {
        if (!isActing) {
            announcedRef.current = undefined;

            return;
        }

        if (SpotlightUtils.getIsAnnouncementDue(announcedRef.current, props.announcement)) {
            LiveAnnouncerUtils.announce(props.announcement!);
        }

        announcedRef.current = props.announcement;
    }, [isActing, props.announcement]);

    const hasWarnedUnannouncedRef = useRef(false);
    const isGuideShowing = isVisible && props.mode === "guide";

    useEffect(() => {
        if (hasWarnedUnannouncedRef.current || !isGuideShowing) return;

        hasWarnedUnannouncedRef.current = SpotlightUtils.warnIfUnannounced(props.announcement, "announcement");
    }, [isGuideShowing, props.announcement]);

    const isPlacing = isActing && hasPopup;

    if (!isPlacing && hasPlaced) setHasPlaced(false);
    if (isPlacing && position && !hasPlaced) setHasPlaced(true);

    FocusManagerReactUtils.useAutoFocus(popupRef, hasPlaced, { isOpen });

    if (!isVisible || !rect) return null;

    const maskStyle = toReactStyle(CutoutUtils.getMaskStyle([rect]));

    return createPortal(
        <div
            ref={(element) => {
                portalRef.current = element;
                setPortal(element);
            }}
        >
            <div className={SpotlightStyles.spotlightOverlay}>
                {props.renderOverlay(fader.transitionTarget, transitionDurationMs, maskStyle)}
            </div>

            <div
                className={SpotlightStyles.spotlightBlocker}
                style={{ clipPath: SpotlightUtils.getHoleClipPath(rect) }}
                onClick={() => {
                    if (props.mode === "hint") dismiss();
                }}
            />

            {props.renderHighlight && (
                <div
                    className={SpotlightStyles.spotlightDecoration}
                    style={{
                        top: `${rect.y}px`,
                        left: `${rect.x}px`,
                        width: `${rect.width}px`,
                        height: `${rect.height}px`,
                    }}
                >
                    {props.renderHighlight(fader.transitionTarget, transitionDurationMs)}
                </div>
            )}

            {hasPopup && (
                <div
                    ref={(element) => {
                        popupRef.current = element;
                        setContentRef(element);
                    }}
                    className={SpotlightStyles.spotlightPopup}
                    style={{
                        visibility: position ? "visible" : "hidden",
                        transform: `translate(${position?.x ?? 0}px, ${position?.y ?? 0}px)`,
                    }}
                    tabIndex={-1}
                    role="dialog"
                    aria-modal="true"
                    aria-label={props.ariaLabel}
                    onKeyDown={(e) =>
                        FocusManagerUtils.focusTrapKeyDown(
                            e.nativeEvent as Parameters<typeof FocusManagerUtils.focusTrapKeyDown>[0],
                            popupRef.current ?? undefined,
                        )
                    }
                >
                    {props.renderPopup?.(fader.transitionTarget, transitionDurationMs, placement)}
                </div>
            )}
        </div>,
        viewportContext.getPortalRef() ?? document.body,
    );
};
