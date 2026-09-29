<script lang="ts">
    import * as styles from "@thewaver/ss-playground/App/StyledComponents/CalendarContent/CalendarContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { CalendarCaptionFieldsProps } from "./CalendarContent.types";

    let { ref = $bindable(), children, ...props }: CalendarCaptionFieldsProps = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div bind:this={ref} {...props} class={[styles.calendarCaptionFields, layerClass]}>{@render children?.()}</div>
