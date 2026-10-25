<script lang="ts">
    import { Range } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";
    import type { Span } from "@thewaver/ss-utils";

    import PageRangeContent from "../../../StyledComponents/RangeContent/RangeContent.svelte";

    let range = $state<Span>({ start: 20, end: 80 });
</script>

<div dir={"rtl"}>
    <Range
        bind:range
        id={"rightToLeft"}
        ariaLabel={"Price range"}
        thumbLabels={["Lowest price", "Highest price"]}
        thumbSize={RANGE_THUMB_SIZE}
    >
        {#snippet renderContent(renderProps)}
            <PageRangeContent {renderProps} />
        {/snippet}
    </Range>
</div>

<div class={exampleStyles.exampleReadout} data-readout>{`Start: ${range.start} | End: ${range.end}`}</div>
