<script lang="ts">
    import { Range } from "@thewaver/ss-components-svelte";
    import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

    import PageRangeContent from "../../../StyledComponents/RangeContent/RangeContent.svelte";
    import type { RangePairExampleProps } from "../RangePage.types";

    type Props = RangePairExampleProps;

    let { range = $bindable() }: Props = $props();
</script>

<Range
    bind:range
    ariaLabel={"Price range"}
    thumbLabels={["Lowest price", "Highest price"]}
    thumbSize={RANGE_THUMB_SIZE}
>
    {#snippet renderContent(renderProps)}
        <PageRangeContent {renderProps} />
    {/snippet}
</Range>
