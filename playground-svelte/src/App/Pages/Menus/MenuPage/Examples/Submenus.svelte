<script lang="ts">
    import { Menu } from "@thewaver/ss-components-svelte";
    import { POPOVER_SURFACE_INSET } from "@thewaver/ss-playground/App/StyledComponents/PopoverSurface/PopoverSurface.css";

    import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.svelte";
    import { NESTED_ACTIONS, renderMenuItem, renderMenuPopup } from "../MenuPage.const.svelte";
    import type { MenuExampleProps } from "../MenuPage.types";

    type Props = MenuExampleProps;

    let props: Props = $props();
</script>

<Menu
    renderHighlightFloater={renderPageHighlightFloater}
    items={NESTED_ACTIONS}
    ariaLabel={"File actions"}
    submenuOffset={{ x: POPOVER_SURFACE_INSET, y: -POPOVER_SURFACE_INSET }}
    renderItem={renderMenuItem}
    renderPopup={renderMenuPopup}
    onActivate={props.onActivate}
>
    {#snippet renderContent(flags)}
        <PageMenuTriggerContent {flags}>File</PageMenuTriggerContent>
    {/snippet}
</Menu>
