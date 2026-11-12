<script lang="ts">
    import { untrack } from "svelte";

    import { Button, TextInput } from "@thewaver/ss-components-svelte";
    import {
        FIELD_GAP,
        FIELD_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";
    import person from "@thewaver/ss-playground/App/person.svg";

    import PageIcon from "../../StyledComponents/Icon/Icon.svelte";
    import PageTextFieldAdornment from "../../StyledComponents/TextFieldAdornment/TextFieldAdornment.svelte";
    import PageTextFieldButtonContent from "../../StyledComponents/TextFieldButtonContent/TextFieldButtonContent.svelte";
    import PageTextFieldContent from "../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import type { SkinStateProps } from "./AppearancePage.types";

    let props: SkinStateProps = $props();

    let value = $state(untrack(() => props.state));
</script>

<TextInput
    bind:value
    padding={FIELD_PADDING}
    gap={FIELD_GAP}
    isReadOnly={props.isReadOnly}
    isDisabled={props.isDisabled}
    hasError={props.hasError}
    ariaLabel={props.state}
>
    {#snippet renderContent(flags)}
        <PageTextFieldContent {flags} />
    {/snippet}

    {#snippet renderLeading(flags)}
        <PageTextFieldAdornment {flags}>
            <PageIcon src={person} />
        </PageTextFieldAdornment>
    {/snippet}

    {#snippet renderTrailing()}
        <Button isDisabled={props.isDisabled}>
            {#snippet renderContent(flags)}
                <PageTextFieldButtonContent {flags}>Clear</PageTextFieldButtonContent>
            {/snippet}
        </Button>
    {/snippet}
</TextInput>
