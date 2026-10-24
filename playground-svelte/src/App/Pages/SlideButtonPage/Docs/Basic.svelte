<script lang="ts">
    import { SlideButton } from "@thewaver/ss-components-svelte";
    import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

    import PageSlideButtonContent from "../../../StyledComponents/SlideButtonContent/SlideButtonContent.svelte";
    import type { SlideButtonDocsExampleProps } from "../SlideButtonPageSvelte.types";

    type Props = SlideButtonDocsExampleProps;

    let props: Props = $props();

    let sends = $state(0);
</script>

<SlideButton
    ariaDescription={"Hold Enter or Space to send."}
    thumbSize={SLIDE_BUTTON_THUMB_SIZE}
    mode={props.mode}
    completionRatio={props.completionRatio}
    holdDurationMs={props.holdDurationMs}
    isDisabled={props.isDisabled}
    hasError={props.hasError}
    onActivate={() => {
        sends += 1;
    }}
>
    {#snippet renderContent(renderProps)}
        <PageSlideButtonContent {renderProps}>{`Slide or hold (${sends})`}</PageSlideButtonContent>
    {/snippet}
</SlideButton>
