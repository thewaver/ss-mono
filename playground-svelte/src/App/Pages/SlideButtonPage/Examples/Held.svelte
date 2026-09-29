<script lang="ts">
    import { Button, SlideButton } from "@thewaver/ss-components-svelte";
    import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

    import PageControlColumn from "../../../PageComponents/ControlRow/PageControlColumn.svelte";
    import PageButtonContent from "../../../StyledComponents/ButtonContent/ButtonContent.svelte";
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

    <Button isDisabled={!props.isArmed} onClick={props.onReset}>
        {#snippet renderContent(renderProps)}
            <PageButtonContent flags={renderProps}>Reset</PageButtonContent>
        {/snippet}
    </Button>
</PageControlColumn>
