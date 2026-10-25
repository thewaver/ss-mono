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
    let reveal = $state(false);
</script>

<TextInput
    bind:value
    padding={FIELD_PADDING}
    gap={FIELD_GAP}
    type={reveal ? "text" : "password"}
    ariaLabel={"Password"}
    autoComplete={"current-password"}
    computeTextStyle={computePageTextFieldTextStyle}
>
    {#snippet renderContent(flags)}
        <PageTextFieldContent {flags} />
    {/snippet}

    {#snippet renderPlaceholder(flags)}
        <PageTextFieldPlaceholder {flags}>Password</PageTextFieldPlaceholder>
    {/snippet}

    {#snippet renderTrailing()}
        <Button
            onClick={() => {
                reveal = !reveal;
            }}
        >
            {#snippet renderContent(flags)}
                <PageTextFieldAdornment {flags}>{reveal ? "Hide" : "Show"}</PageTextFieldAdornment>
            {/snippet}
        </Button>
    {/snippet}
</TextInput>
