<script lang="ts">
    import type { InteractionFlags, TextFieldFlags } from "@thewaver/ss-components-svelte";
    import { TextInput } from "@thewaver/ss-components-svelte";
    import {
        FIELD_GAP,
        FIELD_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import PageTextFieldPlaceholder from "../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.svelte";
    import { useFieldReset } from "./Field.context";
    import type { PageTextFieldProps } from "./Field.types";

    let props: PageTextFieldProps = $props();

    useFieldReset(
        () => props.value,
        (value) => props.onInput(value),
    );
</script>

<TextInput
    bind:value={() => props.value, props.onInput}
    isDisabled={props.isDisabled}
    ariaLabel={props.ariaLabel}
    padding={FIELD_PADDING}
    gap={FIELD_GAP}
    computeTextStyle={computePageTextFieldTextStyle}
    renderPlaceholder={props.placeholder === undefined ? undefined : renderPlaceholder}
>
    {#snippet renderContent(flags)}
        <PageTextFieldContent {flags} width={props.width} />
    {/snippet}
</TextInput>

{#snippet renderPlaceholder(flags: InteractionFlags<TextFieldFlags>)}
    <PageTextFieldPlaceholder {flags}>{props.placeholder}</PageTextFieldPlaceholder>
{/snippet}
