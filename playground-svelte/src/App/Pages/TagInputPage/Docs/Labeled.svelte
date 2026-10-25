<script lang="ts">
    import { Label, TagInput } from "@thewaver/ss-components-svelte";
    import { computeTagAriaLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import { STARTING_TAGS } from "@thewaver/ss-playground/App/Pages/TagInputPage/TagInputPage.const";
    import {
        FIELD_GAP,
        FIELD_HEIGHT,
        FIELD_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageLabelCaption from "../../../StyledComponents/LabelCaption/LabelCaption.svelte";
    import PageTagContent from "../../../StyledComponents/TagInputContent/PageTagContent.svelte";
    import PageTagInputContent from "../../../StyledComponents/TagInputContent/PageTagInputContent.svelte";
    import PageTagInputPlaceholder from "../../../StyledComponents/TagInputContent/PageTagInputPlaceholder.svelte";
    import { computePageTextFieldTextStyle } from "../../../StyledComponents/TextFieldContent/TextFieldContent.svelte";

    const LABEL_GAP = 5;

    let value = $state.raw(STARTING_TAGS);
</script>

<Label orientation={"vertical"} gap={LABEL_GAP}>
    <PageLabelCaption>Topics</PageLabelCaption>

    <TagInput
        bind:value
        gap={FIELD_GAP}
        padding={FIELD_PADDING}
        minHeight={FIELD_HEIGHT}
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
</Label>
