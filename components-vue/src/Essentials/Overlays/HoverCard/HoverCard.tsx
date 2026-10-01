import { type SlotsType, defineComponent, shallowRef, useId } from "vue";

import {
    type DismisserReason,
    HOVER_CARD_DEFAULTS,
    HoverCardStyles,
    HoverCardUtils,
    HoverIntentUtils,
} from "@thewaver/ss-components";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { HoverIntentVueUtils } from "../../../Abstracts/HoverIntent/HoverIntentVue.utils";
import { Popover } from "../../../Primitives/Popover/Popover";
import type { PopoverSlots } from "../../../Primitives/Popover/Popover.types";
import { watchAfterRender } from "../../../Utils/effectUtils";
import { callSlot, declareProps, useTwoWay } from "../../../Utils/propUtils";
import { toElement } from "../../../Utils/refUtils";
import type { SlotsContext } from "../../../Utils/typeUtils";
import type { HoverCardProps, HoverCardSlots } from "./HoverCard.types";

const HOVER_CARD_DELAY_GROUP = HoverIntentUtils.createDelayGroup();

export const HoverCard = defineComponent(
    (props: HoverCardProps, { slots }: SlotsContext<HoverCardSlots>) => {
        const cardId = useId();

        const isOpen = useTwoWay(props, "visibility", false);

        const panelRef = shallowRef<HTMLElement>();

        const getCardRef = () => document.getElementById(cardId) ?? undefined;

        const hoverIntent = HoverIntentVueUtils.useHoverIntent(() => props.anchorRef, isOpen, {
            delayGroup: HOVER_CARD_DELAY_GROUP,
            panelRef,
            hoverShowDelayMs: () => props.hoverShowDelayMs ?? HOVER_CARD_DEFAULTS.hoverShowDelayMs,
            skipDelayWindowMs: () => props.skipDelayWindowMs ?? HOVER_CARD_DEFAULTS.skipDelayWindowMs,
            focusShowDelayMs: () => props.focusShowDelayMs ?? HOVER_CARD_DEFAULTS.focusShowDelayMs,
            isHeld: () => HoverCardUtils.getIsHeld(props.anchorRef, getCardRef()),
            isTouchIgnored: true,
        });

        const close = () => {
            hoverIntent.cancel();
            isOpen.value = false;
        };

        const handleDismiss = (reason: DismisserReason) => {
            const dismissal = HoverCardUtils.resolveDismissal(reason, hoverIntent.getIsPointerInside());

            if (dismissal === "ignore") return;

            if (dismissal === "restore") HoverCardUtils.restoreFocus(props.anchorRef, getCardRef());

            close();
        };

        watchAfterRender([() => props.anchorRef], ([anchor]) => {
            if (!anchor) return;

            return HoverCardUtils.observeAnchor(anchor, {
                getIsOpen: () => isOpen.value,
                getCard: getCardRef,
                onTouchPress: () => {
                    hoverIntent.cancel();
                    isOpen.value = !isOpen.value;
                },
            });
        });

        return () => (
            <Popover
                id={cardId}
                role={"dialog"}
                ariaAttributes={{ "aria-label": props.ariaLabel, "aria-labelledby": props.ariaLabelledBy }}
                isOpen={isOpen.value}
                anchorRef={props.anchorRef}
                placement={props.placement ?? HOVER_CARD_DEFAULTS.placement}
                offset={props.offset}
                reservedScreenSize={props.reservedScreenSize}
                transitionDurationMs={props.transitionDurationMs ?? HOVER_CARD_DEFAULTS.transitionDurationMs}
                onKeyDown={(e) => HoverCardUtils.handleCardKeyDown(e, props.anchorRef, getCardRef())}
                onDismiss={handleDismiss}
            >
                {
                    {
                        renderContent: ({ visibilityTarget, transitionDurationMs, placement }) => {
                            const bridge = HoverIntentUtils.computeBridgeInsets(placement, props.offset);

                            return (
                                <div
                                    ref={(target) => {
                                        panelRef.value = toElement(target);
                                    }}
                                    class={HoverCardStyles.hoverCardPanel}
                                    style={assignInlineVars({
                                        [HoverCardStyles.bridgeTopVar]: `${-bridge.top}px`,
                                        [HoverCardStyles.bridgeRightVar]: `${-bridge.right}px`,
                                        [HoverCardStyles.bridgeBottomVar]: `${-bridge.bottom}px`,
                                        [HoverCardStyles.bridgeLeftVar]: `${-bridge.left}px`,
                                    })}
                                >
                                    {callSlot(slots.renderContent, {
                                        visibilityTarget,
                                        transitionDurationMs,
                                        placement,
                                    })}
                                </div>
                            );
                        },
                    } satisfies PopoverSlots
                }
            </Popover>
        );
    },
    {
        name: "HoverCard",
        inheritAttrs: false,
        slots: Object as SlotsType<HoverCardSlots>,
        props: declareProps<HoverCardProps>({
            "ariaLabel": null,
            "ariaLabelledBy": null,
            "placement": null,
            "offset": null,
            "reservedScreenSize": null,
            "transitionDurationMs": null,
            "focusShowDelayMs": null,
            "hoverShowDelayMs": null,
            "skipDelayWindowMs": null,
            "anchorRef": null,
            "visibility": Boolean,
            "onUpdate:visibility": null,
        }),
    },
);
