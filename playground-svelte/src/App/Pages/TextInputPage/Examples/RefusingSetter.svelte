<script lang="ts">
    import { TextInput } from "@thewaver/ss-components-svelte";
    import { PIN_LENGTH } from "@thewaver/ss-playground/App/Pages/TextInputPage/TextInputPage.const";
    import {
        FIELD_GAP,
        FIELD_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import PageTextFieldPlaceholder from "../../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.svelte";
    import type { TextInputExampleProps } from "../TextInputPage.types";

    type Props = TextInputExampleProps;

    let { value = $bindable() }: Props = $props();
</script>

<TextInput
    bind:value
    padding={FIELD_PADDING}
    gap={FIELD_GAP}
    ariaLabel={"PIN"}
    inputMode={"numeric"}
    hasError={value.length > 0 && value.length < PIN_LENGTH}
    onInput={(next) => {
        value = next.replace(/\D/g, "").slice(0, PIN_LENGTH);
    }}
    computeTextStyle={computePageTextFieldTextStyle}
>
    {#snippet renderContent(flags)}
        <PageTextFieldContent {flags} />
    {/snippet}

    {#snippet renderPlaceholder(flags)}
        <PageTextFieldPlaceholder {flags}>Digits only</PageTextFieldPlaceholder>
    {/snippet}
</TextInput>
