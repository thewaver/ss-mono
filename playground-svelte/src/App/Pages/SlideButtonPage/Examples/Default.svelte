<script lang="ts">
    import { SlideButton } from "@thewaver/ss-components-svelte";
    import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

    import PageSlideButtonContent from "../../../StyledComponents/SlideButtonContent/SlideButtonContent.svelte";
    import type { SlideButtonExampleProps } from "../SlideButtonPage.types";

    type Props = SlideButtonExampleProps & { progress?: number };

    let { progress = $bindable(), ...props }: Props = $props();
</script>

<SlideButton thumbSize={SLIDE_BUTTON_THUMB_SIZE} bind:progress onActivate={props.onActivate}>
    {#snippet renderContent(renderProps)}
        <PageSlideButtonContent {renderProps}>Slide or hold to send</PageSlideButtonContent>
    {/snippet}
</SlideButton>
