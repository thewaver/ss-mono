<script lang="ts">
    import { Label, NumberInput } from "@thewaver/ss-components-svelte";
    import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/NumberInputPage/NumberInputPage.const";
    import {
        FIELD_GAP,
        FIELD_STEPPER_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageNumberInputStepper from "../../../PageComponents/NumberInputStepper/NumberInputStepper.svelte";
    import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.svelte";
    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import type { NumberInputExampleProps } from "../NumberInputPage.types";

    const LABEL_GAP = 5;
    const GUEST_MIN = 1;
    const GUEST_MAX = 8;

    type Props = NumberInputExampleProps;

    let { value = $bindable() }: Props = $props();
</script>

<Label orientation={"vertical"} gap={LABEL_GAP}>
    <PageLabelCaption>Guests</PageLabelCaption>

    <NumberInput
        bind:value
        min={GUEST_MIN}
        max={GUEST_MAX}
        padding={FIELD_STEPPER_PADDING}
        gap={FIELD_GAP}
        computeTextStyle={computePageTextFieldTextStyle}
    >
        {#snippet renderContent(flags)}
            <PageTextFieldContent {flags} width={FIELD_WIDTH} />
        {/snippet}

        {#snippet renderTrailing(flags, stepper)}
            <PageNumberInputStepper {flags} {stepper} />
        {/snippet}
    </NumberInput>
</Label>
