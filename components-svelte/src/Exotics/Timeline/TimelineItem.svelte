<script lang="ts">
    import { on } from "svelte/events";

    import { TimelineStyles as styles } from "@thewaver/ss-components";

    import type { TimelineItemProps } from "./Timeline.types.js";

    let props: TimelineItemProps = $props();

    const isDisabled = $derived(props.flags.isDisabled ?? false);
</script>

<div
    {@attach props.attachElement}
    {@attach (element) =>
        on(element, "click", () => {
            if (isDisabled) return;

            props.onActivate();
        })}
    id={props.id}
    class={styles.timelineControl}
    role="button"
    aria-label={props.ariaLabel}
    aria-describedby={props.ariaDescribedBy}
    aria-disabled={isDisabled || undefined}
    onfocusin={() => props.onFocused()}
>
    {@render props.renderContent(props.flags)}
</div>
