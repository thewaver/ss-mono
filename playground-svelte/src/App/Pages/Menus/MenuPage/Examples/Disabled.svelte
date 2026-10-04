<script lang="ts">
    import { Menu } from "@thewaver/ss-components-svelte";

    import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.svelte";
    import { ACTIONS, renderMenuItem, renderMenuPopup } from "../MenuPage.const.svelte";
</script>

<Menu
    renderHighlightFloater={renderPageHighlightFloater}
    items={ACTIONS}
    isDisabled={true}
    ariaLabel={"Edit actions"}
    renderItem={renderMenuItem}
    renderPopup={renderMenuPopup}
    onActivate={() => undefined}
>
    {#snippet renderContent(flags)}
        <PageMenuTriggerContent {flags}>Edit</PageMenuTriggerContent>
    {/snippet}
</Menu>
