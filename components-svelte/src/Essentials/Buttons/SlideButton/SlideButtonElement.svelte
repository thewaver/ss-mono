<script lang="ts">
    import { untrack } from "svelte";

    import { SlideButtonUtils, SlideButtonStyles as styles } from "@thewaver/ss-components";

    import { InteractionTrackerSvelteUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerSvelte.utils.svelte.js";
    import { NavigatorSvelteUtils } from "../../../Abstracts/Navigator/NavigatorSvelte.utils.svelte.js";
    import { readStore } from "../../../Utils/storeUtils.js";
    import { FormFieldSvelteUtils } from "../../Input/FormField/FormFieldSvelte.utils.svelte.js";
    import { LabelSvelteUtils } from "../../Input/Label/LabelSvelte.utils.svelte.js";
    import type { SlideButtonElementProps } from "./SlideButton.types.js";

    let props: SlideButtonElementProps = $props();

    const getAriaLabel = LabelSvelteUtils.resolveAriaLabel(() => props.ariaLabel);
    const getAriaDescribedBy = FormFieldSvelteUtils.resolveAriaDescribedBy();

    let track = $state<HTMLButtonElement>();

    FormFieldSvelteUtils.registerControl(() => track ?? undefined);

    const getDirection = NavigatorSvelteUtils.createDirection(() => track ?? undefined);

    const isDisabled = $derived(props.flags.isDisabled ?? false);

    const gesture = SlideButtonUtils.createGesture({
        getMode: () => props.mode,
        getOrientation: () => props.orientation,
        getDirection,
        getThumbSize: () => props.thumbSize,
        getHoldDurationMs: () => props.holdDurationMs,
        getCompletionRatio: () => props.completionRatio,
        getTrackSize: () => ({ width: track?.clientWidth ?? 0, height: track?.clientHeight ?? 0 }),
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
            onDrag: (ratio) => gesture.drag(ratio),
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
        const direction = getDirection();

        untrack(() => props.setDirection(direction));
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
    onclick={() => {
        if (isDisabled) return;

        gesture.click();
    }}
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
