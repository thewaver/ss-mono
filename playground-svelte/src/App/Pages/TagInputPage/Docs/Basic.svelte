<script lang="ts">
    import { TagInput } from "@thewaver/ss-components-svelte";
    import { computeTagAriaLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import { STARTING_TAGS } from "@thewaver/ss-playground/App/Pages/TagInputPage/TagInputPage.const";
    import {
        FIELD_GAP,
        FIELD_HEIGHT,
        FIELD_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageTagContent from "../../../StyledComponents/TagInputContent/PageTagContent.svelte";
    import PageTagInputContent from "../../../StyledComponents/TagInputContent/PageTagInputContent.svelte";
    import PageTagInputPlaceholder from "../../../StyledComponents/TagInputContent/PageTagInputPlaceholder.svelte";
    import { computePageTextFieldTextStyle } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";
    import type { TagInputBasicDocsExampleProps } from "../TagInputPageSvelte.types";

    type Props = TagInputBasicDocsExampleProps;

    let props: Props = $props();

    let value = $state.raw(STARTING_TAGS);
</script>

<TagInput
    bind:value
    ariaLabel={"Topics"}
    gap={FIELD_GAP}
    padding={FIELD_PADDING}
    minHeight={FIELD_HEIGHT}
    hasError={props.hasError}
    isDisabled={props.isDisabled}
    computeTagAriaLabel={computeTagAriaLabel}
    computeTextStyle={computePageTextFieldTextStyle}
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
