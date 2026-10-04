<script lang="ts" generics="T">
    import { AccordionUtils, AccordionStyles as styles } from "@thewaver/ss-components";

    import Collapsible from "../Collapsible/Collapsible.svelte";
    import type { AccordionSectionProps } from "./Accordion.types.js";

    let { ref = $bindable(), ...props }: AccordionSectionProps<T> = $props();

    const headerId = $props.id();
</script>

<Collapsible
    bind:ref
    id={headerId}
    isDisabled={props.item.isDisabled ?? false}
    isFocusableWhenDisabled={props.item.isReachableWhenDisabled ?? false}
    headingLevel={props.headingLevel}
    side={props.side}
    sizing={props.isSideways ? "fit-content" : "fill"}
    isScrolledIntoViewOnExpand={props.isScrolledIntoViewOnExpand}
    isPanelBuiltOnExpand={props.isPanelBuiltOnExpand}
    transitionDurationMs={props.transitionDurationMs}
    panelRole="region"
    panelAriaAttributes={{ "aria-labelledby": headerId }}
    bind:expanded={() => props.isExpanded, () => props.onToggle()}
>
    {#snippet renderTrigger(flags)}
        {@render props.renderHeader(props.item, flags)}
    {/snippet}

    {#snippet renderPanel(visibilityTarget, transitionDurationMs)}
        {#if props.isSideways}
            <div class={styles.accordionPanelSizer} style:width={AccordionUtils.toWidthStyle(props.openWidth)}>
                {@render props.renderPanel(props.item, visibilityTarget, transitionDurationMs, props.moveDirection)}
            </div>
        {:else}
            {@render props.renderPanel(props.item, visibilityTarget, transitionDurationMs, props.moveDirection)}
        {/if}
    {/snippet}
</Collapsible>
