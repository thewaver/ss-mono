<script lang="ts">
    import { untrack } from "svelte";

    import type { DateValue } from "@thewaver/ss-components-svelte";
    import { Button, DateValueUtils, FocusManagerUtils } from "@thewaver/ss-components-svelte";
    import { FunctionUtils } from "@thewaver/ss-utils";

    import PageButtonContent from "../../StyledComponents/ButtonContent/ButtonContent.svelte";
    import PageCalendarCaptionFields from "../../StyledComponents/CalendarContent/PageCalendarCaptionFields.svelte";
    import PageCalendarHeader from "../../StyledComponents/CalendarContent/PageCalendarHeader.svelte";
    import PageCalendarTitle from "../../StyledComponents/CalendarContent/PageCalendarTitle.svelte";
    import PageNumberField from "../Field/PageNumberField.svelte";
    import PageSelectField from "../Field/PageSelectField.svelte";
    import type { PageCalendarCaptionProps } from "./CalendarCaption.types";

    const MONTH_STEP = 1;
    const MONTH_FIELD_WIDTH = 122;
    const YEAR_FIELD_WIDTH = 80;
    const YEAR_SETTLE_MS = 300;
    const TITLE_OPTIONS: Intl.DateTimeFormatOptions = { month: "long", year: "numeric" };
    const PAST_ERA_TITLE_OPTIONS: Intl.DateTimeFormatOptions = { ...TITLE_OPTIONS, era: "short" };

    let props: PageCalendarCaptionProps = $props();

    let isEditing = $state(false);
    let isRestoringFocus = $state(false);
    let titleRef = $state<HTMLElement>();
    let fieldsRef = $state<HTMLDivElement>();

    let restorePoint: DateValue | undefined;
    let pendingYear: number | undefined;

    const month = $derived(props.month[0]());

    const setMonth = (next: DateValue) => props.month[1](next);

    const monthNames = $derived(DateValueUtils.getMonthNames(month, props.locale));

    const monthValues = $derived(
        Array.from({ length: DateValueUtils.getMonthsInYear(month) }, (_, index) => index + 1),
    );

    const getTitle = () => {
        const eras = DateValueUtils.getEras(month, props.locale);
        const isPastEra = month.era !== eras[eras.length - 1].id;

        return DateValueUtils.format(month, isPastEra ? PAST_ERA_TITLE_OPTIONS : TITLE_OPTIONS, props.locale);
    };

    const jumpTo = (value: { year?: number; month?: number }) => {
        setMonth(props.month[0]().set({ ...value, day: 1 }));
    };

    const page = (direction: 1 | -1) => {
        setMonth(DateValueUtils.addMonths(month, direction * MONTH_STEP));
    };

    const writeYear = FunctionUtils.debounce((year: number) => {
        pendingYear = undefined;
        jumpTo({ year });
    }, YEAR_SETTLE_MS);

    const queueYear = (year: number) => {
        if (!isEditing) return;

        pendingYear = year;
        writeYear(year);
    };

    const settleYear = () => {
        writeYear.cancel();

        if (pendingYear === undefined) return;

        jumpTo({ year: pendingYear });
        pendingYear = undefined;
    };

    const startEditing = () => {
        restorePoint = month;
        isEditing = true;
    };

    const stopEditing = (restoreFocus: boolean) => {
        settleYear();
        isRestoringFocus = restoreFocus;
        isEditing = false;
    };

    const abandonEditing = () => {
        writeYear.cancel();
        pendingYear = undefined;

        isRestoringFocus = true;
        isEditing = false;

        if (restorePoint) setMonth(restorePoint);
    };

    $effect(() => {
        if (isEditing) {
            const fields = fieldsRef;

            untrack(() => FocusManagerUtils.getFirstFocusableChild(fields)?.focus());

            return;
        }

        if (!isRestoringFocus || !titleRef?.isConnected) return;

        const title = titleRef;

        untrack(() => {
            isRestoringFocus = false;
            title.focus();
        });
    });

    $effect(() => writeYear.cancel);
</script>

<PageCalendarHeader>
    <Button id={`${props.itemKey}PreviousMonth`} ariaLabel={"Previous month"} onClick={() => page(-1)}>
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>◀</PageButtonContent>
        {/snippet}
    </Button>

    {#if isEditing}
        <PageCalendarCaptionFields
            bind:ref={fieldsRef}
            onkeydown={(e) => {
                if (e.defaultPrevented) return;

                if (e.key === "Enter") {
                    e.preventDefault();
                    stopEditing(true);
                } else if (e.key === "Escape") {
                    e.preventDefault();
                    abandonEditing();
                }
            }}
            onfocusout={(e) => {
                if (!isEditing) return;
                if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;

                stopEditing(false);
            }}
        >
            <PageSelectField
                value={month.month}
                values={monthValues}
                width={MONTH_FIELD_WIDTH}
                ariaLabel={"Month"}
                computeLabel={(value) => monthNames[value - 1]}
                onChange={(value) => jumpTo({ month: value })}
            />

            <PageNumberField value={month.year} width={YEAR_FIELD_WIDTH} ariaLabel={"Year"} onInput={queueYear} />
        </PageCalendarCaptionFields>
    {:else}
        <Button
            bind:ref={titleRef}
            id={`${props.itemKey}MonthTitle`}
            ariaLabel={`${getTitle()}, pick a month and year`}
            onClick={startEditing}
        >
            {#snippet renderContent(flags)}
                <PageCalendarTitle {flags}>{getTitle()}</PageCalendarTitle>
            {/snippet}
        </Button>
    {/if}

    <Button id={`${props.itemKey}NextMonth`} ariaLabel={"Next month"} onClick={() => page(1)}>
        {#snippet renderContent(flags)}
            <PageButtonContent {flags}>▶</PageButtonContent>
        {/snippet}
    </Button>
</PageCalendarHeader>
