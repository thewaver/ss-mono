<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/CalendarContent/CalendarContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { CalendarDayProps } from "./CalendarContent.types";

    let props: CalendarDayProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div
    class={[
        styles.calendarDay,
        styles.isWide,
        layerClass,
        props.renderProps.isSelected && styles.isSelected,
        props.renderProps.isToday && styles.isToday,
        props.renderProps.isHovered && styles.isHovered,
        props.renderProps.isDisabled && styles.isDisabled,
    ]}
    aria-hidden="true"
>
    {@render props.children?.()}
</div>
