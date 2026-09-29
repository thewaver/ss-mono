import { Show, createEffect, createMemo, createSignal, createUniqueId, onCleanup } from "solid-js";
import { Portal } from "solid-js/web";

import { HoverIntentUtils, TOOLTIP_DEFAULTS, TooltipUtils, TooltipStyles as styles } from "@thewaver/ss-components";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { AnchorSolidUtils } from "../../Abstracts/Anchor/AnchorSolid.utils";
import { DismisserSolidUtils } from "../../Abstracts/Dismisser/DismisserSolid.utils";
import { ElementFaderSolidUtils } from "../../Abstracts/ElementFader/ElementFaderSolid.utils";
import { HoverIntentSolidUtils } from "../../Abstracts/HoverIntent/HoverIntentSolid.utils";
import { useViewportContext } from "../../Abstracts/Viewport/Viewport.context";
import { access } from "../../Utils/propUtils";
import type { TooltipProps } from "./TooltipSolid.types";

const TOOLTIP_DELAY_GROUP = HoverIntentUtils.createDelayGroup();

export const Tooltip = (props: TooltipProps) => {
    const viewportContext = useViewportContext();

    const tooltipId = createUniqueId();

    const [getShouldShow, setShouldShow] = createSignal(false);

    const getTransitionDurationMs = createMemo(
        () => access(props.transitionDurationMs) ?? TOOLTIP_DEFAULTS.transitionDurationMs,
    );

    const [getContentRef, setLocalContentRef] = createSignal<HTMLElement>();

    const hoverIntent = HoverIntentSolidUtils.create(() => access(props.anchorRef), [getShouldShow, setShouldShow], {
        delayGroup: TOOLTIP_DELAY_GROUP,
        getPanelRef: getContentRef,
        getHoverShowDelayMs: () => access(props.hoverShowDelayMs) ?? TOOLTIP_DEFAULTS.hoverShowDelayMs,
        getSkipDelayWindowMs: () => access(props.skipDelayWindowMs) ?? TOOLTIP_DEFAULTS.skipDelayWindowMs,
        getFocusShowDelayMs: () => access(props.focusShowDelayMs) ?? TOOLTIP_DEFAULTS.focusShowDelayMs,
        isHiddenOnAnchorBlur: true,
    });

    const { getIsVisible, getTransitionTarget } = ElementFaderSolidUtils.createFader(getShouldShow, {
        getTransitionDurationMs,
        getRef: getContentRef,
    });

    const { getPlacement, getPosition, getZIndex, setContentRef } = AnchorSolidUtils.createPortalPosition(
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

    DismisserSolidUtils.createLayer(getShouldShow, {
        getRoots: () => [access(props.anchorRef), getContentRef()],
        onDismiss: () => {
            hoverIntent.cancel();
            setShouldShow(false);
        },
    });

    createEffect(() => {
        const anchorRef = access(props.anchorRef);

        if (!anchorRef || !getIsVisible()) return;

        onCleanup(TooltipUtils.describe(anchorRef, tooltipId));
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
