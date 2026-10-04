<script lang="ts">
    import { Menu } from "@thewaver/ss-components-svelte";
    import { POPOVER_SURFACE_INSET } from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

    import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.svelte";
    import { DESTINATIONS, renderDestinationItem, renderMenuPopup } from "../MenuPage.const.svelte";
    import type { MenuCascaderExampleProps } from "../MenuPage.types";

    const PATH_SEPARATOR = " / ";
    const NOTHING_CHOSEN = "Choose a destination";

    type Props = MenuCascaderExampleProps;

    let { path = $bindable() }: Props = $props();

    const pathText = $derived(path.length > 0 ? path.join(PATH_SEPARATOR) : NOTHING_CHOSEN);
</script>

<Menu
    renderHighlightFloater={renderPageHighlightFloater}
    items={DESTINATIONS}
    ariaLabel={`Destination: ${pathText}`}
    submenuOffset={{ x: POPOVER_SURFACE_INSET, y: -POPOVER_SURFACE_INSET }}
    renderItem={renderDestinationItem}
    renderPopup={renderMenuPopup}
    onActivate={(destination) => {
        if (destination.isLeaf) path = destination.path;
    }}
>
    {#snippet renderContent(flags)}
        <PageMenuTriggerContent {flags}>{pathText}</PageMenuTriggerContent>
    {/snippet}
</Menu>
