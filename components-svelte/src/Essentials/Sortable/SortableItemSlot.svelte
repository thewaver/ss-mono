<script lang="ts">
    import { on } from "svelte/events";

    import { SortableStyles as styles } from "@thewaver/ss-components";

    import type { SortableItemSlotProps } from "./Sortable.types.js";

    let props: SortableItemSlotProps = $props();

    const isDisabled = $derived(props.flags.isDisabled ?? false);
</script>

<div
    {@attach props.attachElement}
    {@attach (element) => on(element, "keydown", props.onKeyDown)}
    {@attach (element) => on(element, "click", props.onClick)}
    id={props.id}
    class={styles.sortableItem}
    role="listitem"
    aria-roledescription={props.roleDescription}
    aria-label={props.label}
    aria-describedby={props.hintId}
    aria-posinset={props.position}
    aria-setsize={props.setSize}
    aria-disabled={isDisabled || undefined}
    onpointerdown={props.onPointerDown}
    onfocusin={props.onFocus}
>
    {@render props.renderContent(props.flags)}
</div>
