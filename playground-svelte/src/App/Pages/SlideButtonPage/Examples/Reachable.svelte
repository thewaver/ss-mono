<script lang="ts">
    import { SlideButton } from "@thewaver/ss-components-svelte";
    import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

    import PageSlideButtonContent from "../../../StyledComponents/SlideButtonContent/SlideButtonContent.svelte";
    import PageTooltipContent from "../../../StyledComponents/TooltipContent/TooltipContent.svelte";
    import type { SlideButtonExampleProps } from "../SlideButtonPage.types";

    type Props = SlideButtonExampleProps;

    let props: Props = $props();
</script>

<SlideButton
    isDisabled={true}
    isReachableWhenDisabled={true}
    thumbSize={SLIDE_BUTTON_THUMB_SIZE}
    tooltipDefs={{
        placement: { x: "center", y: "top-out" },
        offset: { x: 0, y: 10 },
        renderContent: tooltip,
    }}
    onActivate={props.onActivate}
>
    {#snippet renderContent(renderProps)}
        <PageSlideButtonContent {renderProps}>Slide or hold to send</PageSlideButtonContent>
    {/snippet}
</SlideButton>

{#snippet tooltip(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    <PageTooltipContent {visibilityTarget} {transitionDurationMs}>
        Focusable so this tooltip can be read, but neither a drag nor a held Enter may leave the count above zero.
    </PageTooltipContent>
{/snippet}
