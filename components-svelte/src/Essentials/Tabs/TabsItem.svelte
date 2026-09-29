<script lang="ts" generics="T">
    import { TabsStyles as styles } from "@thewaver/ss-components";

    import type { TabsItemProps } from "./Tabs.types.js";

    let props: TabsItemProps<T> = $props();

    const isDisabled = $derived(props.flags.isDisabled ?? false);

    const handleClick = (e: MouseEvent) => {
        if (isDisabled) {
            e.preventDefault();

            return;
        }

        props.onSelect(props.tab.value);
    };
</script>

{#if props.tab.href === undefined}
    <button
        {@attach props.attachElement}
        type="button"
        class={styles.tabsItem}
        role="tab"
        id={props.tab.id}
        aria-controls={props.tab.panelId}
        aria-disabled={isDisabled || undefined}
        aria-selected={props.isSelected}
        onclick={handleClick}
    >
        {@render props.renderContent(props.flags)}
    </button>
{:else if props.linkComponent}
    <props.linkComponent
        {@attach props.attachElement}
        href={props.tab.href}
        class={styles.tabsItem}
        role="tab"
        id={props.tab.id}
        aria-controls={props.tab.panelId}
        aria-disabled={isDisabled || undefined}
        aria-selected={props.isSelected}
        onclick={handleClick}
    >
        {@render props.renderContent(props.flags)}
    </props.linkComponent>
{:else}
    <a
        {@attach props.attachElement}
        href={props.tab.href}
        class={styles.tabsItem}
        role="tab"
        id={props.tab.id}
        aria-controls={props.tab.panelId}
        aria-disabled={isDisabled || undefined}
        aria-selected={props.isSelected}
        onclick={handleClick}
    >
        {@render props.renderContent(props.flags)}
    </a>
{/if}
