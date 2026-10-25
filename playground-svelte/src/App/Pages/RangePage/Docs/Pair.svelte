<script lang="ts">
    import { Range } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";
    import type { Span } from "@thewaver/ss-utils";

    import PageRangeContent from "../../../StyledComponents/RangeContent/RangeContent.svelte";
    import type { RangePairDocsExampleProps } from "../RangePageSvelte.types";

    type Props = RangePairDocsExampleProps;

    let props: Props = $props();

    let range = $state<Span>({ start: 20, end: 80 });
</script>

<Range
    bind:range
    id={"pair"}
    ariaLabel={"Price range"}
    thumbLabels={["Lowest price", "Highest price"]}
    isDisabled={props.isDisabled}
    thumbSize={RANGE_THUMB_SIZE}
>
    {#snippet renderContent(renderProps)}
        <PageRangeContent {renderProps} />
    {/snippet}
</Range>

<div class={exampleStyles.exampleReadout} data-readout>{`Start: ${range.start} | End: ${range.end}`}</div>
