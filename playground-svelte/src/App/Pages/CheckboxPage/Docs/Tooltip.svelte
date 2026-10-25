<script lang="ts">
    import { Checkbox } from "@thewaver/ss-components-svelte";

    import PageCheckboxContent from "../../../StyledComponents/CheckboxContent/CheckboxContent.svelte";
    import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import type { CheckboxTooltipDocsExampleProps } from "../CheckboxPageSvelte.types";

    type Props = CheckboxTooltipDocsExampleProps;

    let props: Props = $props();

    let checked = $state(true);
</script>

<Checkbox
    bind:checked
    ariaLabel={"Checkbox with a tooltip"}
    isDisabled={props.isDisabled}
    isReachableWhenDisabled={props.isReachableWhenDisabled}
    tooltipDefs={{
        placement: { x: "center", y: "top_out" },
        offset: { x: 0, y: 10 },
        hoverShowDelayMs: 0,
        renderContent: tooltip,
    }}
>
    {#snippet renderContent(flags)}
        <PageCheckboxContent {flags}>Checkbox with a tooltip</PageCheckboxContent>
    {/snippet}
</Checkbox>

{#snippet tooltip(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>A tooltip on a checkbox.</PageTooltipContent>
{/snippet}
