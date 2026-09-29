import { type SlotsType, computed, defineComponent, shallowRef, watch } from "vue";

import { AnchorUtils, HoverIntentUtils, SIDEBAR_DEFAULTS, SidebarStyles, SidebarUtils } from "@thewaver/ss-components";

import { DismisserVueUtils } from "../../Abstracts/Dismisser/DismisserVue.utils";
import { ElementFaderVueUtils } from "../../Abstracts/ElementFader/ElementFaderVue.utils";
import { ElevationVueUtils } from "../../Abstracts/Elevation/ElevationVue.utils";
import { HoverIntentVueUtils } from "../../Abstracts/HoverIntent/HoverIntentVue.utils";
import { watchAfterRender } from "../../Utils/effectUtils";
import { callSlot, declareProps, useTwoWay } from "../../Utils/propUtils";
import type { SlotsContext } from "../../Utils/typeUtils";
import type { SidebarProps, SidebarSlots } from "./Sidebar.types";

const NO_SKIP_WINDOW_MS = 0;

export const Sidebar = defineComponent(
    (props: SidebarProps, { slots }: SlotsContext<SidebarSlots>) => {
        const rootRef = shallowRef<HTMLDivElement>();
        const panelRef = shallowRef<HTMLDivElement>();

        const ownerExpanded = useTwoWay(props, "expanded", false);

        const isPeeking = shallowRef(false);
        const isWaitingOnPopup = shallowRef(false);

        const getTransitionDurationMs = () => props.transitionDurationMs ?? SIDEBAR_DEFAULTS.transitionDurationMs;

        const isExpanded = computed(() => ownerExpanded.value || isPeeking.value || isWaitingOnPopup.value);

        const isArriving = shallowRef(isExpanded.value);

        const appliedDurationMs = computed(() => (isArriving.value ? 0 : getTransitionDurationMs()));

        const fader = ElementFaderVueUtils.useFader(isExpanded, {
            transitionDurationMs: appliedDurationMs,
            ref: panelRef,
        });

        watch(
            fader.hasTransitionFinished,
            (hasTransitionFinished) => {
                if (hasTransitionFinished) isArriving.value = false;
            },
            { flush: "post" },
        );

        const phase = computed(() => SidebarUtils.computePhase(isExpanded.value, fader.hasTransitionFinished.value));

        const delayGroup = HoverIntentUtils.createDelayGroup();

        const hoverIntent = HoverIntentVueUtils.useHoverIntent(
            () => (props.isExpandedOnHover ? rootRef.value : undefined),
            isPeeking,
            {
                delayGroup,
                panelRef: undefined,
                hoverShowDelayMs: () => props.hoverShowDelayMs ?? SIDEBAR_DEFAULTS.hoverShowDelayMs,
                skipDelayWindowMs: NO_SKIP_WINDOW_MS,
                isHeld: () => SidebarUtils.getHasOpenPopupOutside(rootRef.value),
                isTouchIgnored: true,
            },
        );

        const collapseHover = () => {
            hoverIntent.cancel();
            isPeeking.value = false;
            isWaitingOnPopup.value = false;
        };

        DismisserVueUtils.useLayer(isPeeking, {
            getRoots: () => [rootRef.value],
            onDismiss: collapseHover,
        });

        watchAfterRender([isPeeking, isWaitingOnPopup], ([isHoverPeeking, isWaiting]) => {
            if (!isHoverPeeking && !isWaiting) return;

            return SidebarUtils.observePointerAway(rootRef.value, collapseHover);
        });

        watch(
            ownerExpanded,
            (isOwnerExpanded) => {
                if (isOwnerExpanded) return;

                if (SidebarUtils.getHasOpenPopupOutside(rootRef.value)) {
                    isWaitingOnPopup.value = true;

                    return;
                }

                collapseHover();
            },
            { flush: "post" },
        );

        const elevationBase = ElevationVueUtils.useBase(rootRef);

        return () => {
            const edge = props.edge ?? SIDEBAR_DEFAULTS.edge;
            const isOverlay = (props.layout ?? SIDEBAR_DEFAULTS.layout) === "overlay";
            const isRaised = isOverlay && phase.value !== "collapsed";
            const zIndex = Math.max(AnchorUtils.getStackingBase(rootRef.value), elevationBase.value) + 1;
            const panelWidth = fader.transitionTarget.value === 1 ? props.expandedWidth : props.collapsedWidth;

            return (
                <div
                    ref={rootRef}
                    id={props.id}
                    class={SidebarStyles.sidebarRoot}
                    style={{ width: isOverlay ? `${props.collapsedWidth}px` : undefined }}
                >
                    <div
                        ref={panelRef}
                        class={[
                            SidebarStyles.sidebarPanel,
                            isOverlay && SidebarStyles.sidebarPanelOverlayVariants[edge],
                        ]}
                        style={{
                            width: `${panelWidth}px`,
                            zIndex: isRaised ? zIndex : undefined,
                            transitionDuration: `${appliedDurationMs.value}ms`,
                        }}
                    >
                        {callSlot(slots.renderContent, {
                            phase: phase.value,
                            transitionDurationMs: appliedDurationMs.value,
                        })}
                    </div>
                </div>
            );
        };
    },
    {
        name: "Sidebar",
        slots: Object as SlotsType<SidebarSlots>,
        props: declareProps<SidebarProps>({
            "id": null,
            "edge": null,
            "layout": null,
            "collapsedWidth": null,
            "expandedWidth": null,
            "transitionDurationMs": null,
            "isExpandedOnHover": Boolean,
            "hoverShowDelayMs": null,
            "expanded": Boolean,
            "onUpdate:expanded": null,
        }),
    },
);
