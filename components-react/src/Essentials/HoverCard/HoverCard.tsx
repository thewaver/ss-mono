import { type CSSProperties, useEffect, useId, useState } from "react";

import {
    type DismisserReason,
    HOVER_CARD_DEFAULTS,
    HoverCardStyles,
    HoverCardUtils,
    HoverIntentUtils,
} from "@thewaver/ss-components";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { HoverIntentReactUtils } from "../../Abstracts/HoverIntent/HoverIntentReact.utils";
import { SignalMirrorReactUtils } from "../../Abstracts/SignalMirror/SignalMirrorReact.utils";
import { Popover } from "../../Primitives/Popover/Popover";
import { useLatest } from "../../Utils/refUtils";
import type { HoverCardProps } from "./HoverCard.types";

const HOVER_CARD_DELAY_GROUP = HoverIntentUtils.createDelayGroup();

export const HoverCard = (props: HoverCardProps) => {
    const cardId = useId();

    const openState = SignalMirrorReactUtils.useOptionalState(props.visibility, false);
    const [isOpen, setIsOpen] = openState;

    const anchorRef = useLatest(props.anchorRef ?? null);
    const [panel, setPanel] = useState<HTMLDivElement | null>(null);
    const panelRef = useLatest(panel);
    const latestIsOpen = useLatest(isOpen);

    const getCardRef = () => document.getElementById(cardId) ?? undefined;

    const hoverIntent = HoverIntentReactUtils.useHoverIntent(anchorRef, openState, {
        delayGroup: HOVER_CARD_DELAY_GROUP,
        panelRef,
        hoverShowDelayMs: props.hoverShowDelayMs ?? HOVER_CARD_DEFAULTS.hoverShowDelayMs,
        skipDelayWindowMs: props.skipDelayWindowMs ?? HOVER_CARD_DEFAULTS.skipDelayWindowMs,
        focusShowDelayMs: props.focusShowDelayMs ?? HOVER_CARD_DEFAULTS.focusShowDelayMs,
        isHeld: () => HoverCardUtils.getIsHeld(props.anchorRef, getCardRef()),
        isTouchIgnored: true,
    });

    const close = () => {
        hoverIntent.cancel();
        setIsOpen(false);
    };

    const latestOnTouchPress = useLatest(() => {
        hoverIntent.cancel();
        setIsOpen(!latestIsOpen.current);
    });

    const handleDismiss = (reason: DismisserReason) => {
        const dismissal = HoverCardUtils.resolveDismissal(reason, hoverIntent.getIsPointerInside());

        if (dismissal === "ignore") return;

        if (dismissal === "restore") HoverCardUtils.restoreFocus(props.anchorRef, getCardRef());

        close();
    };

    useEffect(() => {
        if (!props.anchorRef) return;

        return HoverCardUtils.observeAnchor(props.anchorRef, {
            getIsOpen: () => latestIsOpen.current,
            getCard: () => document.getElementById(cardId) ?? undefined,
            onTouchPress: () => latestOnTouchPress.current(),
        });
    }, [props.anchorRef, cardId, latestIsOpen, latestOnTouchPress]);

    return (
        <Popover
            id={cardId}
            role={"dialog"}
            ariaAttributes={{ "aria-label": props.ariaLabel, "aria-labelledby": props.ariaLabelledBy }}
            isOpen={isOpen}
            anchorRef={props.anchorRef}
            placement={props.placement ?? HOVER_CARD_DEFAULTS.placement}
            offset={props.offset}
            reservedScreenSize={props.reservedScreenSize}
            transitionDurationMs={props.transitionDurationMs ?? HOVER_CARD_DEFAULTS.transitionDurationMs}
            onKeyDown={(e) => HoverCardUtils.handleCardKeyDown(e, props.anchorRef, getCardRef())}
            onDismiss={handleDismiss}
            renderContent={(visibilityTarget, transitionDurationMs, placement) => {
                const bridge = HoverIntentUtils.computeBridgeInsets(placement, props.offset);

                return (
                    <div
                        ref={setPanel}
                        className={HoverCardStyles.hoverCardPanel}
                        style={
                            assignInlineVars({
                                [HoverCardStyles.bridgeTopVar]: `${-bridge.top}px`,
                                [HoverCardStyles.bridgeRightVar]: `${-bridge.right}px`,
                                [HoverCardStyles.bridgeBottomVar]: `${-bridge.bottom}px`,
                                [HoverCardStyles.bridgeLeftVar]: `${-bridge.left}px`,
                            }) as CSSProperties
                        }
                    >
                        {props.renderContent(visibilityTarget, transitionDurationMs, placement)}
                    </div>
                );
            }}
        />
    );
};
