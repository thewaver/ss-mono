<script lang="ts">
    import { SegmentedInput } from "@thewaver/ss-components-svelte";
    import { ONE_TIME_CODE_LENGTH, ONE_TIME_CODE_RIGHT_LABEL } from "@thewaver/ss-playground/App/Pages/SegmentedInputPage/SegmentedInputPage.const";
    import { FIELD_GAP } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageSegmentedInputCell from "../../../StyledComponents/SegmentedInputContent/SegmentedInputContent.svelte";

    let value = $state("123");
</script>

<div dir={"rtl"}>
    <SegmentedInput
        bind:value
        cellCount={ONE_TIME_CODE_LENGTH}
        gap={FIELD_GAP}
        ariaLabel={ONE_TIME_CODE_RIGHT_LABEL}
        autoComplete={"one-time-code"}
    >
        {#snippet renderCell(cell)}
            <PageSegmentedInputCell renderProps={cell} />
        {/snippet}
    </SegmentedInput>
</div>
