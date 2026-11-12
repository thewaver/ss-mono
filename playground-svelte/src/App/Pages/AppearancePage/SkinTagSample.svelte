<script lang="ts">
    import { TagInput } from "@thewaver/ss-components-svelte";
    import { computeTagAriaLabel } from "@thewaver/ss-playground/App/PageComponents/Announcements/Announcements.const";
    import { SKIN_SAMPLE_TAGS } from "@thewaver/ss-playground/App/Pages/AppearancePage/AppearancePage.const";
    import {
        FIELD_GAP,
        FIELD_HEIGHT,
        FIELD_PADDING,
    } from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

    import PageTagContent from "../../StyledComponents/TagInputContent/PageTagContent.svelte";
    import PageTagInputContent from "../../StyledComponents/TagInputContent/PageTagInputContent.svelte";
    import PageTagInputPlaceholder from "../../StyledComponents/TagInputContent/PageTagInputPlaceholder.svelte";
    import type { SkinStateProps } from "./AppearancePage.types";

    let props: SkinStateProps = $props();

    let value = $state.raw(SKIN_SAMPLE_TAGS);
</script>

<TagInput
    bind:value
    ariaLabel={props.state}
    gap={FIELD_GAP}
    padding={FIELD_PADDING}
    minHeight={FIELD_HEIGHT}
    isDisabled={props.isDisabled}
    hasError={props.hasError}
    {computeTagAriaLabel}
>
    {#snippet renderContent(flags)}
        <PageTagInputContent {flags} />
    {/snippet}

    {#snippet renderPlaceholder()}
        <PageTagInputPlaceholder>{props.state}</PageTagInputPlaceholder>
    {/snippet}

    {#snippet renderTag(tag, flags)}
        <PageTagContent {flags}>{tag}</PageTagContent>
    {/snippet}
</TagInput>
