<script lang="ts">
    import { SlideButton } from "@thewaver/ss-components-svelte";
    import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

    import PageSlideButtonContent from "../../../StyledComponents/SlideButtonContent/SlideButtonContent.svelte";
    import type { SlideButtonExampleProps } from "../SlideButtonPage.types";

    type Props = SlideButtonExampleProps;

    const HOLD_DURATION_MS = 2000;

    let props: Props = $props();
</script>

<SlideButton
    mode={"hold"}
    holdDurationMs={HOLD_DURATION_MS}
    thumbSize={SLIDE_BUTTON_THUMB_SIZE}
    onActivate={props.onActivate}
>
    {#snippet renderContent(renderProps)}
        <PageSlideButtonContent {renderProps}>Hold to send</PageSlideButtonContent>
    {/snippet}
</SlideButton>
