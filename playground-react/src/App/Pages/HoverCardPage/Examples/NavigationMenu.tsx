import { useId, useRef, useState } from "react";

import type { AnchorPlacement, DismisserReason, PopupTriggerFlags } from "@thewaver/ss-components-react";
import {
    HoverIntentReactUtils,
    HoverIntentUtils,
    InteractionWrapper,
    Popover,
    PopupTrigger,
} from "@thewaver/ss-components-react";
import * as styles from "@thewaver/ss-playground/App/Pages/HoverCardPage/HoverCardPage.css";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { PageLayer } from "../../../PageComponents/Layer/Layer";
import { PageNavMenuTrigger } from "../../../StyledComponents/NavMenuContent/NavMenuContent";
import { PagePopoverSurface } from "../../../StyledComponents/PopoverSurface/PopoverSurface";
import type { NavFlyoutProps, NavMenuEntry, NavigationMenuExampleProps } from "../HoverCardPage.types";

const FLYOUT_PLACEMENT: AnchorPlacement = { x: "left-in", y: "bottom-out" };
const FLYOUT_OFFSET = { x: 0, y: 6 };

const NAV_DELAY_GROUP = HoverIntentUtils.createDelayGroup();

const ENTRIES: NavMenuEntry[] = [
    { key: "keep", label: "Keep" },
    {
        key: "armory",
        label: "Armory",
        links: [
            { key: "armory-blades", label: "Blades" },
            { key: "armory-shields", label: "Shields" },
            { key: "armory-mail", label: "Mail and plate" },
        ],
    },
    {
        key: "stables",
        label: "Stables",
        links: [
            { key: "stables-destriers", label: "Destriers" },
            { key: "stables-farriers", label: "Farriers" },
            { key: "stables-feed", label: "Feed and tack" },
        ],
    },
    { key: "chronicle", label: "Chronicle" },
];

const NavFlyout = (props: NavFlyoutProps) => {
    const popupId = useId();

    const triggerRef = useRef<HTMLElement | null>(null);
    const panelRef = useRef<HTMLDivElement | null>(null);

    const [trigger, setTrigger] = useState<HTMLElement>();
    const [isPressOpened, setIsPressOpened] = useState(false);

    const [openKey, setOpenKey] = props.openKeyState;

    const isOpen = openKey === props.entry.key;

    const setIsOpen = (nextIsOpen: boolean) => {
        if (nextIsOpen === isOpen) return;

        setOpenKey(nextIsOpen ? props.entry.key : undefined);
    };

    const getHasFocusInside = () => document.getElementById(popupId)?.contains(document.activeElement) ?? false;

    const hoverIntent = HoverIntentReactUtils.useHoverIntent(
        triggerRef,
        [
            isOpen,
            (nextIsOpen) => {
                if (nextIsOpen && !isOpen) setIsPressOpened(false);

                setIsOpen(nextIsOpen);
            },
        ],
        {
            delayGroup: NAV_DELAY_GROUP,
            panelRef,
            hoverShowDelayMs: props.hoverShowDelayMs,
            skipDelayWindowMs: props.skipDelayWindowMs,
            isHeld: getHasFocusInside,
            isTouchIgnored: true,
        },
    );

    const toggle = () => {
        const nextIsOpen = !isOpen;

        hoverIntent.cancel();
        setIsPressOpened(nextIsOpen);
        setIsOpen(nextIsOpen);
    };

    const handleDismiss = (reason: DismisserReason) => {
        if (reason === "focus" && hoverIntent.getIsPointerInside()) return;

        hoverIntent.cancel();
        setIsOpen(false);
    };

    return (
        <>
            <InteractionWrapper<PopupTriggerFlags>
                ref={(element) => {
                    triggerRef.current = element;
                    setTrigger(element ?? undefined);
                }}
                extraFlags={{ isOpen }}
                renderControl={(setElementRef, flags) => (
                    <PopupTrigger
                        ref={setElementRef}
                        popupId={popupId}
                        isOpen={isOpen}
                        flags={flags}
                        renderContent={(triggerFlags) => (
                            <PageNavMenuTrigger flags={triggerFlags}>{props.entry.label}</PageNavMenuTrigger>
                        )}
                        onToggle={toggle}
                    />
                )}
            />

            <Popover
                id={popupId}
                role={"dialog"}
                ariaAttributes={{ "aria-label": props.entry.label }}
                isOpen={isOpen}
                anchorRef={trigger}
                placement={FLYOUT_PLACEMENT}
                offset={FLYOUT_OFFSET}
                hasAutoFocus={isPressOpened}
                onDismiss={handleDismiss}
                renderContent={(visibilityTarget, transitionDurationMs, placement) => {
                    const bridge = HoverIntentUtils.computeBridgeInsets(placement, FLYOUT_OFFSET);

                    return (
                        <div
                            ref={panelRef}
                            className={styles.flyoutPanel}
                            style={assignInlineVars({
                                [styles.bridgeTopVar]: `${-bridge.top}px`,
                                [styles.bridgeRightVar]: `${-bridge.right}px`,
                                [styles.bridgeBottomVar]: `${-bridge.bottom}px`,
                                [styles.bridgeLeftVar]: `${-bridge.left}px`,
                            })}
                        >
                            <PageLayer level={2}>
                                <PagePopoverSurface
                                    visibilityTarget={visibilityTarget}
                                    transitionDurationMs={transitionDurationMs}
                                    placement={placement}
                                >
                                    <ul className={styles.flyoutList}>
                                        {props.links.map((link) => (
                                            <li key={link.key}>
                                                <a
                                                    href={`#${link.key}`}
                                                    className={styles.flyoutLink}
                                                    onClick={() => {
                                                        setIsOpen(false);
                                                    }}
                                                >
                                                    {link.label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </PagePopoverSurface>
                            </PageLayer>
                        </div>
                    );
                }}
            />
        </>
    );
};

export const NavigationMenuExample = (props: NavigationMenuExampleProps) => {
    return (
        <nav aria-label={"Castle"}>
            <ul className={styles.navList}>
                {ENTRIES.map((entry) => (
                    <li key={entry.key}>
                        {entry.links ? (
                            <NavFlyout {...props} entry={entry} links={entry.links} />
                        ) : (
                            <a href={`#${entry.key}`} className={styles.navLink}>
                                {entry.label}
                            </a>
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );
};
