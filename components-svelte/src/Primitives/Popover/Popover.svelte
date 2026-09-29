<script lang="ts">
    import { untrack } from "svelte";

    import { POPOVER_DEFAULTS, PopoverUtils, PopoverStyles as styles } from "@thewaver/ss-components";

    import { AnchorSvelteUtils } from "../../Abstracts/Anchor/AnchorSvelte.utils.svelte.js";
    import { DismisserSvelteUtils } from "../../Abstracts/Dismisser/DismisserSvelte.utils.svelte.js";
    import { ElementFaderSvelteUtils } from "../../Abstracts/ElementFader/ElementFaderSvelte.utils.svelte.js";
    import { FocusManagerSvelteUtils } from "../../Abstracts/FocusManager/FocusManagerSvelte.utils.svelte.js";
    import { getViewportContext } from "../../Abstracts/Viewport/Viewport.context.js";
    import { attachPortal } from "../../Utils/portalUtils.js";
    import type { PopoverProps } from "./Popover.types.js";

    let props: PopoverProps = $props();

    const viewportContext = getViewportContext();

    let root = $state<HTMLDivElement>();

    const transitionDurationMs = $derived(props.transitionDurationMs ?? POPOVER_DEFAULTS.transitionDurationMs);
    const isPinned = $derived(props.isPinned === true);

    const fader = ElementFaderSvelteUtils.createFader(() => props.isOpen, {
        getTransitionDurationMs: () => transitionDurationMs,
        getRef: () => root ?? undefined,
    });

    const position = AnchorSvelteUtils.createPortalPosition(() => props.anchorRef, fader.getIsVisible, {
        getPlacement: () => props.placement ?? POPOVER_DEFAULTS.placement,
        getOffset: () => props.offset,
        getReservedScreenSize: () => props.reservedScreenSize,
        getIsPinned: () => isPinned,
        getAnchorRect: () => props.anchorRect,
    });

    const anchorColor = $derived(
        props.anchorRef && fader.getIsVisible() ? getComputedStyle(props.anchorRef).color : undefined,
    );

    const hasFocus = $derived((props.hasAutoFocus ?? false) && props.isOpen && position.getPosition() !== undefined);

    FocusManagerSvelteUtils.autoFocus(
        () => root ?? undefined,
        () => hasFocus,
        { getInitialRef: () => root ?? undefined },
    );

    let hasSeenAnchor = false;

    $effect(() => {
        const presence = PopoverUtils.computeAnchorPresence(
            hasSeenAnchor,
            props.isOpen,
            isPinned,
            position.getIsAnchorOnScreen(),
        );

        hasSeenAnchor = presence.hasSeenAnchor;

        if (presence.isGone) untrack(() => props.onDismiss?.("anchorGone"));
    });

    DismisserSvelteUtils.createLayer(
        () => props.isOpen,
        {
            getRoots: () => [root, props.anchorRect === undefined ? props.anchorRef : undefined],
            onDismiss: (reason) => props.onDismiss?.(reason),
        },
    );

    $effect(() => {
        const hasTransitionFinished = fader.getHasTransitionFinished();

        untrack(() => props.onTransitionStatusChange?.(hasTransitionFinished));
    });
</script>

{#if fader.getIsVisible()}
    <div
        bind:this={root}
        {@attach attachPortal(viewportContext.getPortalRef() ?? document.body)}
        {@attach position.attachContent}
        id={props.id}
        class={[styles.popoverRoot, props.isTransparentToPointer === true && styles.popoverTransparent]}
        style:visibility={position.getPosition() ? "visible" : "hidden"}
        style:transform={`translate(${position.getPosition()?.x ?? 0}px, ${position.getPosition()?.y ?? 0}px)`}
        style:min-width={props.hasAnchorMinWidth ? `${position.getAnchorRect()?.width ?? 0}px` : undefined}
        style:color={anchorColor}
        style:z-index={position.getZIndex()}
        tabindex="-1"
        inert={!props.isOpen}
        role={props.role}
        {...props.ariaAttributes}
        onkeydown={(e) => props.onKeyDown?.(e)}
        onblur={(e) => props.onBlur?.(e)}
        onmousedown={(e) => {
            if (!PopoverUtils.getIsFocusKeptOnPress(props.role)) return;

            e.preventDefault();
        }}
    >
        <div class={[styles.popoverContent, props.isCovered === true && styles.popoverContentCovered]}>
            {@render props.renderContent(fader.getTransitionTarget(), transitionDurationMs, position.getPlacement())}
        </div>
    </div>
{/if}
