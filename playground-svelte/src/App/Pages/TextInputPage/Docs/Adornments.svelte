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

    let value = $state("");
</script>

<TextInput
    bind:value
    padding={FIELD_PADDING}
    gap={FIELD_GAP}
    ariaLabel={"Username"}
    autoComplete={"username"}
    computeTextStyle={computePageTextFieldTextStyle}
>
    {#snippet renderContent(flags)}
        <PageTextFieldContent {flags} />
    {/snippet}

    {#snippet renderPlaceholder(flags)}
        <PageTextFieldPlaceholder {flags}>Username</PageTextFieldPlaceholder>
    {/snippet}

    {#snippet renderLeading(flags)}
        <PageTextFieldAdornment {flags}>
            <span aria-hidden="true">👤︎</span>
        </PageTextFieldAdornment>
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
