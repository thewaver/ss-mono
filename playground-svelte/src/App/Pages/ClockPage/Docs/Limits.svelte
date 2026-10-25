<script lang="ts">
    import { Clock } from "@thewaver/ss-components-svelte";
    import { BOOKING_STEPS, CLOSING_TIME, LOCALE, OPENING_TIME } from "@thewaver/ss-playground/App/Pages/DatePickerPage/DatePickerPage.const";
    import type { TimeValue } from "@thewaver/ss-utils";

    import PageClockColumn from "../../../StyledComponents/ClockContent/PageClockColumn.svelte";
    import PageClockFrame from "../../../StyledComponents/ClockContent/PageClockFrame.svelte";
    import PageClockOption from "../../../StyledComponents/ClockContent/PageClockOption.svelte";
    import PageClockUnit from "../../../StyledComponents/ClockContent/PageClockUnit.svelte";

    let value = $state.raw<TimeValue | undefined>({ hour: 10, minute: 15 });
</script>

<PageClockFrame>
    <Clock
        bind:value
        locale={LOCALE}
        steps={BOOKING_STEPS}
        minValue={OPENING_TIME}
        maxValue={CLOSING_TIME}
        ariaLabel={"Booking time"}
    >
        {#snippet renderOption(_unused, renderProps)}
            <PageClockOption {renderProps} />
        {/snippet}

        {#snippet renderUnit(name)}
            <PageClockUnit>{name}</PageClockUnit>
        {/snippet}

        {#snippet renderColumn(renderOptions)}
            <PageClockColumn>{@render renderOptions()}</PageClockColumn>
        {/snippet}
    </Clock>
</PageClockFrame>
