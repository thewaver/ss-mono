<script lang="ts" generics="T">
    import { InteractionTrackerUtils, SafeHrefUtils, TableOfContentsStyles as styles, TableOfContentsUtils } from "@thewaver/ss-components";

    import type { TableOfContentsItemProps } from "./TableOfContents.types.js";

    let props: TableOfContentsItemProps<T> = $props();

    const ariaCurrent = $derived(props.flags.isCurrent ? ("location" as const) : undefined);

    const safeHref = $derived(SafeHrefUtils.resolve(props.link.href, "TableOfContents"));

    const handleClick = (e: MouseEvent) => {
        const target = props.link.target;

        if (!target) return;
        if (safeHref !== undefined && !InteractionTrackerUtils.getIsPlainClick(e)) return;

        e.preventDefault();

        TableOfContentsUtils.goToTarget(target);
        props.onGo();
    };
</script>

{#if safeHref === undefined}
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
        href={safeHref}
        class={styles.tableOfContentsItem}
        id={props.link.id}
        aria-current={ariaCurrent}
        onclick={handleClick}
    >
        {@render props.renderContent(props.flags)}
    </a>
{/if}
