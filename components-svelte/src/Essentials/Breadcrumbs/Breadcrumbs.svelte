<script lang="ts" generics="T">
    import {
        BREADCRUMBS_DEFAULTS,
        type BreadcrumbsFlags,
        type InteractionFlags,
        BreadcrumbsStyles as styles,
    } from "@thewaver/ss-components";

    import InteractionWrapper from "../../Primitives/InteractionWrapper/InteractionWrapper.svelte";
    import type { BreadcrumbsProps } from "./Breadcrumbs.types.js";
    import BreadcrumbsItem from "./BreadcrumbsItem.svelte";

    let props: BreadcrumbsProps<T> = $props();

    const lastIndex = $derived(props.crumbs.length - 1);
</script>

<nav class={styles.breadcrumbsRoot} aria-label={props.ariaLabel}>
    <ol class={styles.breadcrumbsList} style:gap={`${props.gap ?? BREADCRUMBS_DEFAULTS.gap}px`}>
        {#each props.crumbs as crumb, index (index)}
            <li class={styles.breadcrumbsEntry}>
                <InteractionWrapper
                    isDisabled={crumb.isDisabled ?? false}
                    isFocusableWhenDisabled={crumb.isReachableWhenDisabled ?? false}
                    isTabbable={index !== lastIndex}
                    extraFlags={{ isCurrent: index === lastIndex }}
                >
                    {#snippet renderControl(attachElement, flags)}
                        {#snippet crumbContent(itemFlags: InteractionFlags<BreadcrumbsFlags>)}
                            {@render props.renderCrumb(crumb, itemFlags)}
                        {/snippet}

                        <BreadcrumbsItem
                            {attachElement}
                            {crumb}
                            {flags}
                            linkComponent={props.linkComponent}
                            renderContent={crumbContent}
                            onSelect={(value) => props.onSelect?.(value)}
                        />
                    {/snippet}
                </InteractionWrapper>

                {#if props.renderSeparator && index !== lastIndex}
                    <span class={styles.breadcrumbsSeparator} aria-hidden="true">
                        {@render props.renderSeparator()}
                    </span>
                {/if}
            </li>
        {/each}
    </ol>
</nav>
