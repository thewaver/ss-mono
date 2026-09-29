<script lang="ts">
    import { on } from "svelte/events";

    import { ClockStyles as styles } from "@thewaver/ss-components";

    import type { ClockOptionProps } from "./Clock.types.js";

    let props: ClockOptionProps = $props();

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
    class={styles.clockOption}
    role="option"
    aria-label={props.ariaLabel}
    aria-selected={props.flags.isSelected}
    aria-current={props.flags.isNow ? "time" : undefined}
    aria-disabled={isDisabled || undefined}
>
    {@render props.renderContent(props.flags)}
</div>
