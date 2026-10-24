<script lang="ts">
    import { Button } from "@thewaver/ss-components-svelte";

    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import type { ButtonTooltipDocsExampleProps } from "../ButtonPageSvelte.types";

    type Props = ButtonTooltipDocsExampleProps;

    let props: Props = $props();
</script>

<Button
    isDisabled={props.isDisabled}
    isReachableWhenDisabled={props.isReachableWhenDisabled}
    tooltipDefs={{
        placement: { x: "center", y: "top_out" },
        offset: { x: 0, y: 10 },
        renderContent: tooltip,
    }}
>
    {#snippet renderContent(flags)}
        <PageButtonContent {flags}>Hover Me</PageButtonContent>
    {/snippet}
</Button>

{#snippet tooltip(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>A tooltip on a button.</PageTooltipContent>
{/snippet}
