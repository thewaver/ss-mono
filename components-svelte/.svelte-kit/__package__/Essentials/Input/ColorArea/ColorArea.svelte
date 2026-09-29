<script lang="ts">
    import {
        COLOR_AREA_DEFAULTS,
        type ColorAreaAxis,
        type ColorAreaRenderProps,
        ColorAreaUtils,
    } from "@thewaver/ss-components";
    import type { Color } from "@thewaver/ss-utils";

    import InteractionWrapper from "../../../Primitives/InteractionWrapper/InteractionWrapper.svelte";
    import type { ColorAreaProps } from "./ColorArea.types.js";
    import ColorAreaElement from "./ColorAreaElement.svelte";

    let { hsv = $bindable(), ref = $bindable(), ...props }: ColorAreaProps = $props();

    let focusVisibleAxis = $state<ColorAreaAxis>();
    let isDragging = $state(false);

    const writeHsv = (next: Color.HSVA) => {
        hsv = next;

        props.onInput?.(next);
    };

    const extraFlags: ColorAreaRenderProps = $derived({ hsv, isDragging, focusVisibleAxis });
</script>

<InteractionWrapper {...props} bind:ref isTabbable={false} {extraFlags}>
    {#snippet renderControl(attachElement, flags)}
        <ColorAreaElement
            {attachElement}
            id={props.id}
            name={props.name}
            ariaLabel={props.ariaLabel}
            axisLabels={props.axisLabels}
            step={props.step ?? COLOR_AREA_DEFAULTS.step}
            {flags}
            {hsv}
            isTabbable={props.isTabbable}
            renderContent={props.renderContent}
            setAxis={(axis, percent) => writeHsv(ColorAreaUtils.computeAxisHsv(hsv, axis, percent))}
            setDragged={(ratio) => writeHsv(ColorAreaUtils.computeDraggedHsv(hsv, ratio))}
            setFocusVisibleAxis={(axis) => {
                focusVisibleAxis = axis;
            }}
            setIsDragging={(next) => {
                isDragging = next;
            }}
            onMouseEnter={props.onMouseEnter}
            onMouseLeave={props.onMouseLeave}
        />
    {/snippet}
</InteractionWrapper>
