import { For, Show, createMemo, createSignal, createUniqueId, onCleanup } from "solid-js";

import type { AnchorPlacement, DismisserReason, PopupTriggerFlags } from "@thewaver/ss-components";
import { HoverIntentUtils, InteractionWrapper, Popover, PopupTrigger, access } from "@thewaver/ss-components";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { PageLayer } from "../../../PageComponents/Layer/Layer";
import { PageNavMenuTrigger } from "../../../StyledComponents/NavMenuContent/NavMenuContent";
import { PagePopoverSurface } from "../../../StyledComponents/PopoverSurface/PopoverSurface";
import type { NavFlyoutProps, NavMenuEntry, NavigationMenuExampleProps } from "../HoverCardPage.types";

import * as styles from "../HoverCardPage.css";

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
    const popupId = createUniqueId();

    const [getTriggerRef, setTriggerRef] = createSignal<HTMLElement>();
    const [getPanelRef, setPanelRef] = createSignal<HTMLElement>();
    const [getIsPressOpened, setIsPressOpened] = createSignal(false);

    const [getOpenKey, setOpenKey] = props.openKeySignal;

    const getIsOpen = () => getOpenKey() === access(props.entry).key;

    const setIsOpen = (isOpen: boolean) => {
        if (isOpen === getIsOpen()) return;

        setOpenKey(isOpen ? access(props.entry).key : undefined);
    };

    const getHasFocusInside = () => document.getElementById(popupId)?.contains(document.activeElement) ?? false;

    const hoverIntent = HoverIntentUtils.create(
        getTriggerRef,
        [
            getIsOpen,
            (isOpen) => {
                if (isOpen && !getIsOpen()) setIsPressOpened(false);

                setIsOpen(isOpen);
            },
        ],
        {
            delayGroup: NAV_DELAY_GROUP,
            getPanelRef,
            getHoverShowDelayMs: () => access(props.hoverShowDelayMs),
            getSkipDelayWindowMs: () => access(props.skipDelayWindowMs),
            getIsHeld: getHasFocusInside,
            isTouchIgnored: true,
        },
    );

    const toggle = () => {
        const isOpen = !getIsOpen();

        hoverIntent.cancel();
        setIsPressOpened(isOpen);
        setIsOpen(isOpen);
    };

    const handleDismiss = (reason: DismisserReason) => {
        if (reason === "focus" && hoverIntent.getIsPointerInside()) return;

        hoverIntent.cancel();
        setIsOpen(false);
    };

    return (
        <>
            <InteractionWrapper<PopupTriggerFlags>
                ref={setTriggerRef}
                extraFlags={() => ({ isOpen: getIsOpen() })}
                renderControl={(setElementRef, getFlags) => (
                    <PopupTrigger
                        ref={setElementRef}
                        popupId={() => popupId}
                        isOpen={getIsOpen}
                        flags={getFlags}
                        renderContent={(getTriggerFlags) => (
                            <PageNavMenuTrigger flags={getTriggerFlags}>{access(props.entry).label}</PageNavMenuTrigger>
                        )}
                        onToggle={toggle}
                    />
                )}
            />

            <Popover
                id={() => popupId}
                role={"dialog"}
                ariaAttributes={() => ({ "aria-label": access(props.entry).label })}
                isOpen={getIsOpen}
                anchorRef={getTriggerRef}
                placement={() => FLYOUT_PLACEMENT}
                offset={() => FLYOUT_OFFSET}
                hasAutoFocus={getIsPressOpened}
                onDismiss={handleDismiss}
                renderContent={(getVisibilityTarget, getTransitionDurationMs, getPlacement) => {
                    const getBridge = createMemo(() =>
                        HoverIntentUtils.computeBridgeInsets(getPlacement(), FLYOUT_OFFSET),
                    );

                    onCleanup(() => {
                        setPanelRef(undefined);
                    });

                    return (
                        <div
                            ref={setPanelRef}
                            class={styles.flyoutPanel}
                            style={assignInlineVars({
                                [styles.bridgeTopVar]: `${-getBridge().top}px`,
                                [styles.bridgeRightVar]: `${-getBridge().right}px`,
                                [styles.bridgeBottomVar]: `${-getBridge().bottom}px`,
                                [styles.bridgeLeftVar]: `${-getBridge().left}px`,
                            })}
                        >
                            <PageLayer level={2}>
                                <PagePopoverSurface
                                    visibilityTarget={getVisibilityTarget}
                                    transitionDurationMs={getTransitionDurationMs}
                                    placement={getPlacement}
                                >
                                    <ul class={styles.flyoutList}>
                                        <For each={access(props.links)}>
                                            {(link) => (
                                                <li>
                                                    <a
                                                        href={`#${link.key}`}
                                                        class={styles.flyoutLink}
                                                        onClick={() => {
                                                            setIsOpen(false);
                                                        }}
                                                    >
                                                        {link.label}
                                                    </a>
                                                </li>
                                            )}
                                        </For>
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
            <ul class={styles.navList}>
                <For each={ENTRIES}>
                    {(entry) => (
                        <li>
                            <Show
                                when={entry.links}
                                fallback={
                                    <a href={`#${entry.key}`} class={styles.navLink}>
                                        {entry.label}
                                    </a>
                                }
                            >
                                {(getLinks) => <NavFlyout {...props} entry={entry} links={getLinks} />}
                            </Show>
                        </li>
                    )}
                </For>
            </ul>
        </nav>
    );
};
