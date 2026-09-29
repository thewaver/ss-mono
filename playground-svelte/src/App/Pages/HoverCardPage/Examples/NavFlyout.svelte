<script lang="ts" module>
    import { HoverIntentUtils } from "@thewaver/ss-components-svelte";

    const NAV_DELAY_GROUP = HoverIntentUtils.createDelayGroup();
</script>

<script lang="ts">
    import type { AnchorPlacement, DismisserReason } from "@thewaver/ss-components-svelte";
    import {
        HoverIntentSvelteUtils,
        InteractionWrapper,
        Popover,
        PopupTrigger,
        toStyle,
    } from "@thewaver/ss-components-svelte";
    import * as styles from "@thewaver/ss-playground/App/Pages/HoverCardPage/HoverCardPage.css";
    import { assignInlineVars } from "@vanilla-extract/dynamic";

    import PageLayer from "../../../PageComponents/Layer/Layer.svelte";
    import PageNavMenuTrigger from "../../../StyledComponents/NavMenuContent/NavMenuContent.svelte";
    import PagePopoverSurface from "../../../StyledComponents/PopoverSurface/PopoverSurface.svelte";
    import type { NavFlyoutProps } from "../HoverCardPage.types";

    const FLYOUT_PLACEMENT: AnchorPlacement = { x: "left-in", y: "bottom-out" };
    const FLYOUT_OFFSET = { x: 0, y: 6 };

    let { openKey = $bindable(), ...props }: NavFlyoutProps = $props();

    const popupId = $props.id();

    let trigger = $state<HTMLElement>();
    let panel = $state<HTMLDivElement>();
    let isPressOpened = $state(false);

    const isOpen = $derived(openKey === props.entry.key);

    const setIsOpen = (nextIsOpen: boolean) => {
        if (nextIsOpen === isOpen) return;

        openKey = nextIsOpen ? props.entry.key : undefined;
    };

    const getHasFocusInside = () => document.getElementById(popupId)?.contains(document.activeElement) ?? false;

    const hoverIntent = HoverIntentSvelteUtils.create(
        () => trigger,
        [
            () => isOpen,
            (nextIsOpen) => {
                if (nextIsOpen && !isOpen) isPressOpened = false;

                setIsOpen(nextIsOpen);
            },
        ],
        {
            delayGroup: NAV_DELAY_GROUP,
            getPanelRef: () => panel,
            getHoverShowDelayMs: () => props.hoverShowDelayMs,
            getSkipDelayWindowMs: () => props.skipDelayWindowMs,
            getIsHeld: getHasFocusInside,
            isTouchIgnored: true,
        },
    );

    const toggle = () => {
        const nextIsOpen = !isOpen;

        hoverIntent.cancel();
        isPressOpened = nextIsOpen;
        setIsOpen(nextIsOpen);
    };

    const handleDismiss = (reason: DismisserReason) => {
        if (reason === "focus" && hoverIntent.getIsPointerInside()) return;

        hoverIntent.cancel();
        setIsOpen(false);
    };
</script>

<InteractionWrapper bind:ref={trigger} extraFlags={{ isOpen }}>
    {#snippet renderControl(attachElement, flags)}
        <PopupTrigger {attachElement} {popupId} {isOpen} {flags} onToggle={toggle}>
            {#snippet renderContent(triggerFlags)}
                <PageNavMenuTrigger flags={triggerFlags}>{props.entry.label}</PageNavMenuTrigger>
            {/snippet}
        </PopupTrigger>
    {/snippet}
</InteractionWrapper>

<Popover
    id={popupId}
    role={"dialog"}
    ariaAttributes={{ "aria-label": props.entry.label }}
    {isOpen}
    anchorRef={trigger}
    placement={FLYOUT_PLACEMENT}
    offset={FLYOUT_OFFSET}
    hasAutoFocus={isPressOpened}
    onDismiss={handleDismiss}
>
    {#snippet renderContent(visibilityTarget, transitionDurationMs, placement)}
        {@const bridge = HoverIntentUtils.computeBridgeInsets(placement, FLYOUT_OFFSET)}

        <div
            bind:this={panel}
            class={styles.flyoutPanel}
            style={toStyle(
                assignInlineVars({
                    [styles.bridgeTopVar]: `${-bridge.top}px`,
                    [styles.bridgeRightVar]: `${-bridge.right}px`,
                    [styles.bridgeBottomVar]: `${-bridge.bottom}px`,
                    [styles.bridgeLeftVar]: `${-bridge.left}px`,
                }),
            )}
        >
            <PageLayer level={2}>
                <PagePopoverSurface {visibilityTarget} {transitionDurationMs} {placement}>
                    <ul class={styles.flyoutList}>
                        {#each props.links as link (link.key)}
                            <li>
                                <a
                                    href={`#${link.key}`}
                                    class={styles.flyoutLink}
                                    onclick={() => {
                                        setIsOpen(false);
                                    }}
                                >
                                    {link.label}
                                </a>
                            </li>
                        {/each}
                    </ul>
                </PagePopoverSurface>
            </PageLayer>
        </div>
    {/snippet}
</Popover>
