<script lang="ts">
    import { on } from "svelte/events";

    import { CalendarStyles as styles } from "@thewaver/ss-components";

    import type { CalendarDayProps } from "./Calendar.types.js";

    let props: CalendarDayProps = $props();

    const isDisabled = $derived(props.flags.isDisabled ?? false);
</script>

<div
    {@attach props.attachElement}
    {@attach (element) =>
        on(element, "click", () => {
            if (isDisabled) return;

            props.onSelect();
        })}
    id={props.id}
    class={styles.calendarDay}
    role="gridcell"
    aria-label={props.ariaLabel}
    aria-selected={props.flags.isSelected}
    aria-current={props.flags.isToday ? "date" : undefined}
    aria-disabled={isDisabled || undefined}
>
    {@render props.renderContent(props.flags)}
</div>
