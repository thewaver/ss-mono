<script lang="ts">
    import { RANGE_DEFAULTS, type RangeRenderProps, RangeUtils } from "@thewaver/ss-components";

    import InteractionWrapper from "../../../Primitives/InteractionWrapper/InteractionWrapper.svelte";
    import type { RangeProps } from "./Range.types.js";
    import RangeElement from "./RangeElement.svelte";

    let { value = $bindable(), range = $bindable(), ref = $bindable(), ...props }: RangeProps = $props();

    const hasSingle = $derived(value !== undefined);
    const hasPair = $derived(range !== undefined);

    $effect(() => RangeUtils.warnIfAmbiguous(hasSingle, hasPair, { single: "value", pair: "range" }));

    let focusVisibleThumb = $state<number>();

    const orientation = $derived(props.orientation ?? RANGE_DEFAULTS.orientation);
    const min = $derived(props.min ?? RANGE_DEFAULTS.min);
    const max = $derived(props.max ?? RANGE_DEFAULTS.max);
    const step = $derived(props.step ?? RANGE_DEFAULTS.step);
    const thumbSize = $derived(props.thumbSize ?? RANGE_DEFAULTS.thumbSize);

    const values = $derived(RangeUtils.computeValues(range, value, min));
    const ratios = $derived(RangeUtils.computeRatios(values, min, max));

    const extraFlags: RangeRenderProps = $derived({
        orientation,
        values,
        ratios,
        fill: RangeUtils.computeFill(ratios),
        focusVisibleThumb,
    });

    const setValue = (index: number, next: number) => {
        const nextValues = values.map((held, at) => (at === index ? next : held));

        if (range) {
            range = RangeUtils.computeMovedRange(range, index, next);
        } else {
            value = next;
        }

        props.onInput?.(nextValues);
    };
</script>

<InteractionWrapper {...props} bind:ref {extraFlags}>
    {#snippet renderControl(attachElement, flags)}
        <RangeElement
            {attachElement}
            id={props.id}
            name={props.name}
            ariaLabel={props.ariaLabel}
            thumbLabels={props.thumbLabels}
            isRequired={props.isRequired}
            {orientation}
            {min}
            {max}
            {step}
            {thumbSize}
            {flags}
            {values}
            isTabbable={props.isTabbable}
            {setValue}
            setFocusVisibleThumb={(index) => {
                focusVisibleThumb = index;
            }}
            renderContent={props.renderContent}
            computeValueText={props.computeValueText}
            computeValueAtPoint={props.computeValueAtPoint}
            onChangeEnd={props.onChangeEnd}
            onMouseEnter={props.onMouseEnter}
            onMouseLeave={props.onMouseLeave}
        />
    {/snippet}
</InteractionWrapper>
