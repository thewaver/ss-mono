<script lang="ts">
    import { Menu } from "@thewaver/ss-components-svelte";

    import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.svelte";
    import { ACTIONS, renderMenuItem, renderMenuPopup } from "../MenuPage.const.svelte";
    import type { MenuExampleProps } from "../MenuPage.types";

    type Props = MenuExampleProps;

    let props: Props = $props();
</script>

<Menu
    renderHighlightFloater={renderPageHighlightFloater}
    items={ACTIONS}
    ariaLabel={"Edit actions"}
    placement={{ x: "left-in", y: "top-out" }}
    renderItem={renderMenuItem}
    renderPopup={renderMenuPopup}
    onActivate={props.onActivate}
>
    {#snippet renderContent(flags)}
        <PageMenuTriggerContent {flags}>Edit</PageMenuTriggerContent>
    {/snippet}
</Menu>
