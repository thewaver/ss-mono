<script lang="ts">
    import { type NavigatorDirection, SLIDE_BUTTON_DEFAULTS, type SlideButtonRenderProps } from "@thewaver/ss-components";
    import { SlideButtonConst } from "@thewaver/ss-components/internal";

    import InteractionWrapper from "../../../Primitives/InteractionWrapper/InteractionWrapper.svelte";
    import type { SlideButtonProps } from "./SlideButton.types.js";
    import SlideButtonElement from "./SlideButtonElement.svelte";

    let { progress = $bindable(SlideButtonConst.RATIO_MIN), ref = $bindable(), ...props }: SlideButtonProps = $props();

    let isDragging = $state(false);
    let isHolding = $state(false);
    let direction = $state<NavigatorDirection>("ltr");

    const orientation = $derived(props.orientation ?? SLIDE_BUTTON_DEFAULTS.orientation);

    const extraFlags: SlideButtonRenderProps = $derived({
        orientation,
        direction,
        progressRatio: progress,
        isDragging,
        isHolding,
    });
</script>

<InteractionWrapper {...props} bind:ref {extraFlags}>
    {#snippet renderControl(attachElement, flags)}
        <SlideButtonElement
            {attachElement}
            id={props.id}
            ariaLabel={props.ariaLabel}
            {orientation}
            thumbSize={props.thumbSize ?? SLIDE_BUTTON_DEFAULTS.thumbSize}
            holdDurationMs={props.holdDurationMs ?? SLIDE_BUTTON_DEFAULTS.holdDurationMs}
            completionRatio={props.completionRatio ?? SLIDE_BUTTON_DEFAULTS.completionRatio}
            mode={props.mode ?? SLIDE_BUTTON_DEFAULTS.mode}
            {flags}
            progressRatio={progress}
            renderContent={props.renderContent}
            setProgressRatio={(ratio) => {
                progress = ratio;
            }}
            setIsDragging={(next) => {
                isDragging = next;
            }}
            setIsHolding={(next) => {
                isHolding = next;
            }}
            setDirection={(next) => {
                direction = next;
            }}
            onActivate={props.onActivate}
            onMouseEnter={props.onMouseEnter}
            onMouseLeave={props.onMouseLeave}
        />
    {/snippet}
</InteractionWrapper>
