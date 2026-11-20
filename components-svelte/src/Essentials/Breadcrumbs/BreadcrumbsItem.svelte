<script lang="ts" generics="T">
    import { BreadcrumbsStyles as styles, InteractionTrackerUtils, SafeHrefUtils } from "@thewaver/ss-components";

    import type { BreadcrumbsItemProps } from "./Breadcrumbs.types.js";

    let props: BreadcrumbsItemProps<T> = $props();

    const isDisabled = $derived(props.flags.isDisabled ?? false);

    const safeHref = $derived(SafeHrefUtils.resolve(props.crumb.href, "Breadcrumbs"));

    const handleClick = (e: MouseEvent) => {
        if (isDisabled) {
            e.preventDefault();

            return;
        }

        if (safeHref !== undefined && !InteractionTrackerUtils.getIsPlainClick(e)) return;

        props.onSelect(props.crumb.value);
    };
</script>

{#if props.flags.isCurrent}
    <span {@attach props.attachElement} class={styles.breadcrumbsCurrent} id={props.crumb.id} aria-current="page">
        {@render props.renderContent(props.flags)}
    </span>
{:else if safeHref === undefined}
    <button
        {@attach props.attachElement}
        type="button"
        class={styles.breadcrumbsItem}
        id={props.crumb.id}
        aria-disabled={isDisabled || undefined}
        onclick={handleClick}
    >
        {@render props.renderContent(props.flags)}
    </button>
{:else if props.linkComponent}
    <props.linkComponent
        {@attach props.attachElement}
        href={safeHref}
        class={styles.breadcrumbsItem}
        id={props.crumb.id}
        aria-disabled={isDisabled || undefined}
        onclick={handleClick}
    >
        {@render props.renderContent(props.flags)}
    </props.linkComponent>
{:else}
    <a
        {@attach props.attachElement}
        href={safeHref}
        class={styles.breadcrumbsItem}
        id={props.crumb.id}
        aria-disabled={isDisabled || undefined}
        onclick={handleClick}
    >
        {@render props.renderContent(props.flags)}
    </a>
{/if}
