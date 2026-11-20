<script lang="ts">
    import {
        type AnchorPlacement,
        DateTimePickerUtils,
        type InteractionFlags,
        InteractionTrackerUtils,
        type TextFieldFlags,
        TextFieldUtils,
        DateTimePickerStyles as styles,
    } from "@thewaver/ss-components";
    import type { ShapeArrowAim } from "@thewaver/ss-utils";

    import { DateTimeValueSvelteUtils } from "../../../Abstracts/DateTimeValue/DateTimeValueSvelte.utils.svelte.js";
    import ValueReport from "../../../Utils/ValueReport.svelte";
    import Tooltip from "../../Overlays/Tooltip/Tooltip.svelte";
    import DatePicker from "../DatePicker/DatePicker.svelte";
    import { FormFieldSvelteUtils } from "../FormField/FormFieldSvelte.utils.svelte.js";
    import TimePicker from "../TimePicker/TimePicker.svelte";
    import type { DateTimePickerProps } from "./DateTimePicker.types.js";
    import DateTimePickerFieldsScope from "./DateTimePickerFieldsScope.svelte";

    let {
        value = $bindable(),
        dateVisibility = $bindable(false),
        timeVisibility = $bindable(false),
        ref = $bindable(),
        ...props
    }: DateTimePickerProps = $props();

    const { date, time } = DateTimeValueSvelteUtils.createSplit([
        () => value,
        (next) => {
            value = next;
        },
    ]);

    let root = $state<HTMLDivElement>();

    let dateFlags = $state.raw<InteractionFlags<TextFieldFlags>>();
    let timeFlags = $state.raw<InteractionFlags<TextFieldFlags>>();

    const pairFlags = $derived(
        TextFieldUtils.mergeFlags([dateFlags, timeFlags].flatMap((flags) => (flags ? [flags] : []))),
    );

    const isDisabled = $derived(props.isDisabled ?? false);

    const isReachable = $derived(
        InteractionTrackerUtils.computeIsReachable(
            isDisabled,
            props.isReachableWhenDisabled ?? false,
            false,
            props.tooltipDefs !== undefined,
        ),
    );

    const tooltipDefs = $derived.by(() => {
        const defs = props.tooltipDefs;

        return defs && (!isDisabled || isReachable) ? defs : undefined;
    });

    $effect(() =>
        InteractionTrackerUtils.warnIfReachableWithoutTooltip(
            props.isReachableWhenDisabled ?? false,
            props.tooltipDefs !== undefined,
        ),
    );

    const getGroupLabelledBy = FormFieldSvelteUtils.resolveAriaLabelledBy();

    let lastTooltipDefs: typeof props.tooltipDefs;

    const shownTooltipDefs = $derived.by(() => {
        if (tooltipDefs) lastTooltipDefs = tooltipDefs;

        return lastTooltipDefs;
    });
</script>

{#snippet dateContent(flags: InteractionFlags<TextFieldFlags>)}
    {@render props.renderContent(flags)}

    <ValueReport
        value={flags}
        onChange={(next) => {
            dateFlags = next;
        }}
    />
{/snippet}

{#snippet timeContent(flags: InteractionFlags<TextFieldFlags>)}
    {@render props.renderContent(flags)}

    <ValueReport
        value={flags}
        onChange={(next) => {
            timeFlags = next;
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

<div bind:this={root} class={styles.dateTimePickerRoot} role="group" aria-labelledby={getGroupLabelledBy()}>
    <DateTimePickerFieldsScope>
    <DatePicker
        {...props}
        bind:value={date[0], date[1]}
        bind:visibility={dateVisibility}
        bind:ref
        id={props.id && `${props.id}-date`}
        name={props.name && `${props.name}-date`}
        ariaLabel={props.dateLabel}
        isFocusableWhenDisabled={isReachable}
        minValue={props.minValue?.date}
        maxValue={props.maxValue?.date}
        tooltipDefs={undefined}
        renderContent={dateContent}
    />

    {@render props.renderSeparator?.()}

    <TimePicker
        {...props}
        bind:value={time[0], time[1]}
        bind:visibility={timeVisibility}
        bind:ref
        id={props.id && `${props.id}-time`}
        name={props.name && `${props.name}-time`}
        ariaLabel={props.timeLabel}
        isFocusableWhenDisabled={isReachable}
        minValue={props.minValue && DateTimePickerUtils.computeMinTime(date[0](), props.minValue)}
        maxValue={props.maxValue && DateTimePickerUtils.computeMaxTime(date[0](), props.maxValue)}
        renderLeading={undefined}
        tooltipDefs={undefined}
        renderContent={timeContent}
        triggerId={props.timeTriggerId}
        triggerAriaLabel={props.timeTriggerAriaLabel}
        renderTrailing={props.renderTimeTrailing}
        renderTrigger={props.renderTimeTrigger}
        renderPopup={props.renderTimePopup}
    />
    </DateTimePickerFieldsScope>

    {#if shownTooltipDefs}
        <Tooltip
            {...shownTooltipDefs}
            isAnchorGroup={true}
            anchorRef={tooltipDefs ? root : undefined}
            renderContent={tooltipContent}
        />
    {/if}
</div>
