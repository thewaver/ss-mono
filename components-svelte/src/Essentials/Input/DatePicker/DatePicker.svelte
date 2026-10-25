<script lang="ts">
    import { untrack } from "svelte";

    import {
        DATE_INPUT_DEFAULTS,
        DATE_PICKER_DEFAULTS,
        type DateValue,
        type DateValueCalendarId,
        DateValueUtils,
        type DismisserReason,
    } from "@thewaver/ss-components";

    import { NavigatorSvelteUtils } from "../../../Abstracts/Navigator/NavigatorSvelte.utils.svelte.js";

    import InteractionWrapper from "../../../Primitives/InteractionWrapper/InteractionWrapper.svelte";
    import Popover from "../../../Primitives/Popover/Popover.svelte";
    import PopupTrigger from "../../../Primitives/PopupTrigger/PopupTrigger.svelte";
    import { watchChange } from "../../../Utils/effectUtils.svelte.js";
    import type { ValuePair } from "../../../Utils/typeUtils.js";
    import Calendar from "../Calendar/Calendar.svelte";
    import DateInput from "../DateInput/DateInput.svelte";
    import type { DatePickerProps } from "./DatePicker.types.js";

    const toMonth = (value: DateValue, calendar: DateValueCalendarId): DateValue =>
        DateValueUtils.getStartOfMonth(DateValueUtils.withCalendar(value, calendar));

    let { value = $bindable(), visibility = $bindable(false), ref = $bindable(), ...props }: DatePickerProps = $props();

    const popupId = $props.id();

    let root = $state<HTMLDivElement>();

    const getDirection = NavigatorSvelteUtils.createDirection(() => root);

    const calendar = $derived(props.calendar ?? DATE_INPUT_DEFAULTS.calendar);

    let month = $state.raw(untrack(() => toMonth(value ?? DateValueUtils.fromDate(new Date()), calendar)));
    let isFocusReturned = false;

    const isLocked = $derived((props.isDisabled ?? false) || (props.isReadOnly ?? false));

    const monthPair: ValuePair<DateValue> = [
        () => month,
        (next) => {
            month = next;
        },
    ];

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
        if (!visibility) return;

        untrack(() => {
            if (value) month = toMonth(value, calendar);
        });
    });

    watchChange(
        () => calendar,
        (next) => {
            month = toMonth(month, next);
        },
    );

    $effect(() => {
        if (visibility || !isFocusReturned) return;

        isFocusReturned = false;

        root?.querySelector("input")?.focus();
    });
</script>

{#snippet renderCalendar()}
    <Calendar
        bind:value
        bind:month
        minValue={props.minValue}
        maxValue={props.maxValue}
        isDisabled={props.isDisabled}
        locale={props.locale}
        weekStartsOn={props.weekStartsOn}
        precision={props.precision}
        ariaLabel={props.calendarLabel}
        disabledDays={props.disabledDays}
        computeIsDayDisabled={props.computeIsDayDisabled}
        renderDay={props.renderDay}
        renderWeekday={props.renderWeekday}
    />
{/snippet}

{#snippet trailing()}
    <InteractionWrapper isDisabled={isLocked} extraFlags={{ isOpen: visibility }}>
        {#snippet renderControl(attachElement, flags)}
            <PopupTrigger
                {attachElement}
                id={props.triggerId}
                {popupId}
                isOpen={visibility}
                ariaLabel={props.triggerAriaLabel}
                {flags}
                renderContent={props.renderTrigger}
                onToggle={() => (visibility ? dismiss() : open())}
            />
        {/snippet}
    </InteractionWrapper>
{/snippet}

{#snippet popupContent(visibilityTarget: 0 | 1, transitionDurationMs: number)}
    {@render props.renderPopup(renderCalendar, monthPair, visibilityTarget, transitionDurationMs)}
{/snippet}

<div bind:this={root}>
    <DateInput {...props} bind:value bind:ref renderTrailing={trailing} />

    <Popover
        id={popupId}
        role={"dialog"}
        ariaAttributes={{ "aria-label": props.calendarLabel }}
        isOpen={visibility}
        anchorRef={root}
        placement={props.placement ?? DATE_PICKER_DEFAULTS.placement[getDirection()]}
        offset={props.offset}
        transitionDurationMs={props.popupTransitionDurationMs}
        hasAutoFocus={true}
        onDismiss={handleDismiss}
        renderContent={popupContent}
    />
</div>
