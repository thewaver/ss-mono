<script lang="ts">
    import { Button, TextInput } from "@thewaver/ss-components-svelte";
    import {
        FIELD_GAP,
        FIELD_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageTextFieldAdornment from "../../../StyledComponents/TextFieldAdornment/TextFieldAdornment.svelte";
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
    ariaLabel={"Amount"}
    inputMode={"decimal"}
    computeTextStyle={computePageTextFieldTextStyle}
>
    {#snippet renderContent(flags)}
        <PageTextFieldContent {flags} />
    {/snippet}

    {#snippet renderPlaceholder(flags)}
        <PageTextFieldPlaceholder {flags}>0.00</PageTextFieldPlaceholder>
    {/snippet}

    {#snippet renderLeading(flags)}
        <PageTextFieldAdornment {flags}>USD</PageTextFieldAdornment>
    {/snippet}

    {#snippet renderTrailing()}
        <Button
            isDisabled={value === ""}
            onClick={() => {
                value = "";
            }}
        >
            {#snippet renderContent(flags)}
                <PageTextFieldAdornment {flags}>Clear</PageTextFieldAdornment>
            {/snippet}
        </Button>
    {/snippet}
</TextInput>
