<script lang="ts" generics="T">
    import type { Snippet } from "svelte";

    import type { CollapsibleSectionFlags } from "@thewaver/ss-components";

    import Collapsible from "../Collapsible/Collapsible.svelte";
    import type { AccordionSectionProps } from "./Accordion.types.js";

    let { ref = $bindable(), ...props }: AccordionSectionProps<T> = $props();

    const headerId = $props.id();
</script>

{#snippet section(renderContent: Snippet, flags: CollapsibleSectionFlags)}
    {@render props.renderSection?.(renderContent, props.item, flags)}
{/snippet}

<Collapsible
    bind:ref
    renderSection={props.renderSection === undefined ? undefined : section}
    id={headerId}
    isDisabled={props.item.isDisabled ?? false}
    isFocusableWhenDisabled={props.item.isReachableWhenDisabled ?? false}
    headingLevel={props.headingLevel}
    side={props.side}
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
        {@render props.renderPanel(props.item, visibilityTarget, transitionDurationMs, props.moveDirection)}
    {/snippet}
</Collapsible>
