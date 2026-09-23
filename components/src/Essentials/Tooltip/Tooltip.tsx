import { Show, createEffect, createMemo, createSignal, createUniqueId, onCleanup } from "solid-js";
import { Portal } from "solid-js/web";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { AnchorUtils } from "../../Abstracts/Anchor/Anchor.utils";
import { DismisserUtils } from "../../Abstracts/Dismisser/Dismisser.utils";
import { ElementFaderUtils } from "../../Abstracts/ElementFader/ElementFader.utils";
import { HoverIntentUtils } from "../../Abstracts/HoverIntent/HoverIntent.utils";
import { useViewportContext } from "../../Abstracts/Viewport/Viewport.context";
import { access } from "../../Utils/propUtils";
import { TOOLTIP_DEFAULTS } from "./Tooltip.const";
import type { TooltipProps } from "./Tooltip.types";

import * as styles from "./Tooltip.css";

const ARIA_DESCRIBED_BY_ATTRIBUTE = "aria-describedby";

const TOOLTIP_DELAY_GROUP = HoverIntentUtils.createDelayGroup();

export const Tooltip = (props: TooltipProps) => {
    const viewportContext = useViewportContext();

    const tooltipId = createUniqueId();

    const [getShouldShow, setShouldShow] = createSignal(false);

    const getTransitionDurationMs = createMemo(
        () => access(props.transitionDurationMs) ?? TOOLTIP_DEFAULTS.transitionDurationMs,
    );

    const [getContentRef, setLocalContentRef] = createSignal<HTMLElement>();

    const hoverIntent = HoverIntentUtils.create(() => access(props.anchorRef), [getShouldShow, setShouldShow], {
        delayGroup: TOOLTIP_DELAY_GROUP,
        getPanelRef: getContentRef,
        getHoverShowDelayMs: () => access(props.hoverShowDelayMs) ?? TOOLTIP_DEFAULTS.hoverShowDelayMs,
        getSkipDelayWindowMs: () => access(props.skipDelayWindowMs) ?? TOOLTIP_DEFAULTS.skipDelayWindowMs,
        getFocusShowDelayMs: () => access(props.focusShowDelayMs) ?? TOOLTIP_DEFAULTS.focusShowDelayMs,
        isHiddenOnAnchorBlur: true,
    });

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

    const getBridge = createMemo(() => HoverIntentUtils.computeBridgeInsets(getPlacement(), access(props.offset)));

    DismisserUtils.createLayer(getShouldShow, {
        getRoots: () => [access(props.anchorRef), getContentRef()],
        onDismiss: () => {
            hoverIntent.cancel();
            setShouldShow(false);
        },
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
                >
                    {props.renderContent(getTransitionTarget, getTransitionDurationMs, getPlacement)}
                </div>
            </Portal>
        </Show>
    );
};
