<script lang="ts">
    import { FormField, SlideButton } from "@thewaver/ss-components-svelte";
    import { SLIDE_BUTTON_THUMB_SIZE } from "@thewaver/ss-playground/App/StyledComponents/SlideButtonContent/SlideButtonContent.css";

    import PageFormFieldCaption from "../../../StyledComponents/FormFieldContent/PageFormFieldCaption.svelte";
    import PageFormFieldMessage from "../../../StyledComponents/FormFieldContent/PageFormFieldMessage.svelte";
    import PageSlideButtonContent from "../../../StyledComponents/SlideButtonContent/SlideButtonContent.svelte";
    import type { SlideButtonExampleProps } from "../SlideButtonPage.types";

    const HINT = "Hold the button, or slide it all the way, to send.";

    type Props = SlideButtonExampleProps;

    let props: Props = $props();
</script>

<FormField message={HINT}>
    {#snippet renderCaption()}
        <PageFormFieldCaption>Send the report</PageFormFieldCaption>
    {/snippet}

    {#snippet renderMessage(fieldState)}
        <PageFormFieldMessage state={fieldState}>{HINT}</PageFormFieldMessage>
    {/snippet}

    {#snippet renderControl()}
        <SlideButton ariaLabel={"Send the report"} thumbSize={SLIDE_BUTTON_THUMB_SIZE} onActivate={props.onActivate}>
            {#snippet renderContent(renderProps)}
                <PageSlideButtonContent {renderProps}>Slide or hold to send</PageSlideButtonContent>
            {/snippet}
        </SlideButton>
    {/snippet}
</FormField>
