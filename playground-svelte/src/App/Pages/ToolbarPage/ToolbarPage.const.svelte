<script module lang="ts">
    import type { Snippet } from "svelte";

    import type { AnchorPlacement, InteractionFlags, MenuItem, MenuItemFlags } from "@thewaver/ss-components-svelte";

    import PageLayer from "../../PageComponents/Layer/Layer.svelte";
    import PageMenuItemContent from "../../StyledComponents/MenuItemContent/MenuItemContent.svelte";
    import PagePopoverSurface from "../../StyledComponents/PopoverSurface/PopoverSurface.svelte";

    export const NOTHING_RUN = "nothing run yet";

    export { renderToolbarOverflowItem, renderToolbarPopup };
</script>

{#snippet renderToolbarPopup(
    renderItems: Snippet,
    visibilityTarget: 0 | 1,
    transitionDurationMs: number,
    placement: AnchorPlacement,
)}
    <PageLayer level={2}>
        <PagePopoverSurface {visibilityTarget} {transitionDurationMs} {placement}>
            {@render renderItems()}
        </PagePopoverSurface>
    </PageLayer>
{/snippet}

{#snippet renderToolbarOverflowItem(item: MenuItem<string>, flags: InteractionFlags<MenuItemFlags>)}
    <PageMenuItemContent {flags} kind={item.kind}>
        {item.value}
    </PageMenuItemContent>
{/snippet}
