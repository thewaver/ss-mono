<script lang="ts" module>
    import { HoverIntentUtils } from "@thewaver/ss-components";

    const HOVER_CARD_DELAY_GROUP = HoverIntentUtils.createDelayGroup();
</script>

<script lang="ts">
    import { untrack } from "svelte";

    import {
        type AnchorPlacement,
        type DismisserReason,
        HOVER_CARD_DEFAULTS,
        HoverCardUtils,
        HoverCardStyles as styles,
    } from "@thewaver/ss-components";
    import { assignInlineVars } from "@vanilla-extract/dynamic";

    import { HoverIntentSvelteUtils } from "../../../Abstracts/HoverIntent/HoverIntentSvelte.utils.svelte.js";
    import Popover from "../../../Primitives/Popover/Popover.svelte";
    import { toStyle } from "../../../Utils/styleUtils.js";
    import type { HoverCardProps } from "./HoverCard.types.js";

    let { visibility = $bindable(false), ...props }: HoverCardProps = $props();

    const cardId = $props.id();

    let panel = $state<HTMLDivElement>();

    const getCardRef = () => document.getElementById(cardId) ?? undefined;

    const hoverIntent = HoverIntentSvelteUtils.create(
        () => props.anchorRef,
        [
            () => visibility,
            (value) => {
                visibility = value;
            },
        ],
        {
            delayGroup: HOVER_CARD_DELAY_GROUP,
            getPanelRef: () => panel ?? undefined,
            getHoverShowDelayMs: () => props.hoverShowDelayMs ?? HOVER_CARD_DEFAULTS.hoverShowDelayMs,
            getSkipDelayWindowMs: () => props.skipDelayWindowMs ?? HOVER_CARD_DEFAULTS.skipDelayWindowMs,
            getFocusShowDelayMs: () => props.focusShowDelayMs ?? HOVER_CARD_DEFAULTS.focusShowDelayMs,
            getIsHeld: () => HoverCardUtils.getIsHeld(props.anchorRef, getCardRef()),
            isTouchIgnored: true,
        },
    );

    const close = () => {
        hoverIntent.cancel();
        visibility = false;
    };

    const handleDismiss = (reason: DismisserReason) => {
        const dismissal = HoverCardUtils.resolveDismissal(reason, hoverIntent.getIsPointerInside());

        if (dismissal === "ignore") return;

        if (dismissal === "restore") HoverCardUtils.restoreFocus(props.anchorRef, getCardRef());

        close();
    };

    $effect(() => {
        const anchorRef = props.anchorRef;

        if (!anchorRef) return;

        return untrack(() =>
            HoverCardUtils.observeAnchor(anchorRef, {
                getIsOpen: () => visibility,
                getCard: getCardRef,
                onTouchPress: () => {
                    hoverIntent.cancel();
                    visibility = !visibility;
                },
            }),
        );
    });

    const computePanelStyle = (placement: AnchorPlacement) => {
        const bridge = HoverIntentUtils.computeBridgeInsets(placement, props.offset);

        return toStyle(
            assignInlineVars({
                [styles.bridgeTopVar]: `${-bridge.top}px`,
                [styles.bridgeRightVar]: `${-bridge.right}px`,
                [styles.bridgeBottomVar]: `${-bridge.bottom}px`,
                [styles.bridgeLeftVar]: `${-bridge.left}px`,
            }),
        );
    };
</script>

<Popover
    id={cardId}
    role="dialog"
    ariaAttributes={{ "aria-label": props.ariaLabel, "aria-labelledby": props.ariaLabelledBy }}
    isOpen={visibility}
    anchorRef={props.anchorRef}
    placement={props.placement ?? HOVER_CARD_DEFAULTS.placement}
    offset={props.offset}
    reservedScreenSize={props.reservedScreenSize}
    transitionDurationMs={props.transitionDurationMs ?? HOVER_CARD_DEFAULTS.transitionDurationMs}
    onKeyDown={(e) => HoverCardUtils.handleCardKeyDown(e, props.anchorRef, getCardRef())}
    onDismiss={handleDismiss}
>
    {#snippet renderContent(visibilityTarget, transitionDurationMs, placement)}
        <div bind:this={panel} class={styles.hoverCardPanel} style={computePanelStyle(placement)}>
            {@render props.renderContent(visibilityTarget, transitionDurationMs, placement)}
        </div>
    {/snippet}
</Popover>
