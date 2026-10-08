import { type SlotsType, Teleport, defineComponent, shallowRef, useId, watch } from "vue";

import { HoverIntentUtils, TOOLTIP_DEFAULTS, TooltipStyles, TooltipUtils } from "@thewaver/ss-components";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { AnchorVueUtils } from "../../../Abstracts/Anchor/AnchorVue.utils";
import { DismisserVueUtils } from "../../../Abstracts/Dismisser/DismisserVue.utils";
import { ElementFaderVueUtils } from "../../../Abstracts/ElementFader/ElementFaderVue.utils";
import { HoverIntentVueUtils } from "../../../Abstracts/HoverIntent/HoverIntentVue.utils";
import { useViewportContext } from "../../../Abstracts/Viewport/Viewport.context";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { callSlot, declareProps } from "../../../Utils/propUtils";
import { toElement } from "../../../Utils/refUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { TooltipProps, TooltipSlots } from "./Tooltip.types";

const TOOLTIP_DELAY_GROUP = HoverIntentUtils.createDelayGroup();

export const Tooltip = defineComponent(
    (props: TooltipProps, { slots }: SlotsContext<TooltipSlots>) => {
        const viewportContext = useViewportContext();
        const tooltipId = useId();

        const isShown = shallowRef(false);
        const contentRef = shallowRef<HTMLElement>();

        const getTransitionDurationMs = () => props.transitionDurationMs ?? TOOLTIP_DEFAULTS.transitionDurationMs;

        const hoverIntent = HoverIntentVueUtils.useHoverIntent(() => props.anchorRef, isShown, {
            delayGroup: TOOLTIP_DELAY_GROUP,
            panelRef: contentRef,
            hoverShowDelayMs: () => props.hoverShowDelayMs ?? TOOLTIP_DEFAULTS.hoverShowDelayMs,
            skipDelayWindowMs: () => props.skipDelayWindowMs ?? TOOLTIP_DEFAULTS.skipDelayWindowMs,
            focusShowDelayMs: () => props.focusShowDelayMs ?? TOOLTIP_DEFAULTS.focusShowDelayMs,
            isHiddenOnAnchorBlur: true,
        });

        const fader = ElementFaderVueUtils.useFader(isShown, {
            transitionDurationMs: getTransitionDurationMs,
            ref: contentRef,
        });

        const { placement, position, arrowAim, zIndex, setContentRef } = AnchorVueUtils.usePortalPosition(
            () => props.anchorRef,
            fader.isVisible,
            {
                placement: () => props.placement,
                offset: () => props.offset,
                reservedScreenSize: () => props.reservedScreenSize,
            },
        );

        DismisserVueUtils.useLayer(isShown, {
            getRoots: () => [props.anchorRef, contentRef.value],
            onDismiss: () => {
                hoverIntent.cancel();
                isShown.value = false;
            },
        });

        const isGliding = shallowRef(false);

        watch(
            () => props.anchorRef,
            (anchor, previous, onCleanup) => {
                if (!anchor || !previous || !fader.isVisible.value) return;

                isGliding.value = true;

                const settle = setTimeout(() => {
                    isGliding.value = false;
                }, getTransitionDurationMs());

                onCleanup(() => clearTimeout(settle));
            },
        );

        watchAfterRender([() => props.anchorRef, fader.isVisible], ([anchor, isVisible]) =>
            anchor && isVisible ? TooltipUtils.describe(anchor, tooltipId) : undefined,
        );

        return () => {
            if (!fader.isVisible.value) return null;

            const bridge = HoverIntentUtils.computeBridgeInsets(placement.value, props.offset);

            return (
                <Teleport to={viewportContext.getPortalRef() ?? document.body}>
                    <div
                        ref={(target) => {
                            contentRef.value = toElement(target);
                            setContentRef(target);
                        }}
                        id={tooltipId}
                        class={TooltipStyles.tooltipRoot}
                        style={{
                            visibility: position.value ? "visible" : "hidden",
                            transform: `translate(${position.value?.x ?? 0}px, ${position.value?.y ?? 0}px)`,
                            transition: isGliding.value
                                ? TooltipUtils.getGlideTransition(getTransitionDurationMs())
                                : undefined,
                            zIndex: zIndex.value,
                            pointerEvents: isShown.value ? "auto" : "none",
                            ...assignInlineVars({
                                [TooltipStyles.bridgeTopVar]: `${-bridge.top}px`,
                                [TooltipStyles.bridgeRightVar]: `${-bridge.right}px`,
                                [TooltipStyles.bridgeBottomVar]: `${-bridge.bottom}px`,
                                [TooltipStyles.bridgeLeftVar]: `${-bridge.left}px`,
                            }),
                        }}
                        role="tooltip"
                    >
                        {callSlot(slots.renderContent, {
                            visibilityTarget: fader.transitionTarget.value,
                            transitionDurationMs: getTransitionDurationMs(),
                            placement: placement.value,
                            arrowAim: arrowAim.value,
                        })}
                    </div>
                </Teleport>
            );
        };
    },
    {
        name: "Tooltip",
        inheritAttrs: false,
        slots: Object as SlotsType<TooltipSlots>,
        props: declareProps<TooltipProps>({
            placement: null,
            offset: null,
            reservedScreenSize: null,
            transitionDurationMs: null,
            focusShowDelayMs: null,
            hoverShowDelayMs: null,
            skipDelayWindowMs: null,
            anchorRef: null,
        }),
    },
);
