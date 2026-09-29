<script lang="ts">
    import { untrack } from "svelte";

    import {
        DATE_RANGE_PICKER_DEFAULTS,
        DateRangePickerUtils,
        type DateValue,
        type DateValueRange,
        DateValueUtils,
        type DismisserReason,
        DateRangePickerStyles as styles,
    } from "@thewaver/ss-components";

    import { SignalMirrorSvelteUtils } from "../../../Abstracts/SignalMirror/SignalMirrorSvelte.utils.svelte.js";
    import InteractionWrapper from "../../../Primitives/InteractionWrapper/InteractionWrapper.svelte";
    import Popover from "../../../Primitives/Popover/Popover.svelte";
    import PopupTrigger from "../../../Primitives/PopupTrigger/PopupTrigger.svelte";
    import type { ValuePair } from "../../../Utils/typeUtils.js";
    import DateInput from "../DateInput/DateInput.svelte";
    import RangeCalendar from "../RangeCalendar/RangeCalendar.svelte";
    import type { DateRangePickerProps } from "./DateRangePicker.types.js";

    const toMonth = (value: DateValue): DateValue => DateValueUtils.getStartOfMonth(value);

    let {
        value = $bindable(),
        visibility = $bindable(false),
        ref = $bindable(),
        ...props
    }: DateRangePickerProps = $props();

    const uid = $props.id();
    const popupId = `${uid}-popup`;
    const fallbackFieldId = `${uid}-field`;

    const endFieldId = $derived(`${props.id ?? fallbackFieldId}-end`);

    let root = $state<HTMLDivElement>();
    let month = $state.raw(untrack(() => toMonth(value?.start ?? DateValueUtils.fromDate(new Date()))));
    let isFocusReturned = false;

    const { first: start, second: end } = SignalMirrorSvelteUtils.createSplit<DateValueRange, DateValue, DateValue>(
        [
            () => value,
            (next) => {
                value = next;
            },
        ],
        DateRangePickerUtils.SPLIT_DEFS,
    );

    const isDisabled = $derived(props.isDisabled ?? false);

    const monthPair: ValuePair<DateValue> = [
        () => month,
        (next) => {
            month = next;
        },
    ];

    const open = () => {
        if (isDisabled) return;

        visibility = true;
    };

    const dismiss = () => {
        if (!visibility) return;

        isFocusReturned = true;
        visibility = false;
    };

    const handleDismiss = (reason: DismisserReason) => {
        if (reason === "escape") dismiss();
        else visibility = false;
    };

    $effect(() => {
        if (visibility && isDisabled) visibility = false;
    });

    $effect(() => {
        if (!visibility) return;

        untrack(() => {
            if (value?.start) month = toMonth(value.start);
        });
    });

    $effect(() => {
        if (visibility || !isFocusReturned) return;

        isFocusReturned = false;

        root?.querySelector<HTMLInputElement>(`#${CSS.escape(endFieldId)}`)?.focus();
    });
</script>

{#snippet renderCalendar()}
    <RangeCalendar
        bind:value
        bind:month
        minValue={props.minValue}
        maxValue={props.maxValue}
        isDisabled={props.isDisabled}
        locale={props.locale}
        weekStartsOn={props.weekStartsOn}
        ariaLabel={props.calendarLabel}
        computeIsDayDisabled={props.computeIsDayDisabled}
        renderDay={props.renderDay}
        renderWeekday={props.renderWeekday}
    />
{/snippet}

{#snippet trailing()}
    <InteractionWrapper {isDisabled} extraFlags={{ isOpen: visibility }}>
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

<div bind:this={root} class={styles.dateRangePickerRoot}>
    <DateInput
        {...props}
        bind:value={start[0], start[1]}
        bind:ref
        id={props.id && `${props.id}-start`}
        name={props.name && `${props.name}-start`}
        ariaLabel={props.startLabel}
    />

    {@render props.renderSeparator?.()}

    <DateInput
        {...props}
        bind:value={end[0], end[1]}
        bind:ref
        id={endFieldId}
        name={props.name && `${props.name}-end`}
        ariaLabel={props.endLabel}
        renderTrailing={trailing}
    />

    <Popover
        id={popupId}
        role={"dialog"}
        ariaAttributes={{ "aria-label": props.calendarLabel }}
        isOpen={visibility}
        anchorRef={root}
        placement={props.placement ?? DATE_RANGE_PICKER_DEFAULTS.placement}
        offset={props.offset}
        transitionDurationMs={props.popupTransitionDurationMs}
        hasAutoFocus={true}
        onDismiss={handleDismiss}
        renderContent={popupContent}
    />
</div>
