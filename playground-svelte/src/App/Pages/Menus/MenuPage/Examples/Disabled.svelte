<script lang="ts">
    import { Menu } from "@thewaver/ss-components-svelte";

    import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.svelte";
    import { ACTIONS, renderMenuItem, renderMenuPopup } from "../MenuPage.const.svelte";
</script>

<Menu
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
