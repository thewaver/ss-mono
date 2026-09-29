<script lang="ts">
    import type { Snippet } from "svelte";

    import * as styles from "@thewaver/ss-playground/App/StyledComponents/CalendarContent/CalendarContent.css";

    import { getLayerClass } from "../Layer/Layer.context";
    import type { CalendarTitleProps } from "./CalendarContent.types";

    let props: CalendarTitleProps & { children?: Snippet } = $props();

    const layerClass = $derived.by(getLayerClass());
</script>

<div class={[styles.calendarTitle, layerClass, props.flags.isHovered && styles.isHovered]} aria-hidden="true">
    {@render props.children?.()}
</div>
