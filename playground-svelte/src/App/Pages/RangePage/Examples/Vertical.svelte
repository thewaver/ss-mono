<script lang="ts">
    import { Range } from "@thewaver/ss-components-svelte";
    import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

    import PageControlRow from "../../../PageComponents/ControlRow/PageControlRow.svelte";
    import PageControlRowLabel from "../../../PageComponents/ControlRow/PageControlRowLabel.svelte";
    import PageRangeContent from "../../../StyledComponents/RangeContent/RangeContent.svelte";
    import type { RangeVerticalExampleProps } from "../RangePage.types";

    const VERTICAL_LENGTH = 160;

    type Props = RangeVerticalExampleProps;

    let { value = $bindable(), range = $bindable() }: Props = $props();
</script>

<PageControlRow>
    <Range
        bind:value
        id={"verticalVolume"}
        ariaLabel={"Vertical volume"}
        orientation={"vertical"}
        thumbSize={RANGE_THUMB_SIZE}
    >
        {#snippet renderContent(renderProps)}
            <PageRangeContent {renderProps} length={VERTICAL_LENGTH} />
        {/snippet}
    </Range>

    <PageControlRowLabel>and a pair</PageControlRowLabel>

    <Range
        bind:range
        ariaLabel={"Vertical band"}
        thumbLabels={["Band floor", "Band ceiling"]}
        orientation={"vertical"}
        thumbSize={RANGE_THUMB_SIZE}
    >
        {#snippet renderContent(renderProps)}
            <PageRangeContent {renderProps} length={VERTICAL_LENGTH} />
        {/snippet}
    </Range>
</PageControlRow>
