<script lang="ts" generics="T">
    import { TableOfContentsUtils, TableOfContentsStyles as styles } from "@thewaver/ss-components";

    import type { TableOfContentsItemProps } from "./TableOfContents.types.js";

    let props: TableOfContentsItemProps<T> = $props();

    const ariaCurrent = $derived(props.flags.isCurrent ? ("location" as const) : undefined);

    const handleClick = (e: MouseEvent) => {
        const target = props.link.target;

        if (!target) return;

        e.preventDefault();

        TableOfContentsUtils.goToTarget(target);
    };
</script>

{#if props.link.href === undefined}
    <button
        {@attach props.attachElement}
        type="button"
        class={styles.tableOfContentsItem}
        id={props.link.id}
        aria-current={ariaCurrent}
        onclick={handleClick}
    >
        {@render props.renderContent(props.flags)}
    </button>
{:else}
    <a
        {@attach props.attachElement}
        href={props.link.href}
        class={styles.tableOfContentsItem}
        id={props.link.id}
        aria-current={ariaCurrent}
        onclick={handleClick}
    >
        {@render props.renderContent(props.flags)}
    </a>
{/if}
