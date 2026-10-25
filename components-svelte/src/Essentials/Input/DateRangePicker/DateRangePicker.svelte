<script lang="ts">
    import { untrack } from "svelte";

    import {
        type AnchorPlacement,
        DATE_INPUT_DEFAULTS,
        DATE_RANGE_PICKER_DEFAULTS,
        DateRangePickerUtils,
        type DateValue,
        type DateValueCalendarId,
        type DateValueRange,
        DateValueUtils,
        type DismisserReason,
        type InteractionFlags,
        InteractionTrackerUtils,
        type TextFieldFlags,
        TextFieldUtils,
        DateRangePickerStyles as styles,
    } from "@thewaver/ss-components";
    import type { ShapeArrowAim } from "@thewaver/ss-utils";

    import { NavigatorSvelteUtils } from "../../../Abstracts/Navigator/NavigatorSvelte.utils.svelte.js";
    import { SignalMirrorSvelteUtils } from "../../../Abstracts/SignalMirror/SignalMirrorSvelte.utils.svelte.js";
    import InteractionWrapper from "../../../Primitives/InteractionWrapper/InteractionWrapper.svelte";
    import Popover from "../../../Primitives/Popover/Popover.svelte";
    import PopupTrigger from "../../../Primitives/PopupTrigger/PopupTrigger.svelte";
    import { watchChange } from "../../../Utils/effectUtils.svelte.js";
    import type { ValuePair } from "../../../Utils/typeUtils.js";
    import ValueReport from "../../../Utils/ValueReport.svelte";
    import Tooltip from "../../Overlays/Tooltip/Tooltip.svelte";
    import DateInput from "../DateInput/DateInput.svelte";
    import RangeCalendar from "../RangeCalendar/RangeCalendar.svelte";
    import type { DateRangePickerProps } from "./DateRangePicker.types.js";

    const toMonth = (value: DateValue, calendar: DateValueCalendarId): DateValue =>
        DateValueUtils.getStartOfMonth(DateValueUtils.withCalendar(value, calendar));

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

    const getDirection = NavigatorSvelteUtils.createDirection(() => root);

    const calendar = $derived(props.calendar ?? DATE_INPUT_DEFAULTS.calendar);

    let month = $state.raw(untrack(() => toMonth(value?.start ?? DateValueUtils.fromDate(new Date()), calendar)));
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
    const isLocked = $derived(isDisabled || (props.isReadOnly ?? false));

    const monthPair: ValuePair<DateValue> = [
        () => month,
        (next) => {
            month = next;
        },
    ];

    const open = () => {
        if (isLocked) return;

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
        if (visibility && isLocked) visibility = false;
    });

    $effect(() => {
        if (!visibility) return;

        untrack(() => {
            if (value?.start) month = toMonth(value.start, calendar);
        });
    });

    watchChange(
        () => calendar,
        (next) => {
            month = toMonth(month, next);
        },
    );

    let startFlags = $state.raw<InteractionFlags<TextFieldFlags>>();
    let endFlags = $state.raw<InteractionFlags<TextFieldFlags>>();

    const pairFlags = $derived(
        TextFieldUtils.mergeFlags([startFlags, endFlags].flatMap((flags) => (flags ? [flags] : []))),
    );

    const tooltipDefs = $derived.by(() => {
        const defs = props.tooltipDefs;
        const isReachable = InteractionTrackerUtils.computeIsReachable(
            isDisabled,
            props.isReachableWhenDisabled ?? false,
        );

        return defs && (!isDisabled || isReachable) ? defs : undefined;
    });

    let lastTooltipDefs: typeof props.tooltipDefs;

    const shownTooltipDefs = $derived.by(() => {
        if (tooltipDefs) lastTooltipDefs = tooltipDefs;

        return lastTooltipDefs;
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

{#snippet startContent(flags: InteractionFlags<TextFieldFlags>)}
    {@render props.renderContent(flags)}

    <ValueReport
        value={flags}
        onChange={(next) => {
            startFlags = next;
        }}
    />
{/snippet}

{#snippet endContent(flags: InteractionFlags<TextFieldFlags>)}
    {@render props.renderContent(flags)}

    <ValueReport
        value={flags}
        onChange={(next) => {
            endFlags = next;
        }}
    />
{/snippet}

{#snippet tooltipContent(
    visibilityTarget: 0 | 1,
    transitionDurationMs: number,
    placement: AnchorPlacement,
    arrowAim: ShapeArrowAim | undefined,
)}
    {#if shownTooltipDefs}
        {@render shownTooltipDefs.renderContent(visibilityTarget, transitionDurationMs, placement, pairFlags, arrowAim)}
    {/if}
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
        tooltipDefs={undefined}
        renderContent={startContent}
    />

    {@render props.renderSeparator?.()}

    <DateInput
        {...props}
        bind:value={end[0], end[1]}
        bind:ref
        id={endFieldId}
        name={props.name && `${props.name}-end`}
        ariaLabel={props.endLabel}
        tooltipDefs={undefined}
        renderContent={endContent}
        renderTrailing={trailing}
    />

    <Popover
        id={popupId}
        role={"dialog"}
        ariaAttributes={{ "aria-label": props.calendarLabel }}
        isOpen={visibility}
        anchorRef={root}
        placement={props.placement ?? DATE_RANGE_PICKER_DEFAULTS.placement[getDirection()]}
        offset={props.offset}
        transitionDurationMs={props.popupTransitionDurationMs}
        hasAutoFocus={true}
        onDismiss={handleDismiss}
        renderContent={popupContent}
    />

    {#if shownTooltipDefs}
        <Tooltip
            {...shownTooltipDefs}
            isAnchorGroup={true}
            anchorRef={tooltipDefs ? root : undefined}
            renderContent={tooltipContent}
        />
    {/if}
</div>
