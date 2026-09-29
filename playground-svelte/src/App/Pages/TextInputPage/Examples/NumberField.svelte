<script lang="ts">
    import { TextInput } from "@thewaver/ss-components-svelte";
    import {
        QUANTITY_MAX,
        QUANTITY_MIN,
        QUANTITY_STEP,
    } from "@thewaver/ss-playground/App/Pages/TextInputPage/TextInputPage.const";
    import {
        FIELD_GAP,
        FIELD_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import type { TextInputExampleProps } from "../TextInputPage.types";

    type Props = TextInputExampleProps;

    let { value = $bindable() }: Props = $props();
</script>

<TextInput
    bind:value
    padding={FIELD_PADDING}
    gap={FIELD_GAP}
    type={"number"}
    ariaLabel={"Quantity"}
    min={QUANTITY_MIN}
    max={QUANTITY_MAX}
    step={QUANTITY_STEP}
    computeTextStyle={computePageTextFieldTextStyle}
>
    {#snippet renderContent(flags)}
        <PageTextFieldContent {flags} />
    {/snippet}
</TextInput>
