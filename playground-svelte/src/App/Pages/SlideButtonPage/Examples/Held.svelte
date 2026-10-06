<script lang="ts">
    import { Button, SlideButton } from "@thewaver/ss-components-svelte";
    import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";
    import { CONTROL_GLYPHS } from "@thewaver/ss-playground/App/StyledComponents/ControlButtonContent/ControlButtonContent.const";

    import PageControlColumn from "../../../PageComponents/ControlRow/PageControlColumn.svelte";
    import PageControlButtonContent from "../../../StyledComponents/ControlButtonContent/ControlButtonContent.svelte";
    import PageSlideButtonContent from "../../../StyledComponents/SlideButtonContent/SlideButtonContent.svelte";
    import type { SlideButtonHeldExampleProps } from "../SlideButtonPage.types";

    type Props = SlideButtonHeldExampleProps;

    let props: Props = $props();
</script>

<PageControlColumn>
    <SlideButton isPressed={props.isArmed} thumbSize={SLIDE_BUTTON_THUMB_SIZE} onActivate={props.onActivate}>
        {#snippet renderContent(renderProps)}
            <PageSlideButtonContent {renderProps}>Slide or hold to arm</PageSlideButtonContent>
        {/snippet}
    </SlideButton>

    <Button ariaLabel={"Reset"} isDisabled={!props.isArmed} onClick={props.onReset}>
        {#snippet renderContent(renderProps)}
            <PageControlButtonContent flags={renderProps} glyph={CONTROL_GLYPHS.replay} />
        {/snippet}
    </Button>
</PageControlColumn>
