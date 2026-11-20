<script lang="ts" generics="TExtra extends object">
    import { InteractionTrackerUtils, PaginatorStyles as styles, SafeHrefUtils } from "@thewaver/ss-components";

    import type { PaginatorItemProps } from "./Paginator.types.js";

    let props: PaginatorItemProps<TExtra> = $props();

    const isDisabled = $derived(props.flags.isDisabled ?? false);
    const ariaCurrent = $derived(props.isCurrent ? ("page" as const) : undefined);

    const safeHref = $derived(SafeHrefUtils.resolve(props.href, "Paginator"));

    const handleClick = (e: MouseEvent) => {
        if (isDisabled) {
            e.preventDefault();

            return;
        }

        if (safeHref !== undefined && !InteractionTrackerUtils.getIsPlainClick(e)) return;

        props.onActivate();
    };
</script>

{#if safeHref === undefined}
    <button
        {@attach props.attachElement}
        type="button"
        class={styles.paginatorItem}
        id={props.id}
        aria-label={props.ariaLabel}
        aria-disabled={isDisabled || undefined}
        aria-current={ariaCurrent}
        onclick={handleClick}
    >
        {@render props.renderContent(props.flags)}
    </button>
{:else if props.linkComponent}
    <props.linkComponent
        {@attach props.attachElement}
        href={safeHref}
        class={styles.paginatorItem}
        id={props.id}
        aria-label={props.ariaLabel}
        aria-disabled={isDisabled || undefined}
        aria-current={ariaCurrent}
        onclick={handleClick}
    >
        {@render props.renderContent(props.flags)}
    </props.linkComponent>
{:else}
    <a
        {@attach props.attachElement}
        href={safeHref}
        class={styles.paginatorItem}
        id={props.id}
        aria-label={props.ariaLabel}
        aria-disabled={isDisabled || undefined}
        aria-current={ariaCurrent}
        onclick={handleClick}
    >
        {@render props.renderContent(props.flags)}
    </a>
{/if}
