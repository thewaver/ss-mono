<script lang="ts" generics="T">
    import {
        type FlyoutMenuToggleFlags,
        FlyoutMenuStyles as styles,
        FlyoutMenuUtils,
        type InteractionFlags,
    } from "@thewaver/ss-components";

    import type { FlyoutMenuCollapsedEntryProps } from "./FlyoutMenu.types.js";
    import FlyoutMenuLink from "./FlyoutMenuLink.svelte";
    import FlyoutMenuLinkList from "./FlyoutMenuLinkList.svelte";
    import FlyoutMenuToggle from "./FlyoutMenuToggle.svelte";

    let props: FlyoutMenuCollapsedEntryProps<T> = $props();

    const nestedId = $props.id();

    const hasPanel = $derived(FlyoutMenuUtils.getHasPanel(props.entry));
</script>

{#snippet toggleContent(flags: InteractionFlags<FlyoutMenuToggleFlags>)}
    {@render props.renderToggle(props.entry, flags)}
{/snippet}

<li class={styles.flyoutMenuPanelEntry}>
    <div class={[styles.flyoutMenuPanelRow, styles.flyoutMenuPanelItem]}>
        <FlyoutMenuLink
            link={props.entry}
            linkComponent={props.linkComponent}
            renderLink={props.renderLink}
            onFollow={props.onFollow}
        />

        {#if hasPanel}
            <FlyoutMenuToggle
                ariaLabel={props.computeToggleLabel(props.entry.value)}
                controlsId={nestedId}
                isOpen={props.isExpanded}
                onPress={() => props.onToggleExpanded(props.entry.value)}
                renderContent={toggleContent}
            />
        {/if}
    </div>

    {#if hasPanel && props.isExpanded}
        <FlyoutMenuLinkList
            links={props.entry.links!}
            id={nestedId}
            linkComponent={props.linkComponent}
            renderLink={props.renderLink}
            onFollow={props.onFollow}
        />
    {/if}
</li>
