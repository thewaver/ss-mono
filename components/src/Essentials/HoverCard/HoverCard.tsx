import { createEffect, createMemo, createSignal, createUniqueId, onCleanup } from "solid-js";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import type { DismisserReason } from "../../Abstracts/Dismisser/Dismisser.types";
import { FocusManagerUtils } from "../../Abstracts/FocusManager/FocusManager.utils";
import { HoverIntentUtils } from "../../Abstracts/HoverIntent/HoverIntent.utils";
import { SignalMirrorUtils } from "../../Abstracts/SignalMirror/SignalMirror.utils";
import { Popover } from "../../Primitives/Popover/Popover";
import { access } from "../../Utils/propUtils";
import { HOVER_CARD_DEFAULTS } from "./HoverCard.const";
import type { HoverCardProps } from "./HoverCard.types";

import * as styles from "./HoverCard.css";

const TAB_KEY = "Tab";
const TOUCH_POINTER_TYPE = "touch";

const HOVER_CARD_DELAY_GROUP = HoverIntentUtils.createDelayGroup();

const computeFocusableAfter = (anchor: HTMLElement, card: HTMLElement) =>
    FocusManagerUtils.getFocusableChildren().find(
        (element) =>
            !card.contains(element) &&
            !anchor.contains(element) &&
            (anchor.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0,
    );

export const HoverCard = (props: HoverCardProps) => {
    const cardId = createUniqueId();

    const [getIsOpen, setIsOpen] = SignalMirrorUtils.createOptional(() => props.visibilitySignal, false);
    const [getPanelRef, setPanelRef] = createSignal<HTMLElement>();

    const getCardRef = () => document.getElementById(cardId) ?? undefined;

    const getHasFocusInside = () => getCardRef()?.contains(document.activeElement) ?? false;

    const getIsHeld = () => {
        const anchorRef = access(props.anchorRef);

        if (getHasFocusInside()) return true;

        return anchorRef !== undefined && document.activeElement === anchorRef && anchorRef.matches(":focus-visible");
    };

    const hoverIntent = HoverIntentUtils.create(() => access(props.anchorRef), [getIsOpen, setIsOpen], {
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

    const closeToAnchor = () => {
        const anchorRef = access(props.anchorRef);

        if (anchorRef && getHasFocusInside()) {
            FocusManagerUtils.runFocusRestore(() => {
                anchorRef.focus({ preventScroll: true });
            });
        }

        close();
    };

    const handleDismiss = (reason: DismisserReason) => {
        if (reason === "escape") {
            closeToAnchor();

            return;
        }

        if (reason === "focus" && hoverIntent.getIsPointerInside()) return;

        close();
    };

    let lastPointerType: string | undefined;

    const handleAnchorPointerDown = (e: PointerEvent) => {
        lastPointerType = e.pointerType;
    };

    const handleAnchorClick = () => {
        const pointerType = lastPointerType;

        lastPointerType = undefined;

        if (pointerType !== TOUCH_POINTER_TYPE) return;

        hoverIntent.cancel();
        setIsOpen((isOpen) => !isOpen);
    };

    const handleAnchorKeyDown = (e: KeyboardEvent) => {
        if (e.key !== TAB_KEY || e.shiftKey || !getIsOpen()) return;

        const first = FocusManagerUtils.getFirstFocusableChild(getCardRef());

        if (!first) return;

        e.preventDefault();
        first.focus({ preventScroll: true });
    };

    const handleCardKeyDown = (e: KeyboardEvent) => {
        const anchorRef = access(props.anchorRef);
        const cardRef = getCardRef();

        if (e.key !== TAB_KEY || !anchorRef || !cardRef) return;

        const focusable = FocusManagerUtils.getFocusableChildren(cardRef);
        const active = document.activeElement;

        if (e.shiftKey) {
            if (active !== cardRef && active !== focusable[0]) return;

            e.preventDefault();
            anchorRef.focus({ preventScroll: true });

            return;
        }

        if (active !== (focusable.at(-1) ?? cardRef)) return;

        const next = computeFocusableAfter(anchorRef, cardRef);

        if (!next) return;

        e.preventDefault();
        next.focus({ preventScroll: true });
    };

    createEffect(() => {
        const anchorRef = access(props.anchorRef);

        if (!anchorRef) return;

        anchorRef.addEventListener("pointerdown", handleAnchorPointerDown);
        anchorRef.addEventListener("click", handleAnchorClick);
        anchorRef.addEventListener("keydown", handleAnchorKeyDown);

        onCleanup(() => {
            anchorRef.removeEventListener("pointerdown", handleAnchorPointerDown);
            anchorRef.removeEventListener("click", handleAnchorClick);
            anchorRef.removeEventListener("keydown", handleAnchorKeyDown);
        });
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
            onKeyDown={handleCardKeyDown}
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
