<script lang="ts">
    import { Range } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";
    import type { Span } from "@thewaver/ss-utils";

    import PageRangeContent from "../../../StyledComponents/RangeContent/RangeContent.svelte";

    const MIN = 0;
    const MAX = 500;
    const STEP = 10;

    const PRICE_FORMAT = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

    let range = $state<Span>({ start: 100, end: 350 });
    let settled = $state<number[]>();
</script>

<Range
    bind:range
    id={"price"}
    ariaLabel={"Price range"}
    thumbLabels={["Lowest price", "Highest price"]}
    min={MIN}
    max={MAX}
    step={STEP}
    thumbSize={RANGE_THUMB_SIZE}
    computeValueText={(value) => PRICE_FORMAT.format(value)}
    onChangeEnd={(values) => {
        settled = values;
    }}
>
    {#snippet renderContent(renderProps)}
        <PageRangeContent {renderProps} />
    {/snippet}
</Range>

<div class={exampleStyles.exampleReadout} data-readout>
    {`Read out as: ${PRICE_FORMAT.format(range.start)} and ${PRICE_FORMAT.format(range.end)} | Settled: ${settled?.join("–") ?? "not yet"}`}
</div>
