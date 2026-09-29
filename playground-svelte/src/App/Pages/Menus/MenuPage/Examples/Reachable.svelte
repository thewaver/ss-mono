<script lang="ts">
    import { Menu } from "@thewaver/ss-components-svelte";

    import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.svelte";
    import PageTooltipContent from "../../../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import { ACTIONS, renderMenuItem, renderMenuPopup } from "../MenuPage.const.svelte";
</script>

<Menu
    items={ACTIONS}
    isDisabled={true}
    isReachableWhenDisabled={true}
    ariaLabel={"Edit actions"}
    tooltipDefs={{
        placement: { x: "center", y: "top-out" },
        offset: { x: 0, y: 10 },
        renderContent: tooltip,
    }}
    renderItem={renderMenuItem}
    renderPopup={renderMenuPopup}
    onActivate={() => undefined}
>
    {#snippet renderContent(flags)}
        <PageMenuTriggerContent {flags}>Edit</PageMenuTriggerContent>
    {/snippet}
</Menu>

{#snippet tooltip(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>
        Nothing is selected, so there is nothing to edit.
    </PageTooltipContent>
{/snippet}
