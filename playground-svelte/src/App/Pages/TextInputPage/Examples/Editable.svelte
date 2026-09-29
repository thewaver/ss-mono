<script lang="ts">
    import { untrack } from "svelte";
    import { on } from "svelte/events";

    import { Button, TextInput } from "@thewaver/ss-components-svelte";
    import {
        FIELD_GAP,
        FIELD_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageInlineEditContent from "../../../StyledComponents/InlineEditContent/InlineEditContent.svelte";
    import PageTextFieldContent, {
        computePageTextFieldTextStyle,
    } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import type { TextInputEditableExampleProps } from "../TextInputPage.types";

    type Props = TextInputEditableExampleProps;

    let { value = $bindable(), editing = $bindable() }: Props = $props();

    let draft = $state("");

    let button = $state<HTMLElement>();
    let input = $state<HTMLElement>();
    let focusedFor = untrack(() => editing);

    const startEditing = () => {
        draft = value;
        editing = true;
    };

    const finishEditing = (isCommitting: boolean) => {
        if (!editing) return;

        if (isCommitting) value = draft;

        editing = false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            finishEditing(true);
        }

        if (e.key === "Escape") {
            e.preventDefault();
            finishEditing(false);
        }
    };

    $effect(() => {
        const target = editing ? input : button;

        if (focusedFor === editing || !target) return;

        focusedFor = editing;

        target.focus();
    });
</script>

{#if !editing}
    <Button bind:ref={button} ariaLabel={`Edit name, ${value}`} onClick={startEditing}>
        {#snippet renderContent(flags)}
            <PageInlineEditContent {flags}>{value}</PageInlineEditContent>
        {/snippet}
    </Button>
{:else}
    <div {@attach (element) => on(element, "keydown", handleKeyDown)} onfocusout={() => finishEditing(true)}>
        <TextInput
            bind:ref={input}
            bind:value={draft}
            padding={FIELD_PADDING}
            gap={FIELD_GAP}
            ariaLabel={"Name"}
            computeTextStyle={computePageTextFieldTextStyle}
        >
            {#snippet renderContent(flags)}
                <PageTextFieldContent {flags} />
            {/snippet}
        </TextInput>
    </div>
{/if}
