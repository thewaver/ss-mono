<script lang="ts">
    import { Toggle } from "@thewaver/ss-components-svelte";

    import PageToggleContent from "../../../StyledComponents/ToggleContent/ToggleContent.svelte";
    import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import type { ToggleTooltipDocsExampleProps } from "../TogglePageSvelte.types";

    type Props = ToggleTooltipDocsExampleProps;

    let props: Props = $props();

    let checked = $state(true);
</script>

<Toggle
    bind:checked
    ariaLabel={"Toggle with a tooltip"}
    isDisabled={props.isDisabled}
    isReachableWhenDisabled={props.isReachableWhenDisabled}
    tooltipDefs={{
        placement: { x: "center", y: "top_out" },
        offset: { x: 0, y: 10 },
        renderContent: tooltip,
    }}
>
    {#snippet renderContent(flags)}
        <PageToggleContent {flags}>Toggle with a tooltip</PageToggleContent>
    {/snippet}
</Toggle>

{#snippet tooltip(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>A tooltip on a toggle.</PageTooltipContent>
{/snippet}
