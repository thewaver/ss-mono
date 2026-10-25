<script lang="ts">
    import { Label, SegmentedInput } from "@thewaver/ss-components-svelte";
    import { ONE_TIME_CODE_LENGTH } from "@thewaver/ss-playground/App/Pages/SegmentedInputPage/SegmentedInputPage.const";
    import { FIELD_GAP } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.svelte";
    import PageSegmentedInputCell from "../../../StyledComponents/SegmentedInputContent/SegmentedInputContent.svelte";

    const LABEL_GAP = 5;

    let value = $state("");
</script>

<Label orientation={"vertical"} gap={LABEL_GAP}>
    <PageLabelCaption>Verification code</PageLabelCaption>

    <SegmentedInput bind:value cellCount={ONE_TIME_CODE_LENGTH} gap={FIELD_GAP} autoComplete={"one-time-code"}>
        {#snippet renderCell(cell)}
            <PageSegmentedInputCell renderProps={cell} />
        {/snippet}
    </SegmentedInput>
</Label>
