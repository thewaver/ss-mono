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
    import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import type { TagInputTooltipDocsExampleProps } from "../TagInputPageSvelte.types";

    type Props = TagInputTooltipDocsExampleProps;

    let props: Props = $props();

    let value = $state.raw(STARTING_TAGS);
</script>

<TagInput
    bind:value
    ariaLabel={"Disabled but reachable topics"}
    gap={FIELD_GAP}
    padding={FIELD_PADDING}
    minHeight={FIELD_HEIGHT}
    isDisabled={props.isDisabled}
    isReachableWhenDisabled={props.isReachableWhenDisabled}
    computeTagAriaLabel={computeTagAriaLabel}
    computeTextStyle={computePageTextFieldTextStyle}
    tooltipDefs={{
        placement: { x: "center", y: "top_out" },
        offset: { x: 0, y: 10 },
        renderContent: tooltip,
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

{#snippet tooltip(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>
        Focusable so this tooltip can be read, but no tag may be added or removed.
    </PageTooltipContent>
{/snippet}
