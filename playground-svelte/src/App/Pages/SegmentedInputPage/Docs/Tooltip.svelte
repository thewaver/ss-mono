<script lang="ts">
    import { SegmentedInput } from "@thewaver/ss-components-svelte";
    import { ONE_TIME_CODE_LENGTH } from "@thewaver/ss-playground/App/Pages/SegmentedInputPage/SegmentedInputPage.const";
    import { FIELD_GAP } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageSegmentedInputCell from "../../../StyledComponents/SegmentedInputContent/SegmentedInputContent.svelte";
    import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import type { SegmentedInputTooltipDocsExampleProps } from "../SegmentedInputPageSvelte.types";

    type Props = SegmentedInputTooltipDocsExampleProps;

    let props: Props = $props();

    let value = $state("");
</script>

<SegmentedInput
    bind:value
    cellCount={ONE_TIME_CODE_LENGTH}
    gap={FIELD_GAP}
    isDisabled={props.isDisabled}
    isReachableWhenDisabled={props.isReachableWhenDisabled}
    ariaLabel={"Disabled but reachable code"}
    tooltipDefs={{
        placement: { x: "center", y: "top_out" },
        offset: { x: 0, y: 10 },
        renderContent: tooltip,
    }}
>
    {#snippet renderCell(cell)}
        <PageSegmentedInputCell renderProps={cell} />
    {/snippet}
</SegmentedInput>

{#snippet tooltip(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>
        Focusable so this tooltip can be read, but nothing typed may reach the cells.
    </PageTooltipContent>
{/snippet}
