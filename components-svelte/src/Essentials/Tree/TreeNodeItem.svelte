<script lang="ts">
    import { on } from "svelte/events";

    import { TreeStyles as styles } from "@thewaver/ss-components";

    import type { TreeNodeItemProps } from "./Tree.types.js";

    let props: TreeNodeItemProps = $props();

    const isDisabled = $derived(props.flags.isDisabled ?? false);
    const ariaExpanded = $derived(props.flags.isBranch ? props.flags.isExpanded : undefined);
    const ariaBusy = $derived(props.flags.isPending || undefined);

    const handleClick = (e: MouseEvent) => {
        if (isDisabled) {
            e.preventDefault();

            return;
        }

        props.onActivate();
    };
</script>

{#if props.href === undefined}
    <div
        {@attach props.attachElement}
        {@attach (element) => on(element, "click", handleClick)}
        class={styles.treeNode}
        role="treeitem"
        id={props.id}
        aria-disabled={isDisabled || undefined}
        aria-selected={props.flags.isSelected}
        aria-expanded={ariaExpanded}
        aria-busy={ariaBusy}
        aria-level={props.level}
        aria-posinset={props.position}
        aria-setsize={props.setSize}
    >
        {@render props.renderContent(props.flags)}
    </div>
{:else if props.linkComponent}
    <props.linkComponent
        {@attach props.attachElement}
        href={props.href}
        class={styles.treeNode}
        role="treeitem"
        id={props.id}
        aria-disabled={isDisabled || undefined}
        aria-selected={props.flags.isSelected}
        aria-expanded={ariaExpanded}
        aria-busy={ariaBusy}
        aria-level={props.level}
        aria-posinset={props.position}
        aria-setsize={props.setSize}
        onclick={handleClick}
    >
        {@render props.renderContent(props.flags)}
    </props.linkComponent>
{:else}
    <a
        {@attach props.attachElement}
        href={props.href}
        class={styles.treeNode}
        role="treeitem"
        id={props.id}
        aria-disabled={isDisabled || undefined}
        aria-selected={props.flags.isSelected}
        aria-expanded={ariaExpanded}
        aria-busy={ariaBusy}
        aria-level={props.level}
        aria-posinset={props.position}
        aria-setsize={props.setSize}
        onclick={handleClick}
    >
        {@render props.renderContent(props.flags)}
    </a>
{/if}
