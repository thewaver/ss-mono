import { createEffect, createMemo, createSignal, createUniqueId, onCleanup } from "solid-js";

import {
    type DismisserReason,
    HOVER_CARD_DEFAULTS,
    HoverCardUtils,
    HoverIntentUtils,
    HoverCardStyles as styles,
} from "@thewaver/ss-components";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { HoverIntentSolidUtils } from "../../../Abstracts/HoverIntent/HoverIntentSolid.utils";
import { SignalMirrorSolidUtils } from "../../../Abstracts/SignalMirror/SignalMirrorSolid.utils";
import { Popover } from "../../../Primitives/Popover/Popover";
import { access } from "../../../Utils/propUtils";
import type { HoverCardProps } from "./HoverCardSolid.types";

const HOVER_CARD_DELAY_GROUP = HoverIntentUtils.createDelayGroup();

export const HoverCard = (props: HoverCardProps) => {
    const cardId = createUniqueId();

    const [getIsOpen, setIsOpen] = SignalMirrorSolidUtils.createOptional(() => props.visibility, false);
    const [getPanelRef, setPanelRef] = createSignal<HTMLElement>();

    const getCardRef = () => document.getElementById(cardId) ?? undefined;

    const getIsHeld = () => HoverCardUtils.getIsHeld(access(props.anchorRef), getCardRef());

    const hoverIntent = HoverIntentSolidUtils.create(() => access(props.anchorRef), [getIsOpen, setIsOpen], {
        delayGroup: HOVER_CARD_DELAY_GROUP,
        getPanelRef,
        getHoverShowDelayMs: () => access(props.hoverShowDelayMs) ?? HOVER_CARD_DEFAULTS.hoverShowDelayMs,
        getSkipDelayWindowMs: () => access(props.skipDelayWindowMs) ?? HOVER_CARD_DEFAULTS.skipDelayWindowMs,
        getFocusShowDelayMs: () => access(props.focusShowDelayMs) ?? HOVER_CARD_DEFAULTS.focusShowDelayMs,
        getIsHeld,
        isTouchIgnored: true,
    });

    const close = () => {
        hoverIntent.cancel();
        setIsOpen(false);
    };

    const handleDismiss = (reason: DismisserReason) => {
        const dismissal = HoverCardUtils.resolveDismissal(reason, hoverIntent.getIsPointerInside());

        if (dismissal === "ignore") return;

        if (dismissal === "restore") HoverCardUtils.restoreFocus(access(props.anchorRef), getCardRef());

        close();
    };

    createEffect(() => {
        const anchorRef = access(props.anchorRef);

        if (!anchorRef) return;

        onCleanup(
            HoverCardUtils.observeAnchor(anchorRef, {
                getIsOpen,
                getCard: getCardRef,
                onTouchPress: () => {
                    hoverIntent.cancel();
                    setIsOpen((isOpen) => !isOpen);
                },
            }),
        );
    });

    return (
        <Popover
            id={() => cardId}
            role={"dialog"}
            ariaAttributes={() => ({
                "aria-label": access(props.ariaLabel),
                "aria-labelledby": access(props.ariaLabelledBy),
            })}
            isOpen={getIsOpen}
            anchorRef={props.anchorRef}
            placement={() => access(props.placement) ?? HOVER_CARD_DEFAULTS.placement}
            offset={props.offset}
            reservedScreenSize={props.reservedScreenSize}
            transitionDurationMs={() => access(props.transitionDurationMs) ?? HOVER_CARD_DEFAULTS.transitionDurationMs}
            onKeyDown={(e) => HoverCardUtils.handleCardKeyDown(e, access(props.anchorRef), getCardRef())}
            onDismiss={handleDismiss}
            renderContent={(getVisibilityTarget, getTransitionDurationMs, getPlacement) => {
                const getBridge = createMemo(() =>
                    HoverIntentUtils.computeBridgeInsets(getPlacement(), access(props.offset)),
                );

                onCleanup(() => {
                    setPanelRef(undefined);
                });

                return (
                    <div
                        ref={setPanelRef}
                        class={styles.hoverCardPanel}
                        style={assignInlineVars({
                            [styles.bridgeTopVar]: `${-getBridge().top}px`,
                            [styles.bridgeRightVar]: `${-getBridge().right}px`,
                            [styles.bridgeBottomVar]: `${-getBridge().bottom}px`,
                            [styles.bridgeLeftVar]: `${-getBridge().left}px`,
                        })}
                    >
                        {props.renderContent(getVisibilityTarget, getTransitionDurationMs, getPlacement)}
                    </div>
                );
            }}
        />
    );
};
