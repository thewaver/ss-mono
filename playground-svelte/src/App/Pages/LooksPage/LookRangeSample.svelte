<script lang="ts">
    import { Range } from "@thewaver/ss-components-svelte";
    import { LOOK_SAMPLE_RANGE } from "@thewaver/ss-playground/App/Pages/LooksPage/LooksPage.const";
    import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

    import PageRangeContent from "../../StyledComponents/RangeContent/RangeContent.svelte";
    import LookBarCell from "./LookBarCell.svelte";
    import type { LookStateProps } from "./LooksPage.types";

    let props: LookStateProps = $props();

    let value = $state(LOOK_SAMPLE_RANGE);
</script>

<LookBarCell state={props.state}>
    <Range
        bind:value
        ariaLabel={props.state}
        isDisabled={props.isDisabled}
        hasError={props.hasError}
        thumbSize={RANGE_THUMB_SIZE}
    >
        {#snippet renderContent(renderProps)}
            <PageRangeContent {renderProps} />
        {/snippet}
    </Range>
</LookBarCell>
