<script lang="ts">
    import type { InteractionFlags, TextFieldFlags } from "@thewaver/ss-components-svelte";
    import { Button, TextInput } from "@thewaver/ss-components-svelte";
    import { EMPTY_TEXT } from "@thewaver/ss-playground/App/PageComponents/Field/Field.const";
    import {
        FIELD_GAP,
        FIELD_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageSelectClear from "../../StyledComponents/SelectClear/SelectClear.svelte";
    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import PageTextFieldPlaceholder from "../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder.svelte";
    import { useFieldReset } from "./FieldSvelte.context";
    import type { PageTextFieldProps } from "./FieldSvelte.types";

    let props: PageTextFieldProps = $props();

    let fieldRef = $state<HTMLElement>();

    useFieldReset(
        () => props.value,
        (value) => props.onInput(value),
    );

    const clear = () => {
        props.onInput(EMPTY_TEXT);
        fieldRef?.focus();
    };
</script>

<TextInput
    bind:ref={fieldRef}
    bind:value={() => props.value, props.onInput}
    isDisabled={props.isDisabled}
    ariaLabel={props.ariaLabel}
    padding={FIELD_PADDING}
    gap={FIELD_GAP}
    computeTextStyle={computePageTextFieldTextStyle}
    renderPlaceholder={props.placeholder === undefined ? undefined : renderPlaceholder}
    renderTrailing={props.clearAriaLabel === undefined ? undefined : renderTrailing}
>
    {#snippet renderContent(flags)}
        <PageTextFieldContent {flags} width={props.width} />
    {/snippet}
</TextInput>

{#snippet renderTrailing()}
    {#if props.value !== EMPTY_TEXT}
        <Button ariaLabel={props.clearAriaLabel} onClick={clear}>
            {#snippet renderContent(flags)}
                <PageSelectClear {flags} />
            {/snippet}
        </Button>
    {/if}
{/snippet}

{#snippet renderPlaceholder(flags: InteractionFlags<TextFieldFlags>)}
    <PageTextFieldPlaceholder {flags}>{props.placeholder}</PageTextFieldPlaceholder>
{/snippet}
