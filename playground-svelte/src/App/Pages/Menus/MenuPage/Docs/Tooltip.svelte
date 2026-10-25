<script lang="ts">
    import { Menu } from "@thewaver/ss-components-svelte";

    import { renderPageHighlightFloater } from "../../../../StyledComponents/GlideFloater/GlideFloater.const.svelte";
    import PageMenuTriggerContent from "../../../../StyledComponents/MenuTriggerContent/MenuTriggerContent.svelte";
    import PageTooltipContent from "../../../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import { ACTIONS, renderMenuItem, renderMenuPopup } from "../MenuPage.const.svelte";
    import type { MenuTooltipDocsExampleProps } from "../MenuPageSvelte.types";

    type Props = MenuTooltipDocsExampleProps;

    let props: Props = $props();
</script>

<Menu
    renderHighlightFloater={renderPageHighlightFloater}
    items={ACTIONS}
    isDisabled={props.isDisabled}
    isReachableWhenDisabled={props.isReachableWhenDisabled}
    ariaLabel={"Edit actions"}
    tooltipDefs={{
        placement: { x: "center", y: "top_out" },
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
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>Cut, copy or paste what is selected.</PageTooltipContent>
{/snippet}
