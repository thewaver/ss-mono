<script lang="ts">
    import { SlideButton } from "@thewaver/ss-components-svelte";
    import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

    import PageSlideButtonContent from "../../../StyledComponents/SlideButtonContent/SlideButtonContent.svelte";
    import type { SlideButtonDirectionsDocsExampleProps } from "../SlideButtonPageSvelte.types";

    type Props = SlideButtonDirectionsDocsExampleProps;

    let props: Props = $props();

    let sends = $state(0);
</script>

<div dir={props.direction}>
    <SlideButton
        ariaDescription={"Hold Enter or Space to send."}
        orientation={props.orientation}
        thumbSize={SLIDE_BUTTON_THUMB_SIZE}
        onActivate={() => {
            sends += 1;
        }}
    >
        {#snippet renderContent(renderProps)}
            <PageSlideButtonContent {renderProps}>{`Slide or hold (${sends})`}</PageSlideButtonContent>
        {/snippet}
    </SlideButton>
</div>
