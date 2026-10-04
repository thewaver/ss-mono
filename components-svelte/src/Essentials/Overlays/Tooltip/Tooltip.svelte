<script lang="ts" module>
    import { HoverIntentUtils } from "@thewaver/ss-components";

    const TOOLTIP_DELAY_GROUP = HoverIntentUtils.createDelayGroup();
</script>

<script lang="ts">
    import { untrack } from "svelte";

    import { TOOLTIP_DEFAULTS, TooltipUtils, TooltipStyles as styles } from "@thewaver/ss-components";
    import { assignInlineVars } from "@vanilla-extract/dynamic";

    import { AnchorSvelteUtils } from "../../../Abstracts/Anchor/AnchorSvelte.utils.svelte.js";
    import { DismisserSvelteUtils } from "../../../Abstracts/Dismisser/DismisserSvelte.utils.svelte.js";
    import { ElementFaderSvelteUtils } from "../../../Abstracts/ElementFader/ElementFaderSvelte.utils.svelte.js";
    import { HoverIntentSvelteUtils } from "../../../Abstracts/HoverIntent/HoverIntentSvelte.utils.svelte.js";
    import { getViewportContext } from "../../../Abstracts/Viewport/Viewport.context.js";
    import { watchChange } from "../../../Utils/effectUtils.svelte.js";
    import { attachPortal } from "../../../Utils/portalUtils.js";
    import { toStyle } from "../../../Utils/styleUtils.js";
    import type { TooltipProps } from "./Tooltip.types.js";

    let props: TooltipProps = $props();

    const viewportContext = getViewportContext();
    const tooltipId = $props.id();

    let isShown = $state(false);
    let contentRef = $state<HTMLElement>();

    const transitionDurationMs = $derived(props.transitionDurationMs ?? TOOLTIP_DEFAULTS.transitionDurationMs);

    const hoverIntent = HoverIntentSvelteUtils.create(
        () => props.anchorRef,
        [
            () => isShown,
            (value) => {
                isShown = value;
            },
        ],
        {
            delayGroup: TOOLTIP_DELAY_GROUP,
            getPanelRef: () => contentRef ?? undefined,
            getHoverShowDelayMs: () => props.hoverShowDelayMs ?? TOOLTIP_DEFAULTS.hoverShowDelayMs,
            getSkipDelayWindowMs: () => props.skipDelayWindowMs ?? TOOLTIP_DEFAULTS.skipDelayWindowMs,
            getFocusShowDelayMs: () => props.focusShowDelayMs ?? TOOLTIP_DEFAULTS.focusShowDelayMs,
            isHiddenOnAnchorBlur: true,
        },
    );

    const fader = ElementFaderSvelteUtils.createFader(() => isShown, {
        getTransitionDurationMs: () => transitionDurationMs,
        getRef: () => contentRef ?? undefined,
    });

    const position = AnchorSvelteUtils.createPortalPosition(() => props.anchorRef, fader.getIsVisible, {
        getPlacement: () => props.placement,
        getOffset: () => props.offset,
        getReservedScreenSize: () => props.reservedScreenSize,
    });

    let isGliding = $state(false);
    let settleGlide: ReturnType<typeof setTimeout> | undefined;

    watchChange(
        () => props.anchorRef,
        (anchorRef, previous) => {
            clearTimeout(settleGlide);

            if (!anchorRef || !previous || !fader.getIsVisible()) return;

            isGliding = true;
            settleGlide = setTimeout(() => {
                isGliding = false;
            }, transitionDurationMs);
        },
    );

    $effect(() => () => clearTimeout(settleGlide));

    const bridge = $derived(HoverIntentUtils.computeBridgeInsets(position.getPlacement(), props.offset));

    DismisserSvelteUtils.createLayer(
        () => isShown,
        {
            getRoots: () => [props.anchorRef, contentRef],
            onDismiss: () => {
                hoverIntent.cancel();
                isShown = false;
            },
        },
    );

    $effect(() => {
        const anchorRef = props.anchorRef;

        if (!anchorRef || !fader.getIsVisible()) return;

        return untrack(() => TooltipUtils.describe(anchorRef, tooltipId));
    });

    const style = $derived(
        toStyle(
            {
                visibility: position.getPosition() ? "visible" : "hidden",
                transform: `translate(${position.getPosition()?.x ?? 0}px, ${position.getPosition()?.y ?? 0}px)`,
                transition: isGliding ? TooltipUtils.getGlideTransition(transitionDurationMs) : undefined,
                zIndex: position.getZIndex(),
                pointerEvents: isShown ? "auto" : "none",
            },
            assignInlineVars({
                [styles.bridgeTopVar]: `${-bridge.top}px`,
                [styles.bridgeRightVar]: `${-bridge.right}px`,
                [styles.bridgeBottomVar]: `${-bridge.bottom}px`,
                [styles.bridgeLeftVar]: `${-bridge.left}px`,
            }),
        ),
    );
</script>

{#if fader.getIsVisible()}
    <div
        bind:this={contentRef}
        {@attach attachPortal(viewportContext.getPortalRef() ?? document.body)}
        {@attach position.attachContent}
        id={tooltipId}
        class={styles.tooltipRoot}
        {style}
        role="tooltip"
    >
        {@render props.renderContent(fader.getTransitionTarget(), transitionDurationMs, position.getPlacement())}
    </div>
{/if}
