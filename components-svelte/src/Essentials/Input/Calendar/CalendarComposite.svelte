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

    type CalendarPage = { start: DateValue; cells: DateValue[] };

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
    const minDaysInFirstWeek = $derived(props.minDaysInFirstWeek ?? CALENDAR_DEFAULTS.minDaysInFirstWeek);
    const monthCount = $derived(precision === "day" ? (props.monthCount ?? CALENDAR_DEFAULTS.monthCount) : 1);
    const isMultiMonth = $derived(monthCount > 1);

    $effect(() => CalendarUtils.warnIfMonthCountIgnored(props.precision, props.monthCount));

    const pageStart = $derived(CalendarUtils.getPageStart(month, precision));
    const today = $derived(CalendarUtils.resolveToday(props.today, month));
    const pages = $derived<CalendarPage[]>(
        monthCount === 1
            ? [{ start: pageStart, cells: CalendarUtils.getCells(month, precision, weekStartsOn) }]
            : CalendarUtils.getMonthStarts(month, monthCount).map((start) => ({
                  start,
                  cells: CalendarUtils.getCells(start, precision, weekStartsOn),
              })),
    );
    const cells = $derived(
        isMultiMonth ? pages.flatMap((page) => CalendarUtils.getOwnDays(page.cells, page.start)) : pages[0].cells,
    );
    const shape = $derived(CalendarUtils.getGridShape(month, precision));
    const hasWeekNumbers = $derived(precision === "day" && props.renderWeekNumber !== undefined);
    const columnCount = $derived(shape.colCount + (hasWeekNumbers ? 1 : 0));
    const currentEraId = $derived(CalendarUtils.getCurrentEraId(month, props.locale));
    const weekFieldName = $derived(hasWeekNumbers ? CalendarUtils.getWeekFieldName(props.locale) : "");

    const labelCell = $derived(
        CalendarUtils.createCellLabeler(pages[0].cells[0], precision, currentEraId, props.locale),
    );

    const computeMonthLabel = (page: CalendarPage) =>
        CalendarUtils.formatPage(page.start, page.cells, precision, currentEraId, props.locale);

    const computePageLabel = () =>
        isMultiMonth
            ? CalendarUtils.formatMonthSpan(pages[0].start, pages[pages.length - 1].start, currentEraId, props.locale)
            : computeMonthLabel(pages[0]);

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
            disabledDays: props.disabledDays,
            computeIsDayDisabled: props.computeIsDayDisabled,
        });

    const moveTo = (day: DateValue) => {
        const move = CalendarUtils.computeMove(day, precision, pageStart, props.minValue, props.maxValue, monthCount);

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

            LiveAnnouncerUtils.announce(computePageLabel());
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

    const rovingPage = $derived(
        pages.find((page) => CalendarUtils.getIsSameCell(page.start, rovingDay, "month")) ?? pages[0],
    );

    const handleKeyDown = (e: KeyboardEvent) => {
        const action = CalendarUtils.computeKeyAction(e.key, e.shiftKey, {
            roving: rovingDay,
            precision,
            cells: isMultiMonth ? rovingPage.cells : cells,
            shape,
            direction: getDirection(),
            monthCount,
        });

        if (!action) return;

        e.preventDefault();

        if (action.kind === "pick") pickDay(action.day);
        else moveTo(action.day);
    };

    const rowSpan = $derived(`span ${columnCount}`);
    const gridTemplateColumns = $derived(
        hasWeekNumbers ? `auto repeat(${shape.colCount}, 1fr)` : `repeat(${shape.colCount}, 1fr)`,
    );
    const gridGap = $derived(`${props.gap ?? CALENDAR_DEFAULTS.gap}px`);
</script>

{#snippet renderDay(page: CalendarPage, day: DateValue)}
    {#if !isMultiMonth || CalendarUtils.getIsSameCell(page.start, day, "month")}
        <InteractionWrapper
            sizing={"fill"}
            isDisabled={getIsDayDisabled(day)}
            isFocusableWhenDisabled={!(props.isDisabled ?? false)}
            isTabbable={CalendarUtils.getIsSameCell(day, rovingDay, precision)}
            extraFlags={CalendarUtils.computeCellFlags(day, {
                precision,
                month: page.start,
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
    {:else}
        <div role="gridcell"></div>
    {/if}
{/snippet}

{#snippet renderWeekNumber(row: DateValue[])}
    {@const weekNumber = DateValueUtils.getWeekNumber(row[0], weekStartsOn, minDaysInFirstWeek)}
    <div
        class={styles.calendarWeekNumber}
        role="rowheader"
        aria-label={CalendarUtils.formatWeekLabel(weekFieldName, weekNumber)}
    >
        {@render props.renderWeekNumber?.(weekNumber)}
    </div>
{/snippet}

{#snippet renderRows(page: CalendarPage)}
    {#if precision === "day"}
        <div class={styles.calendarRow} style:grid-column={rowSpan} role="row">
            {#if hasWeekNumbers}
                <div class={styles.calendarWeekNumber} role="columnheader" aria-label={weekFieldName}></div>
            {/if}

            {#each weekdayNames as name, index (index)}
                <div class={styles.calendarWeekday} role="columnheader" aria-label={name}>
                    {@render props.renderWeekday?.(name, index)}
                </div>
            {/each}
        </div>
    {/if}

    {#each CalendarUtils.getRows(page.cells, shape.colCount) as row, rowIndex (rowIndex)}
        <div class={styles.calendarRow} style:grid-column={rowSpan} role="row">
            {#if hasWeekNumbers}
                {@render renderWeekNumber(row)}
            {/if}

            {#each row as day, colIndex (colIndex)}
                {@render renderDay(page, day)}
            {/each}
        </div>
    {/each}
{/snippet}

{#if isMultiMonth}
    <div
        bind:this={root}
        {@attach (element) => on(element, "keydown", handleKeyDown)}
        id={gridId}
        class={styles.calendarMonths}
        style:gap={`${props.monthGap ?? CALENDAR_DEFAULTS.monthGap}px`}
        role="group"
        aria-label={props.ariaLabel}
        aria-disabled={props.isDisabled || undefined}
    >
        {#each pages as page, index (index)}
            <div class={styles.calendarMonth}>
                {@render props.renderMonthHeader?.(page.start, index)}

                <div
                    class={styles.calendarRoot}
                    style:grid-template-columns={gridTemplateColumns}
                    style:gap={gridGap}
                    role="grid"
                    aria-label={computeMonthLabel(page)}
                >
                    {@render renderRows(page)}
                </div>
            </div>
        {/each}
    </div>
{:else}
    <div
        bind:this={root}
        {@attach (element) => on(element, "keydown", handleKeyDown)}
        id={gridId}
        class={styles.calendarRoot}
        style:grid-template-columns={gridTemplateColumns}
        style:gap={gridGap}
        role="grid"
        aria-label={props.ariaLabel}
        aria-disabled={props.isDisabled || undefined}
    >
        {@render renderRows(pages[0])}
    </div>
{/if}
