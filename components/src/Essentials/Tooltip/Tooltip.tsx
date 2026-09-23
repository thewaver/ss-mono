import { Show, createEffect, createMemo, createSignal, createUniqueId, onCleanup } from "solid-js";
import { Portal } from "solid-js/web";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { AnchorUtils } from "../../Abstracts/Anchor/Anchor.utils";
import { DismisserUtils } from "../../Abstracts/Dismisser/Dismisser.utils";
import { ElementFaderUtils } from "../../Abstracts/ElementFader/ElementFader.utils";
import { FocusManagerUtils } from "../../Abstracts/FocusManager/FocusManager.utils";
import { useViewportContext } from "../../Abstracts/Viewport/Viewport.context";
import { access } from "../../Utils/propUtils";
import { TOOLTIP_DEFAULTS } from "./Tooltip.const";
import type { TooltipProps } from "./Tooltip.types";

import * as styles from "./Tooltip.css";

const ARIA_DESCRIBED_BY_ATTRIBUTE = "aria-describedby";
const NO_GAP = 0;

const toGap = (value: number | undefined) => Math.max(value ?? NO_GAP, NO_GAP);

export const Tooltip = (props: TooltipProps) => {
    const viewportContext = useViewportContext();

    const tooltipId = createUniqueId();

    let focusTimeout: ReturnType<typeof setTimeout> | undefined;

    onCleanup(() => {
        clearTimeout(focusTimeout);
    });

    const [getShouldShow, setShouldShow] = createSignal(false);

    const getTransitionDurationMs = createMemo(
        () => access(props.transitionDurationMs) ?? TOOLTIP_DEFAULTS.transitionDurationMs,
    );

    const getFocusShowDelayMs = createMemo(() => access(props.focusShowDelayMs) ?? TOOLTIP_DEFAULTS.focusShowDelayMs);

    const [getContentRef, setLocalContentRef] = createSignal<HTMLElement>();

    const { getIsVisible, getTransitionTarget } = ElementFaderUtils.createFader(getShouldShow, {
        getTransitionDurationMs,
        getRef: getContentRef,
    });

    const { getPlacement, getPosition, getZIndex, setContentRef } = AnchorUtils.createPortalPosition(
        () => access(props.anchorRef),
        getIsVisible,
        {
            getPlacement: () => access(props.placement),
            getOffset: props.offset === undefined ? undefined : () => access(props.offset)!,
            getReservedScreenSize:
                props.reservedScreenSize === undefined ? undefined : () => access(props.reservedScreenSize)!,
        },
    );

    const getBridge = createMemo(() => {
        const placement = getPlacement();
        const offset = access(props.offset);
        const gapX = toGap(offset?.x);
        const gapY = toGap(offset?.y);
        const hKind = AnchorUtils.getHBandKind(placement.x);
        const vKind = AnchorUtils.getVBandKind(placement.y);

        return {
            top: vKind === "after" ? gapY : NO_GAP,
            right: hKind === "before" ? gapX : NO_GAP,
            bottom: vKind === "before" ? gapY : NO_GAP,
            left: hKind === "after" ? gapX : NO_GAP,
        };
    });

    const getIsMovingInto = (e: MouseEvent, element: HTMLElement | undefined) =>
        e.relatedTarget instanceof Node && element !== undefined && element.contains(e.relatedTarget);

    const handleMouseEnter = () => {
        clearTimeout(focusTimeout);
        setShouldShow(true);
    };

    const handleMouseLeave = (e: MouseEvent) => {
        if (getIsMovingInto(e, getContentRef())) return;

        clearTimeout(focusTimeout);
        setShouldShow(false);
    };

    const handleContentMouseLeave = (e: MouseEvent) => {
        if (getIsMovingInto(e, access(props.anchorRef))) return;

        clearTimeout(focusTimeout);
        setShouldShow(false);
    };

    const handleFocus = () => {
        clearTimeout(focusTimeout);

        const anchorRef = access(props.anchorRef);

        if (FocusManagerUtils.getIsRestoringFocus()) return;
        if (anchorRef && !anchorRef.matches(":focus-visible")) return;

        focusTimeout = setTimeout(() => {
            setShouldShow(true);
        }, getFocusShowDelayMs());
    };

    const handleBlur = () => {
        clearTimeout(focusTimeout);
        setShouldShow(false);
    };

    DismisserUtils.createLayer(getShouldShow, {
        getRoots: () => [access(props.anchorRef), getContentRef()],
        onDismiss: () => {
            clearTimeout(focusTimeout);
            setShouldShow(false);
        },
    });

    createEffect(() => {
        const anchorRef = access(props.anchorRef);

        onCleanup(() => {
            anchorRef?.removeEventListener("mouseenter", handleMouseEnter);
            anchorRef?.removeEventListener("mouseleave", handleMouseLeave);
            anchorRef?.removeEventListener("focus", handleFocus);
            anchorRef?.removeEventListener("blur", handleBlur);
        });

        if (!anchorRef) return;

        anchorRef.addEventListener("mouseenter", handleMouseEnter);
        anchorRef.addEventListener("mouseleave", handleMouseLeave);
        anchorRef.addEventListener("focus", handleFocus);
        anchorRef.addEventListener("blur", handleBlur);
    });

    createEffect(() => {
        const anchorRef = access(props.anchorRef);
        const isVisible = getIsVisible();

        if (!anchorRef || !isVisible) return;

        const describedBy = anchorRef.getAttribute(ARIA_DESCRIBED_BY_ATTRIBUTE);
        const ids = describedBy ? describedBy.split(/\s+/).filter(Boolean) : [];

        if (!ids.includes(tooltipId)) {
            anchorRef.setAttribute(ARIA_DESCRIBED_BY_ATTRIBUTE, [...ids, tooltipId].join(" "));
        }

        onCleanup(() => {
            const current = anchorRef.getAttribute(ARIA_DESCRIBED_BY_ATTRIBUTE);

            if (!current) return;

            const remaining = current.split(/\s+/).filter((id) => id && id !== tooltipId);

            if (remaining.length) {
                anchorRef.setAttribute(ARIA_DESCRIBED_BY_ATTRIBUTE, remaining.join(" "));
            } else {
                anchorRef.removeAttribute(ARIA_DESCRIBED_BY_ATTRIBUTE);
            }
        });
    });

    return (
        <Show when={getIsVisible()}>
            <Portal mount={viewportContext.getPortalRef()}>
                <div
                    ref={(element) => {
                        setContentRef(element);
                        setLocalContentRef(element);
                    }}
                    id={tooltipId}
                    class={styles.tooltipRoot}
                    style={{
                        "visibility": getPosition() ? "visible" : "hidden",
                        "transform": `translate(${getPosition()?.x ?? 0}px, ${getPosition()?.y ?? 0}px)`,
                        "z-index": getZIndex(),
                        "pointer-events": getShouldShow() ? "auto" : "none",
                        ...assignInlineVars({
                            [styles.bridgeTopVar]: `${-getBridge().top}px`,
                            [styles.bridgeRightVar]: `${-getBridge().right}px`,
                            [styles.bridgeBottomVar]: `${-getBridge().bottom}px`,
                            [styles.bridgeLeftVar]: `${-getBridge().left}px`,
                        }),
                    }}
                    role="tooltip"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleContentMouseLeave}
                >
                    {props.renderContent(getTransitionTarget, getTransitionDurationMs, getPlacement)}
                </div>
            </Portal>
        </Show>
    );
};
