<script lang="ts">
    import { CALENDAR_DEFAULTS, CalendarUtils } from "@thewaver/ss-components";

    import type { CalendarProps } from "./Calendar.types.js";
    import CalendarComposite from "./CalendarComposite.svelte";

    let { value = $bindable(), month = $bindable(), ...props }: CalendarProps = $props();

    const precision = $derived(props.precision ?? CALENDAR_DEFAULTS.precision);
</script>

<CalendarComposite
    {...props}
    bind:month
    computeIsSelected={(day) => CalendarUtils.getIsSameCell(day, value, precision)}
    anchorDay={value}
    onPick={(day) => {
        value = day;
    }}
/>
