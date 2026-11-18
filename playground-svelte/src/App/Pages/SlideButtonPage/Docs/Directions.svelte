<script lang="ts">
    import { SlideButton } from "@thewaver/ss-components-svelte";
    import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

    import PageSlideButtonContent from "../../../StyledComponents/SlideButtonContent/SlideButtonContent.svelte";
    import type { SlideButtonDirectionsDocsExampleProps } from "../SlideButtonPageSvelte.types";
    import { HOLD_ENTER_SPACE_SEND_DESCRIPTION } from "@thewaver/ss-playground/App/Pages/SlideButtonPage/SlideButtonPage.const";

    type Props = SlideButtonDirectionsDocsExampleProps;

    let props: Props = $props();

    let sends = $state(0);
</script>

<div dir={props.direction}>
    <SlideButton
        ariaDescription={HOLD_ENTER_SPACE_SEND_DESCRIPTION}
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
