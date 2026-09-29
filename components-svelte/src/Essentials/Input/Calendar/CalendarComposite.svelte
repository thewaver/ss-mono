<script lang="ts">
    import { untrack } from "svelte";
    import { on } from "svelte/events";

    import {
        CALENDAR_DEFAULTS,
        type CalendarRenderProps,
        CalendarUtils,
        type DateValue,
        DateValueUtils,
        type InteractionFlags,
        LiveAnnouncerUtils,
        CalendarStyles as styles,
    } from "@thewaver/ss-components";

    import { NavigatorSvelteUtils } from "../../../Abstracts/Navigator/NavigatorSvelte.utils.svelte.js";
    import InteractionWrapper from "../../../Primitives/InteractionWrapper/InteractionWrapper.svelte";
    import type { CalendarCompositeProps } from "./Calendar.types.js";
    import CalendarDay from "./CalendarDay.svelte";

    let { month = $bindable(), ...props }: CalendarCompositeProps = $props();

    const gridId = $props.id();

    const toCellId = (day: DateValue) => `${gridId}-day-${DateValueUtils.toIso(day)}`;

    $effect(() => {
        LiveAnnouncerUtils.reserve("polite");
    });

    let root = $state<HTMLDivElement>();
    let highlighted = $state.raw<DateValue>();

    const getDirection = NavigatorSvelteUtils.createDirection(() => root);

    const precision = $derived(props.precision ?? CALENDAR_DEFAULTS.precision);
    const weekStartsOn = $derived(props.weekStartsOn ?? CALENDAR_DEFAULTS.weekStartsOn);
    const weekdayWidth = $derived(props.weekdayWidth ?? CALENDAR_DEFAULTS.weekdayWidth);

    const pageStart = $derived(CalendarUtils.getPageStart(month, precision));
    const today = $derived(CalendarUtils.resolveToday(props.today, month));
    const cells = $derived(CalendarUtils.getCells(month, precision, weekStartsOn));
    const shape = $derived(CalendarUtils.getGridShape(month, precision));
    const rows = $derived(CalendarUtils.getRows(cells, shape.colCount));
    const currentEraId = $derived(CalendarUtils.getCurrentEraId(month, props.locale));

    const labelCell = $derived(CalendarUtils.createCellLabeler(cells[0], precision, currentEraId, props.locale));

    const weekdayNames = $derived(DateValueUtils.getWeekdayNames(weekStartsOn, weekdayWidth, props.locale));

    const rovingDay = $derived(
        CalendarUtils.computeRovingDay(cells, precision, {
            highlighted,
            anchor: props.anchorDay,
            today,
            pageStart,
        }),
    );

    const paintedRange = $derived(props.computeRange?.(rovingDay));

    const getIsDayDisabled = (day: DateValue) =>
        CalendarUtils.getIsCellDisabled(day, precision, {
            isDisabled: props.isDisabled,
            minValue: props.minValue,
            maxValue: props.maxValue,
            computeIsDayDisabled: props.computeIsDayDisabled,
        });

    const moveTo = (day: DateValue) => {
        const move = CalendarUtils.computeMove(day, precision, pageStart, props.minValue, props.maxValue);

        highlighted = move.day;

        if (move.month) month = move.month;
    };

    const pickDay = (day: DateValue) => {
        if (getIsDayDisabled(day)) return;

        const picked = CalendarUtils.computePick(day, precision, props.minValue, props.maxValue);

        highlighted = picked;
        props.onPick(picked);
    };

    $effect(() => {
        const anchor = props.anchorDay;

        if (anchor) highlighted = anchor;
    });

    let previousPageStart: DateValue | undefined;

    $effect(() => {
        const next = pageStart;

        untrack(() => {
            const previous = previousPageStart;

            previousPageStart = next;

            if (!previous || DateValueUtils.isSame(previous, next)) return;

            LiveAnnouncerUtils.announce(CalendarUtils.formatPage(next, cells, precision, currentEraId, props.locale));
        });
    });

    const rovingCellId = $derived.by(() => {
        const rovingIndex = CalendarUtils.findCellIndex(cells, rovingDay, precision);

        return rovingIndex === undefined ? undefined : toCellId(cells[rovingIndex]);
    });

    $effect(() => {
        const cellId = rovingCellId;
        const element = root;

        if (!cellId || !element) return;

        untrack(() => {
            if (!element.contains(document.activeElement) || element === document.activeElement) return;

            document.getElementById(cellId)?.focus();
        });
    });

    const handleKeyDown = (e: KeyboardEvent) => {
        const action = CalendarUtils.computeKeyAction(e.key, e.shiftKey, {
            roving: rovingDay,
            precision,
            cells,
            shape,
            direction: getDirection(),
        });

        if (!action) return;

        e.preventDefault();

        if (action.kind === "pick") pickDay(action.day);
        else moveTo(action.day);
    };

    const rowSpan = $derived(`span ${shape.colCount}`);
</script>

<div
    bind:this={root}
    {@attach (element) => on(element, "keydown", handleKeyDown)}
    id={gridId}
    class={styles.calendarRoot}
    style:grid-template-columns={`repeat(${shape.colCount}, 1fr)`}
    style:gap={`${props.gap ?? CALENDAR_DEFAULTS.gap}px`}
    role="grid"
    aria-label={props.ariaLabel}
    aria-disabled={props.isDisabled || undefined}
>
    {#if precision === "day"}
        <div class={styles.calendarRow} style:grid-column={rowSpan} role="row">
            {#each weekdayNames as name, index (index)}
                <div class={styles.calendarWeekday} role="columnheader" aria-label={name}>
                    {@render props.renderWeekday?.(name, index)}
                </div>
            {/each}
        </div>
    {/if}

    {#each rows as row, rowIndex (rowIndex)}
        <div class={styles.calendarRow} style:grid-column={rowSpan} role="row">
            {#each row as day, colIndex (colIndex)}
                <InteractionWrapper
                    sizing={"fill"}
                    isDisabled={getIsDayDisabled(day)}
                    isFocusableWhenDisabled={!(props.isDisabled ?? false)}
                    isTabbable={CalendarUtils.getIsSameCell(day, rovingDay, precision)}
                    extraFlags={CalendarUtils.computeCellFlags(day, {
                        precision,
                        month,
                        roving: rovingDay,
                        today,
                        isSelected: props.computeIsSelected(day),
                        range: paintedRange,
                    })}
                >
                    {#snippet renderControl(attachElement, flags)}
                        {#snippet dayContent(dayFlags: InteractionFlags<CalendarRenderProps>)}
                            {@render props.renderDay(day, dayFlags)}
                        {/snippet}
                        <CalendarDay
                            {attachElement}
                            id={toCellId(day)}
                            {flags}
                            ariaLabel={labelCell(day)}
                            renderContent={dayContent}
                            onSelect={() => pickDay(day)}
                        />
                    {/snippet}
                </InteractionWrapper>
            {/each}
        </div>
    {/each}
</div>
