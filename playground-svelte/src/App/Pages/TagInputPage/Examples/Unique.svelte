<script lang="ts">
    import { TagInput } from "@thewaver/ss-components-svelte";
    import {
        FIELD_GAP,
        FIELD_HEIGHT,
        FIELD_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageTagContent from "../../../StyledComponents/TagInputContent/PageTagContent.svelte";
    import PageTagInputContent from "../../../StyledComponents/TagInputContent/PageTagInputContent.svelte";
    import PageTagInputPlaceholder from "../../../StyledComponents/TagInputContent/PageTagInputPlaceholder.svelte";
    import { computePageTextFieldTextStyle } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import type { TagInputExampleProps } from "../TagInputPage.types";

    type Props = TagInputExampleProps;

    let { value = $bindable(), ...props }: Props = $props();
</script>

<TagInput
    bind:value
    ariaLabel={"Unique topics"}
    gap={FIELD_GAP}
    padding={FIELD_PADDING}
    minHeight={FIELD_HEIGHT}
    isDisabled={props.isDisabled}
    hasError={props.hasError}
    computeTextStyle={computePageTextFieldTextStyle}
    computeTag={(text) => {
        const tag = text.trim().toLowerCase();

        return tag && !value.includes(tag) ? tag : undefined;
    }}
>
    {#snippet renderContent(flags)}
        <PageTagInputContent {flags} />
    {/snippet}

    {#snippet renderPlaceholder()}
        <PageTagInputPlaceholder>Type and press Enter</PageTagInputPlaceholder>
    {/snippet}

    {#snippet renderTag(tag, flags)}
        <PageTagContent {flags}>{tag}</PageTagContent>
    {/snippet}
</TagInput>
