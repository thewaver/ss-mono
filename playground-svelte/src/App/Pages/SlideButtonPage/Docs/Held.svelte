<script lang="ts">
    import { Button, SlideButton } from "@thewaver/ss-components-svelte";
    import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";
    import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

    import PageControlRow from "../../../PageComponents/ControlRow/PageControlRow.svelte";
    import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
    import PageSlideButtonContent from "../../../StyledComponents/SlideButtonContent/SlideButtonContent.svelte";

    let isArmed = $state(false);
</script>

<PageControlRow>
    <SlideButton
        ariaDescription={"Hold Enter or Space to arm."}
        isPressed={isArmed}
        thumbSize={SLIDE_BUTTON_THUMB_SIZE}
        onActivate={() => {
            isArmed = true;
        }}
    >
        {#snippet renderContent(renderProps)}
            <PageSlideButtonContent {renderProps}>Slide or hold to arm</PageSlideButtonContent>
        {/snippet}
    </SlideButton>

    <Button
        isDisabled={!isArmed}
        ariaLabel={"Reset"}
        onClick={() => {
            isArmed = false;
        }}
    >
        {#snippet renderContent(flags)}
            <PageControlButtonContent {flags} glyph={CONTROL_GLYPHS.replay} />
        {/snippet}
    </Button>
</PageControlRow>
