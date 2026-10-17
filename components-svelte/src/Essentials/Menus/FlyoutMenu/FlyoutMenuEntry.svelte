<script lang="ts" generics="T">
    import { untrack } from "svelte";

    import {
        type FlyoutMenuToggleFlags,
        FlyoutMenuStyles as styles,
        FlyoutMenuUtils,
        type InteractionFlags,
    } from "@thewaver/ss-components";

    import { HoverIntentSvelteUtils } from "../../../Abstracts/HoverIntent/HoverIntentSvelte.utils.svelte.js";
    import type { FlyoutMenuEntryProps } from "./FlyoutMenu.types.js";
    import FlyoutMenuLink from "./FlyoutMenuLink.svelte";
    import FlyoutMenuToggle from "./FlyoutMenuToggle.svelte";

    let { ref = $bindable(), toggleRef = $bindable(), ...props }: FlyoutMenuEntryProps<T> = $props();

    const hasPanel = $derived(FlyoutMenuUtils.getHasPanel(props.entry));

    const hoverIntent = HoverIntentSvelteUtils.create(
        () => (hasPanel && props.isShown ? ref : undefined),
        [() => props.isOpen, (isOpen) => props.onHoverChange(props.index, isOpen)],
        {
            get delayGroup() {
                return props.delayGroup;
            },
            getPanelRef: () => (props.isOpen ? props.panelRef : undefined),
            getHoverShowDelayMs: () => props.hoverShowDelayMs,
            getSkipDelayWindowMs: () => props.skipDelayWindowMs,
            getIsHeld: () => props.getIsHeld(),
            isTouchIgnored: true,
        },
    );

    $effect(() => {
        const index = props.index;

        return untrack(() => props.recordHoverIntent(index, hoverIntent));
    });
</script>

{#snippet toggleContent(flags: InteractionFlags<FlyoutMenuToggleFlags>)}
    {@render props.renderToggle(props.entry, flags)}
{/snippet}

<li
    bind:this={ref}
    class={[styles.flyoutMenuEntry, props.isShown ? "" : styles.flyoutMenuMeasuredEntry]}
    aria-hidden={props.isShown ? undefined : "true"}
    inert={props.isShown ? undefined : true}
>
    <FlyoutMenuLink
        link={props.entry}
        linkComponent={props.linkComponent}
        renderLink={props.renderLink}
        onFollow={props.onFollow}
    />

    {#if hasPanel}
        <FlyoutMenuToggle
            bind:ref={toggleRef}
            ariaLabel={props.computeToggleLabel(props.entry.value)}
            controlsId={props.panelId}
            isOpen={props.isOpen}
            onPress={() => props.onToggle(props.index)}
            onKeyDown={(e) => props.onToggleKeyDown(props.index, e)}
            renderContent={toggleContent}
        />
    {/if}
</li>
