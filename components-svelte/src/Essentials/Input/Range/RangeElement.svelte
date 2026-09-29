<script lang="ts">
    import { untrack } from "svelte";

    import { InteractionTrackerUtils, RangeUtils, RangeStyles as styles } from "@thewaver/ss-components";
    import { assignInlineVars } from "@vanilla-extract/dynamic";

    import { InteractionTrackerSvelteUtils } from "../../../Abstracts/InteractionTracker/InteractionTrackerSvelte.utils.svelte.js";
    import { NavigatorSvelteUtils } from "../../../Abstracts/Navigator/NavigatorSvelte.utils.svelte.js";
    import { toStyle } from "../../../Utils/styleUtils.js";
    import { FormFieldSvelteUtils } from "../FormField/FormFieldSvelte.utils.svelte.js";
    import { LabelSvelteUtils } from "../Label/LabelSvelte.utils.svelte.js";
    import type { RangeElementProps } from "./Range.types.js";

    const readFocusVisibleThumb = (element: HTMLElement, index: number) =>
        InteractionTrackerUtils.computeIsFocusVisible(element) ? index : undefined;

    let props: RangeElementProps = $props();

    const getAriaLabel = LabelSvelteUtils.resolveAriaLabel(() => props.ariaLabel);
    const getAriaDescribedBy = FormFieldSvelteUtils.resolveAriaDescribedBy();

    let elements = $state<(HTMLInputElement | null | undefined)[]>([]);
    let activeThumb = $state(0);

    const first = $derived(elements[0] ?? undefined);
    const count = $derived(props.values.length);
    const isDisabled = $derived(props.flags.isDisabled ?? false);

    const getDirection = NavigatorSvelteUtils.createDirection(() => first);

    const thumbs = RangeUtils.createThumbs({
        getValues: () => props.values,
        getScale: () => ({
            orientation: props.orientation,
            direction: getDirection(),
            min: props.min,
            max: props.max,
            step: props.step,
            thumbSize: props.thumbSize,
        }),
        getIsDisabled: () => isDisabled,
        getComputeValueAtPoint: () => props.computeValueAtPoint,
        getElement: (index) => elements[index] ?? undefined,
        setValue: (index, value) => props.setValue(index, value),
        setActiveThumb: (index) => {
            activeThumb = index;
        },
        onChangeEnd: (values) => props.onChangeEnd?.(values),
    });

    $effect(() => {
        const inputs = elements.slice(0, count);

        props.values;
        props.min;
        props.max;

        untrack(() => {
            inputs.forEach((input, index) => {
                if (input) thumbs.syncElement(input, index);
            });
        });
    });

    FormFieldSvelteUtils.registerControl(() => first);

    InteractionTrackerSvelteUtils.wrapExtraControls(
        () => elements.slice(1, count).map((element) => element ?? undefined),
        () => isDisabled,
        { getIsTabbable: () => props.isTabbable ?? true },
    );

    const thumbSizeStyle = $derived(assignInlineVars({ [styles.thumbSizeVar]: `${props.thumbSize}px` }));
</script>

{@render props.renderContent(props.flags)}

{#each props.values as value, index (index)}
    {@const bounds = RangeUtils.computeThumbBounds(props.values, index, props.min, props.max)}

    <input
        bind:this={elements[index]}
        {@attach index === 0 && props.attachElement}
        id={RangeUtils.suffixForThumb(props.id, index, count)}
        type="range"
        name={RangeUtils.suffixForThumb(props.name, index, count)}
        class={[
            styles.rangeElement,
            styles.rangeOrientationVariants[props.orientation],
            props.computeValueAtPoint && styles.rangeElementTracked,
        ]}
        style={toStyle(thumbSizeStyle, { zIndex: index === activeThumb ? 1 : undefined })}
        min={bounds.min}
        max={bounds.max}
        step={props.step}
        aria-label={props.thumbLabels?.[index] ?? getAriaLabel()}
        aria-valuetext={props.computeValueText?.(value, index)}
        aria-describedby={getAriaDescribedBy()}
        aria-orientation={props.orientation === "vertical" ? "vertical" : undefined}
        aria-disabled={isDisabled || undefined}
        aria-required={props.isRequired || undefined}
        aria-invalid={props.flags.hasError || undefined}
        onpointerdown={(e) => thumbs.handlePointerDown(e, e.currentTarget)}
        onpointermove={(e) => thumbs.handlePointerMove(e, e.currentTarget)}
        onpointerup={(e) => thumbs.handlePointerEnd(e)}
        onpointercancel={(e) => thumbs.handlePointerEnd(e)}
        onlostpointercapture={(e) => thumbs.handlePointerEnd(e)}
        onfocus={(e) => props.setFocusVisibleThumb(readFocusVisibleThumb(e.currentTarget, index))}
        onkeydown={(e) => {
            thumbs.handleKeyDown();
            props.setFocusVisibleThumb(readFocusVisibleThumb(e.currentTarget, index));
        }}
        onblur={() => props.setFocusVisibleThumb(undefined)}
        oninput={(e) => thumbs.handleInput(e.currentTarget, index)}
        onchange={() => thumbs.handleChange()}
        onmouseenter={(e) => {
            if (isDisabled) return;

            props.onMouseEnter?.(e);
        }}
        onmouseleave={(e) => {
            if (isDisabled) return;

            props.onMouseLeave?.(e);
        }}
    />
{/each}
