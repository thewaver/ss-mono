<script lang="ts" module>
    import type { Snippet } from "svelte";

    import type { AnchorPlacement, InteractionFlags, MenuItem, MenuItemFlags } from "@thewaver/ss-components-svelte";

    import PageLayer from "../../../PageComponents/Layer/Layer.svelte";
    import PageMenuItemContent from "../../../StyledComponents/MenuItemContent/MenuItemContent.svelte";
    import PagePopoverSurface from "../../../StyledComponents/PopoverSurface/PopoverSurface.svelte";
    import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import type { Action, Destination } from "./MenuPage.types";

    export * from "@thewaver/ss-playground/App/Pages/Menus/MenuPage/MenuActions.const";

    export const ACTIONS_WITH_REACHABLE: MenuItem<Action>[] = [
        { value: { name: "Cut", shortcut: "Ctrl+X" } },
        { value: { name: "Copy", shortcut: "Ctrl+C" } },
        {
            value: { name: "Paste", shortcut: "Ctrl+V" },
            isDisabled: true,
            isReachableWhenDisabled: true,
            tooltipDefs: {
                placement: { x: "right-out", y: "center" },
                offset: { x: 10, y: 0 },
                renderContent: pasteTooltip,
            },
        },
        { value: { name: "Duplicate" } },
        { value: { name: "Delete", shortcut: "Del" } },
    ];

    export { renderMenuPopup, renderMenuItem, renderDestinationItem };
</script>

{#snippet pasteTooltip(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>The clipboard is empty.</PageTooltipContent>
{/snippet}

{#snippet renderMenuPopup(
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

{#snippet renderMenuItem(item: MenuItem<Action>, flags: InteractionFlags<MenuItemFlags>)}
    <PageMenuItemContent isGliding {flags} kind={item.kind} shortcut={item.value.shortcut ?? ""}>
        {item.value.name}
    </PageMenuItemContent>
{/snippet}

{#snippet renderDestinationItem(item: MenuItem<Destination>, flags: InteractionFlags<MenuItemFlags>)}
    <PageMenuItemContent isGliding {flags} kind={item.kind} shortcut={""}>
        {item.value.name}
    </PageMenuItemContent>
{/snippet}
