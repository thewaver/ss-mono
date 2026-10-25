<script lang="ts">
    import { NumberInput } from "@thewaver/ss-components-svelte";
    import { FIELD_WIDTH } from "@thewaver/ss-playground/App/Pages/NumberInputPage/NumberInputPage.const";
    import * as styles from "@thewaver/ss-playground/App/Pages/NumberInputPage/NumberInputPage.css";
    import {
        FIELD_GAP,
        FIELD_STEPPER_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageNumberInputStepper from "../../../PageComponents/NumberInputStepper/NumberInputStepper.svelte";
    import PageTextFieldAdornment from "../../../StyledComponents/TextFieldAdornment/TextFieldAdornment.svelte";
    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";

    let value = $state<number | undefined>(72);
</script>

<NumberInput
    bind:value
    min={0}
    padding={FIELD_STEPPER_PADDING}
    gap={FIELD_GAP}
    ariaLabel={"Width"}
    computeTextStyle={computePageTextFieldTextStyle}
>
    {#snippet renderContent(flags)}
        <PageTextFieldContent {flags} width={FIELD_WIDTH} />
    {/snippet}

    {#snippet renderTrailing(flags, stepper)}
        <div class={styles.unitTrailing}>
            <PageTextFieldAdornment {flags}>px</PageTextFieldAdornment>

            <PageNumberInputStepper {flags} {stepper} />
        </div>
    {/snippet}
</NumberInput>
