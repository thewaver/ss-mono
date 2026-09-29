<script lang="ts">
    import { untrack } from "svelte";

    import { SlideButtonUtils, SlideButtonStyles as styles } from "@thewaver/ss-components";

    import { InteractionTrackerSvelteUtils } from "../../Abstracts/InteractionTracker/InteractionTrackerSvelte.utils.svelte.js";
    import { readStore } from "../../Utils/storeUtils.js";
    import { FormFieldSvelteUtils } from "../Input/FormField/FormFieldSvelte.utils.svelte.js";
    import { LabelSvelteUtils } from "../Input/Label/LabelSvelte.utils.svelte.js";
    import type { SlideButtonElementProps } from "./SlideButton.types.js";

    let props: SlideButtonElementProps = $props();

    const getAriaLabel = LabelSvelteUtils.resolveAriaLabel(() => props.ariaLabel);
    const getAriaDescribedBy = FormFieldSvelteUtils.resolveAriaDescribedBy();

    let track = $state<HTMLButtonElement>();

    FormFieldSvelteUtils.registerControl(() => track ?? undefined);

    const isDisabled = $derived(props.flags.isDisabled ?? false);

    const gesture = SlideButtonUtils.createGesture({
        getMode: () => props.mode,
        getThumbSize: () => props.thumbSize,
        getHoldDurationMs: () => props.holdDurationMs,
        getTrackWidth: () => track?.clientWidth ?? 0,
        getProgressRatio: () => props.progressRatio,
        setProgressRatio: (ratio) => props.setProgressRatio(ratio),
        onActivate: () => props.onActivate?.(),
    });

    $effect(() => () => gesture.stopHold());

    const getIsHolding = readStore(gesture, (state) => state.isHolding);
    const getIsGrabbed = readStore(gesture, (state) => state.isGrabbed);

    const { getIsDragging } = InteractionTrackerSvelteUtils.trackDrag(
        () => track ?? undefined,
        () => isDisabled,
        {
            onDrag: (ratio) => gesture.drag(ratio.x),
            onDragEnd: (reason) => gesture.dragEnd(reason),
        },
    );

    $effect(() => {
        const isDragging = getIsDragging() && getIsGrabbed();

        untrack(() => props.setIsDragging(isDragging));
    });

    $effect(() => {
        const isHolding = getIsHolding();

        untrack(() => props.setIsHolding(isHolding));
    });

    $effect(() => {
        if (isDisabled) untrack(() => gesture.reset());
    });
</script>

<button
    bind:this={track}
    {@attach props.attachElement}
    id={props.id}
    type="button"
    class={styles.slideButtonElement}
    aria-label={getAriaLabel()}
    aria-describedby={getAriaDescribedBy()}
    aria-disabled={isDisabled || undefined}
    onkeydown={(e) => {
        if (isDisabled) return;

        gesture.pressKey(e.key, e.repeat);
    }}
    onkeyup={(e) => gesture.releaseKey(e.key)}
    onblur={() => gesture.stopHold()}
    onmouseenter={(e) => {
        if (isDisabled) return;

        props.onMouseEnter?.(e);
    }}
    onmouseleave={(e) => {
        if (isDisabled) return;

        props.onMouseLeave?.(e);
    }}
>
    {@render props.renderContent(props.flags)}
</button>
