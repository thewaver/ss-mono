<script lang="ts">
    import { Range } from "@thewaver/ss-components-svelte";
    import { RANGE_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/RangeContent/RangeContent.css";

    import PageRangeContent from "../../../StyledComponents/RangeContent/RangeContent.svelte";
    import type { RangeExampleProps } from "../RangePage.types";

    const ERROR_ABOVE = 80;

    type Props = RangeExampleProps;

    let { value = $bindable() }: Props = $props();
</script>

<Range bind:value ariaLabel={"Errored range"} hasError={value > ERROR_ABOVE} thumbSize={RANGE_THUMB_SIZE}>
    {#snippet renderContent(renderProps)}
        <PageRangeContent {renderProps} />
    {/snippet}
</Range>
