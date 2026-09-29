<script lang="ts">
    import { untrack } from "svelte";

    import { COLOR_INPUT_DEFAULTS, type ColorInputRenderProps, ColorInputUtils } from "@thewaver/ss-components";
    import type { Color } from "@thewaver/ss-utils";

    import InteractionWrapper from "../../../Primitives/InteractionWrapper/InteractionWrapper.svelte";
    import Popover from "../../../Primitives/Popover/Popover.svelte";
    import type { ValuePair } from "../../../Utils/typeUtils.js";
    import ColorArea from "../ColorArea/ColorArea.svelte";
    import Range from "../Range/Range.svelte";
    import type { ColorInputProps } from "./ColorInput.types.js";
    import ColorInputField from "./ColorInputField.svelte";

    let { value = $bindable(), visibility = $bindable(false), ref = $bindable(), ...props }: ColorInputProps = $props();

    const popupId = $props.id();

    const startingState = untrack(() => ColorInputUtils.computeStartingState(value));

    let hsv = $state.raw<Color.HSVA>(startingState.hsv);
    let notation = $state.raw<Color.Notation>(startingState.notation);
    let isUnreadable = $state(startingState.isUnreadable);

    const isDisabled = $derived(props.isDisabled ?? false);

    $effect(() => {
        if (visibility && isDisabled) visibility = false;
    });

    $effect(() => {
        const incoming = ColorInputUtils.computeIncoming(value, untrack(() => hsv));

        isUnreadable = incoming.isUnreadable;

        if (incoming.notation !== undefined) notation = incoming.notation;

        if (incoming.hsv !== undefined) hsv = incoming.hsv;
    });

    $effect(() => {
        const current = hsv;

        untrack(() => {
            const next = ColorInputUtils.computeOutgoing(current, notation, value, isUnreadable);

            if (next === undefined) return;

            value = next;
            props.onInput?.(next);
        });
    });

    const open = () => {
        if (isDisabled) return;

        visibility = true;
    };

    const dismiss = () => {
        if (!visibility) return;

        visibility = false;
        ref?.focus();
    };

    const hsvPair: ValuePair<Color.HSVA> = [
        () => hsv,
        (next) => {
            hsv = next;
        },
    ];

    const extraFlags: ColorInputRenderProps = $derived({ value, hsv, isOpen: visibility, isUnreadable });
</script>

{#snippet surface()}
    <ColorArea
        bind:hsv
        sizing="fill"
        {isDisabled}
        ariaLabel={props.areaLabel}
        axisLabels={props.areaAxisLabels}
        renderContent={props.renderArea}
    />

    <Range
        bind:value={() => hsv.h, (hue) => (hsv = { ...hsv, h: hue ?? hsv.h })}
        sizing="fill"
        {isDisabled}
        max={ColorInputUtils.HUE_MAX}
        step={ColorInputUtils.HUE_STEP}
        ariaLabel={props.hueLabel}
        renderContent={props.renderHue}
    />
{/snippet}

<InteractionWrapper {...props} bind:ref hasError={(props.hasError ?? false) || isUnreadable} {extraFlags}>
    {#snippet renderControl(attachElement, flags)}
        <ColorInputField
            {attachElement}
            id={props.id}
            ariaLabel={props.ariaLabel}
            {popupId}
            isOpen={visibility}
            {flags}
            renderContent={props.renderContent}
            onToggle={() => (visibility ? (visibility = false) : open())}
            onMouseEnter={props.onMouseEnter}
            onMouseLeave={props.onMouseLeave}
        />
    {/snippet}
</InteractionWrapper>

<Popover
    id={popupId}
    role="dialog"
    ariaAttributes={{ "aria-label": props.pickerLabel }}
    isOpen={visibility}
    anchorRef={ref}
    placement={props.placement ?? COLOR_INPUT_DEFAULTS.placement}
    offset={props.offset}
    transitionDurationMs={props.transitionDurationMs}
    hasAutoFocus={true}
    onDismiss={(reason) => (reason === "escape" ? dismiss() : (visibility = false))}
>
    {#snippet renderContent(visibilityTarget, transitionDurationMs)}
        {@render props.renderPopup(surface, hsvPair, visibilityTarget, transitionDurationMs)}
    {/snippet}
</Popover>
