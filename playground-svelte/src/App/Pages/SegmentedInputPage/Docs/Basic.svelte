<script lang="ts">
    import { SegmentedInput } from "@thewaver/ss-components-svelte";
    import { ONE_TIME_CODE_LENGTH } from "@thewaver/ss-playground/App/Pages/SegmentedInputPage/SegmentedInputPage.const";
    import { FIELD_GAP } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageSegmentedInputCell from "../../../StyledComponents/SegmentedInputContent/SegmentedInputContent.svelte";
    import type { SegmentedInputBasicDocsExampleProps } from "../SegmentedInputPageSvelte.types";

    type Props = SegmentedInputBasicDocsExampleProps;

    let props: Props = $props();

    let value = $state("");
</script>

<SegmentedInput
    bind:value
    cellCount={ONE_TIME_CODE_LENGTH}
    gap={FIELD_GAP}
    isReadOnly={props.isReadOnly}
    hasError={props.hasError}
    isDisabled={props.isDisabled}
    ariaLabel={"One-time code"}
    autoComplete={"one-time-code"}
>
    {#snippet renderCell(cell)}
        <PageSegmentedInputCell renderProps={cell} />
    {/snippet}
</SegmentedInput>
