<script lang="ts" generics="TExtra extends object">
    import { PaginatorStyles as styles } from "@thewaver/ss-components";

    import type { PaginatorItemProps } from "./Paginator.types.js";

    let props: PaginatorItemProps<TExtra> = $props();

    const isDisabled = $derived(props.flags.isDisabled ?? false);
    const ariaCurrent = $derived(props.isCurrent ? ("page" as const) : undefined);

    const handleClick = (e: MouseEvent) => {
        if (isDisabled) {
            e.preventDefault();

            return;
        }

        props.onActivate();
    };
</script>

{#if props.href === undefined}
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
        href={props.href}
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
        href={props.href}
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
