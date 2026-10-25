<script lang="ts">
    import { Range } from "@thewaver/ss-components-svelte";
    import * as exampleStyles from "@thewaver/ss-playground/App/PageComponents/Examples/Examples.css";
    import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

    import PageRangeContent from "../../../StyledComponents/RangeContent/RangeContent.svelte";
    import type { RangeBasicDocsExampleProps } from "../RangePageSvelte.types";

    type Props = RangeBasicDocsExampleProps;

    let props: Props = $props();

    let value = $state(40);
</script>

<Range
    bind:value
    id={"volume"}
    ariaLabel={"Volume"}
    orientation={props.orientation}
    hasError={props.hasError}
    isDisabled={props.isDisabled}
    thumbSize={RANGE_THUMB_SIZE}
>
    {#snippet renderContent(renderProps)}
        <PageRangeContent {renderProps} />
    {/snippet}
</Range>

<div class={exampleStyles.exampleReadout} data-readout>{`Value: ${value}`}</div>
