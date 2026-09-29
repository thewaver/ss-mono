<script lang="ts">
    import { type DateValue, RangeCalendarUtils } from "@thewaver/ss-components";

    import type { RangeCalendarProps } from "../Calendar/Calendar.types.js";
    import CalendarComposite from "../Calendar/CalendarComposite.svelte";

    let { value = $bindable(), month = $bindable(), ...props }: RangeCalendarProps = $props();

    let pendingStart = $state.raw<DateValue>();
    let lastPicked = $state.raw<DateValue>();

    const pick = (day: DateValue) => {
        const next = RangeCalendarUtils.computePick(day, pendingStart);

        lastPicked = day;
        pendingStart = next.pendingStart;
        value = next.range;
    };
</script>

<CalendarComposite
    {...props}
    bind:month
    computeIsSelected={(day) => RangeCalendarUtils.getIsSelected(day, pendingStart, value)}
    anchorDay={RangeCalendarUtils.computeAnchorDay(pendingStart, lastPicked, value)}
    computeRange={(highlighted) => RangeCalendarUtils.computePaintedRange(highlighted, pendingStart, value)}
    onPick={pick}
/>
