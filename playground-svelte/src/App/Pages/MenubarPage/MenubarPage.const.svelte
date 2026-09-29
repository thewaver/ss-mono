<script lang="ts" module>
    import type { Snippet } from "svelte";

    import type { AnchorPlacement, InteractionFlags, MenuItem, MenuItemFlags } from "@thewaver/ss-components-svelte";

    import PageLayer from "../../PageComponents/Layer/Layer.svelte";
    import PageMenuItemContent from "../../StyledComponents/MenuItemContent/MenuItemContent.svelte";
    import PagePopoverSurface from "../../StyledComponents/PopoverSurface/PopoverSurface.svelte";
    import type { MenubarEntry } from "./MenubarPage.types";

    export * from "@thewaver/ss-playground/App/Pages/MenubarPage/MenubarWords.const";

    export { renderMenubarPopup, renderMenubarItem };
</script>

{#snippet renderMenubarPopup(
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

{#snippet renderMenubarItem(item: MenuItem<MenubarEntry>, flags: InteractionFlags<MenuItemFlags>)}
    <PageMenuItemContent {flags} kind={item.kind} shortcut={item.value.shortcut ?? ""}>
        {item.value.name}
    </PageMenuItemContent>
{/snippet}
