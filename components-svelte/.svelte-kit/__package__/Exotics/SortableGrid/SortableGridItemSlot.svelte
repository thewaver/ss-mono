<script lang="ts">
    import { on } from "svelte/events";

    import { SortableGridStyles as styles } from "@thewaver/ss-components";

    import type { SortableGridItemSlotProps } from "./SortableGrid.types.js";

    let props: SortableGridItemSlotProps = $props();

    const isDisabled = $derived(props.flags.isDisabled ?? false);
</script>

<div
    {@attach props.attachElement}
    {@attach (element) => on(element, "keydown", props.onKeyDown)}
    {@attach (element) => on(element, "click", props.onClick)}
    id={props.id}
    class={styles.sortableGridItem}
    role="listitem"
    aria-label={props.label}
    aria-posinset={props.position}
    aria-setsize={props.setSize}
    aria-disabled={isDisabled || undefined}
    aria-describedby={props.hintId}
    onpointerdown={props.onPointerDown}
    onfocusin={props.onFocus}
>
    {#each props.cells as cell}
        <div
            class={styles.sortableGridHit}
            style:left={`${cell.left}px`}
            style:top={`${cell.top}px`}
            style:width={`${cell.width}px`}
            style:height={`${cell.height}px`}
            aria-hidden="true"
        ></div>
    {/each}

    {@render props.renderContent(props.flags)}
</div>
