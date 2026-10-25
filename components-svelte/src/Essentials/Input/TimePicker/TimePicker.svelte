<script lang="ts">
    import {
        type DismisserReason,
        type InteractionFlags,
        type PopupTriggerFlags,
        TIME_PICKER_DEFAULTS,
        type TextFieldFlags,
    } from "@thewaver/ss-components";

    import { NavigatorSvelteUtils } from "../../../Abstracts/Navigator/NavigatorSvelte.utils.svelte.js";
    import InteractionWrapper from "../../../Primitives/InteractionWrapper/InteractionWrapper.svelte";
    import Popover from "../../../Primitives/Popover/Popover.svelte";
    import PopupTrigger from "../../../Primitives/PopupTrigger/PopupTrigger.svelte";
    import Clock from "../Clock/Clock.svelte";
    import TimeInput from "../TimeInput/TimeInput.svelte";
    import type { TimeInputMeridiem } from "../TimeInput/TimeInput.types.js";
    import type { TimePickerProps } from "./TimePicker.types.js";

    let { value = $bindable(), visibility = $bindable(false), ref = $bindable(), ...props }: TimePickerProps = $props();

    const popupId = $props.id();

    let root = $state<HTMLDivElement>();
    let isFocusReturned = false;

    const getDirection = NavigatorSvelteUtils.createDirection(() => root);

    const isLocked = $derived((props.isDisabled ?? false) || (props.isReadOnly ?? false));

    const dismiss = () => {
        if (!visibility) return;

        isFocusReturned = true;
        visibility = false;
    };

    const open = () => {
        if (isLocked) return;

        visibility = true;
    };

    const handleDismiss = (reason: DismisserReason) => {
        if (reason === "escape") dismiss();
        else visibility = false;
    };

    $effect(() => {
        if (visibility && isLocked) visibility = false;
    });

    $effect(() => {
        if (visibility || !isFocusReturned) return;

        isFocusReturned = false;

        root?.querySelector("input")?.focus();
    });
</script>

{#snippet renderClock()}
    <Clock
        bind:value
        minValue={props.minValue}
        maxValue={props.maxValue}
        steps={props.clockSteps}
        gap={props.clockGap}
        hasSeconds={props.hasSeconds}
        isTwelveHour={props.isTwelveHour}
        isDisabled={props.isDisabled}
        locale={props.locale}
        ariaLabel={props.clockLabel}
        computeIsTimeDisabled={props.computeIsTimeDisabled}
        renderOption={props.renderOption}
        renderUnit={props.renderUnit}
        renderColumn={props.renderColumn}
    />
{/snippet}

{#snippet trailing(fieldFlags: InteractionFlags<TextFieldFlags>, meridiem: TimeInputMeridiem)}
    {@render props.renderTrailing?.(fieldFlags, meridiem)}

    <InteractionWrapper isDisabled={isLocked} extraFlags={{ isOpen: visibility }}>
        {#snippet renderControl(attachElement, flags)}
            {#snippet triggerContent(triggerFlags: InteractionFlags<PopupTriggerFlags>)}
                {@render props.renderTrigger(triggerFlags, meridiem)}
            {/snippet}
            <PopupTrigger
                {attachElement}
                id={props.triggerId}
                {popupId}
                isOpen={visibility}
                ariaLabel={props.triggerAriaLabel}
                {flags}
                renderContent={triggerContent}
                onToggle={() => (visibility ? dismiss() : open())}
            />
        {/snippet}
    </InteractionWrapper>
{/snippet}

{#snippet popupContent(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    {@render props.renderPopup(renderClock, visibilityTarget, transitionDurationMs)}
{/snippet}

<div bind:this={root}>
    <TimeInput {...props} bind:value bind:ref renderTrailing={trailing} />

    <Popover
        id={popupId}
        role={"dialog"}
        ariaAttributes={{ "aria-label": props.clockLabel }}
        isOpen={visibility}
        anchorRef={root}
        placement={props.placement ?? TIME_PICKER_DEFAULTS.placement[getDirection()]}
        offset={props.offset}
        transitionDurationMs={props.popupTransitionDurationMs}
        hasAutoFocus={true}
        onDismiss={handleDismiss}
        renderContent={popupContent}
    />
</div>
