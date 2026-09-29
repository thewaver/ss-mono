<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/CalendarContent/CalendarContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { CalendarDayProps } from "./CalendarContent.types";

    let props: CalendarDayProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.calendarDay,
        layerClass,
        props.renderProps.isSelected && styles.isSelected,
        props.renderProps.isToday && styles.isToday,
        props.renderProps.isOutsideMonth && styles.isOutsideMonth,
        props.renderProps.isHovered && styles.isHovered,
        props.renderProps.isDisabled && styles.isDisabled,
        props.renderProps.isInRange && styles.isInRange,
        props.renderProps.isRangeStart && styles.isRangeStart,
        props.renderProps.isRangeEnd && styles.isRangeEnd,
    ]}
    data-in-range={props.renderProps.isInRange || undefined}
    data-range-start={props.renderProps.isRangeStart || undefined}
    data-range-end={props.renderProps.isRangeEnd || undefined}
    aria-hidden="true"
>
    {props.renderProps.day.day}
</div>
