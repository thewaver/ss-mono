<script lang="ts">
    import { SLIDE_BUTTON_DEFAULTS, type SlideButtonRenderProps } from "@thewaver/ss-components";

    import InteractionWrapper from "../../Primitives/InteractionWrapper/InteractionWrapper.svelte";
    import type { SlideButtonProps } from "./SlideButton.types.js";
    import SlideButtonElement from "./SlideButtonElement.svelte";

    const RATIO_MIN = 0;

    let { progress = $bindable(RATIO_MIN), ref = $bindable(), ...props }: SlideButtonProps = $props();

    let isDragging = $state(false);
    let isHolding = $state(false);

    const extraFlags: SlideButtonRenderProps = $derived({ progressRatio: progress, isDragging, isHolding });
</script>

<InteractionWrapper {...props} bind:ref {extraFlags}>
    {#snippet renderControl(attachElement, flags)}
        <SlideButtonElement
            {attachElement}
            id={props.id}
            ariaLabel={props.ariaLabel}
            thumbSize={props.thumbSize ?? SLIDE_BUTTON_DEFAULTS.thumbSize}
            holdDurationMs={props.holdDurationMs ?? SLIDE_BUTTON_DEFAULTS.holdDurationMs}
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
            onActivate={props.onActivate}
            onMouseEnter={props.onMouseEnter}
            onMouseLeave={props.onMouseLeave}
        />
    {/snippet}
</InteractionWrapper>
