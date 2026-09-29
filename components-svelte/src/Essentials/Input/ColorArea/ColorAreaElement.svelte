<script lang="ts">
    import { untrack } from "svelte";

    import {
        type ColorAreaAxis,
        ColorAreaUtils,
        InteractionTrackerUtils,
        ColorAreaStyles as styles,
    } from "@thewaver/ss-components";

    import { InteractionTrackerSvelteUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerSvelte.utils.svelte.js";
    import { LabelSvelteUtils } from "../Label/LabelSvelte.utils.svelte.js";
    import type { ColorAreaElementProps } from "./ColorArea.types.js";

    const readFocusVisibleAxis = (element: HTMLElement, axis: ColorAreaAxis) =>
        InteractionTrackerUtils.computeIsFocusVisible(element) ? axis : undefined;

    let props: ColorAreaElementProps = $props();

    const getAriaLabel = LabelSvelteUtils.resolveAriaLabel(() => props.ariaLabel);

    let surface = $state<HTMLDivElement>();
    let axisElements = $state<Partial<Record<ColorAreaAxis, HTMLInputElement | null>>>({});
    let isPressed = false;

    const isDisabled = $derived(props.flags.isDisabled ?? false);

    const { getIsDragging } = InteractionTrackerSvelteUtils.trackDrag(
        () => surface ?? undefined,
        () => isDisabled,
        {
            onDrag: (ratio) => {
                isPressed = true;
                props.setDragged(ratio);
                axisElements.saturation?.focus();
            },
            onDragEnd: () => {
                isPressed = false;
            },
        },
    );

    $effect(() => {
        if (!getIsDragging()) isPressed = false;
    });

    $effect(() => {
        const isDragging = getIsDragging();

        untrack(() => props.setIsDragging(isDragging));
    });

    $effect(() => {
        const hsv = props.hsv;

        for (const axis of ColorAreaUtils.AXES) {
            const element = axisElements[axis];

            if (element) untrack(() => ColorAreaUtils.syncAxis(element, hsv, axis));
        }
    });

    InteractionTrackerSvelteUtils.wrapExtraControls(
        () => ColorAreaUtils.AXES.map((axis) => axisElements[axis] ?? undefined),
        () => isDisabled,
        { getIsTabbable: () => props.isTabbable ?? true },
    );
</script>

<div
    bind:this={surface}
    {@attach props.attachElement}
    id={props.id}
    class={styles.colorAreaSurface}
    role="group"
    aria-label={getAriaLabel()}
    aria-disabled={isDisabled || undefined}
    aria-invalid={props.flags.hasError || undefined}
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

    {#each ColorAreaUtils.AXES as axis (axis)}
        <input
            bind:this={axisElements[axis]}
            type="range"
            name={props.name && `${props.name}-${axis}`}
            class={styles.colorAreaAxis}
            min={ColorAreaUtils.AXIS_MIN}
            max={ColorAreaUtils.AXIS_MAX}
            step={props.step}
            aria-label={props.axisLabels[axis]}
            aria-valuetext={ColorAreaUtils.computeValueText(props.hsv, axis)}
            aria-disabled={isDisabled || undefined}
            oninput={(e) => {
                const element = e.currentTarget;

                if (!isDisabled) props.setAxis(axis, Number(element.value));

                ColorAreaUtils.syncAxis(element, props.hsv, axis);
            }}
            onfocus={(e) =>
                props.setFocusVisibleAxis(isPressed ? undefined : readFocusVisibleAxis(e.currentTarget, axis))}
            onkeydown={(e) => props.setFocusVisibleAxis(readFocusVisibleAxis(e.currentTarget, axis))}
            onblur={() => props.setFocusVisibleAxis(undefined)}
        />
    {/each}
</div>
