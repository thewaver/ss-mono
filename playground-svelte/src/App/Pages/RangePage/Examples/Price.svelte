<script lang="ts">
    import { Range } from "@thewaver/ss-components-svelte";
    import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

    import PageRangeContent from "../../../StyledComponents/RangeContent/RangeContent.svelte";
    import type { RangePriceExampleProps } from "../RangePage.types";

    const MIN = 0;
    const MAX = 500;
    const STEP = 10;

    const PRICE_FORMAT = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

    type Props = RangePriceExampleProps;

    let { range = $bindable(), ...props }: Props = $props();
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
    onChangeEnd={props.onChangeEnd}
>
    {#snippet renderContent(renderProps)}
        <PageRangeContent {renderProps} />
    {/snippet}
</Range>
