<script lang="ts">
    import { Range } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

    import PageRangeContent from "../../../StyledComponents/RangeContent/RangeContent.svelte";
    import type { RangeSteppingDocsExampleProps } from "../RangePageSvelte.types";

    type Props = RangeSteppingDocsExampleProps;

    let props: Props = $props();

    let value = $state(3);
</script>

<Range
    bind:value
    id={"difficulty"}
    ariaLabel={"Difficulty"}
    min={props.min}
    max={props.max}
    step={props.step}
    thumbSize={RANGE_THUMB_SIZE}
>
    {#snippet renderContent(renderProps)}
        <PageRangeContent {renderProps} />
    {/snippet}
</Range>

<div class={exampleStyles.exampleReadout} data-readout>{`Value: ${value}`}</div>
