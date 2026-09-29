<script lang="ts">
    import { PreviewStyles as styles } from "@thewaver/ss-components";

    import type { PreviewTriggerProps } from "./Preview.types.js";

    let props: PreviewTriggerProps = $props();

    const isDisabled = $derived(props.flags.isDisabled ?? false);
</script>

<button
    {@attach props.attachElement}
    id={props.id}
    type="button"
    class={styles.previewTrigger}
    aria-expanded={props.isExpanded}
    aria-controls={props.contentId}
    aria-disabled={isDisabled || undefined}
    onclick={() => {
        if (isDisabled) return;

        props.onToggle();
    }}
>
    {@render props.renderTrigger(props.flags)}
</button>
