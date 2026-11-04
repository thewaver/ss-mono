<script lang="ts">
    import { Range } from "@thewaver/ss-components-svelte";
    import { SKIN_SAMPLE_RANGE } from "@thewaver/ss-playground/App/Pages/SkinsPage/SkinsPage.const";
    import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

    import PageRangeContent from "../../StyledComponents/RangeContent/RangeContent.svelte";
    import SkinBarCell from "./SkinBarCell.svelte";
    import type { SkinStateProps } from "./SkinsPage.types";

    let props: SkinStateProps = $props();

    let value = $state(SKIN_SAMPLE_RANGE);
</script>

<SkinBarCell state={props.state}>
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
</SkinBarCell>
