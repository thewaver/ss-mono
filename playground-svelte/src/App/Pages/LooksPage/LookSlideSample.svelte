<script lang="ts">
    import { SlideButton } from "@thewaver/ss-components-svelte";
    import { LOOK_SAMPLE_SLIDE_DESCRIPTION } from "@thewaver/ss-playground/App/Pages/LooksPage/LooksPage.const";
    import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

    import PageSlideButtonContent from "../../StyledComponents/SlideButtonContent/SlideButtonContent.svelte";
    import type { LookStateProps } from "./LooksPage.types";

    let props: LookStateProps = $props();
</script>

<SlideButton
    ariaDescription={LOOK_SAMPLE_SLIDE_DESCRIPTION}
    thumbSize={SLIDE_BUTTON_THUMB_SIZE}
    isDisabled={props.isDisabled}
    hasError={props.hasError}
>
    {#snippet renderContent(renderProps)}
        <PageSlideButtonContent {renderProps}>{props.state}</PageSlideButtonContent>
    {/snippet}
</SlideButton>
