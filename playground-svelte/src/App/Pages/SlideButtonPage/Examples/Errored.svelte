<script lang="ts">
    import { SlideButton } from "@thewaver/ss-components-svelte";
    import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

    import PageSlideButtonContent from "../../../StyledComponents/SlideButtonContent/SlideButtonContent.svelte";
    import type { SlideButtonErroredExampleProps } from "../SlideButtonPage.types";

    type Props = SlideButtonErroredExampleProps;

    let props: Props = $props();
</script>

<SlideButton hasError={props.hasError} thumbSize={SLIDE_BUTTON_THUMB_SIZE} onActivate={props.onActivate}>
    {#snippet renderContent(renderProps)}
        <PageSlideButtonContent {renderProps}>Slide or hold to retry</PageSlideButtonContent>
    {/snippet}
</SlideButton>
