<script lang="ts" generics="T">
    import { on } from "svelte/events";

    import { ACCORDION_DEFAULTS, AccordionUtils, AccordionStyles as styles } from "@thewaver/ss-components";

    import { createHeldValue } from "../../../Utils/bindableUtils.svelte.js";
    import type { AccordionProps } from "./Accordion.types.js";
    import AccordionSection from "./AccordionSection.svelte";

    let { expanded = $bindable([]), ...props }: AccordionProps<T> = $props();

    const [getExpanded, setExpanded] = createHeldValue([
        () => expanded,
        (next) => {
            expanded = next;
        },
    ]);

    const headerRefs: (HTMLElement | undefined)[] = [];

    const headingLevel = $derived(props.headingLevel ?? ACCORDION_DEFAULTS.headingLevel);
    const sizing = $derived(props.sizing ?? ACCORDION_DEFAULTS.sizing);

    const handleToggle = (value: T) => {
        const current = getExpanded() ?? [];
        const next = AccordionUtils.computeToggled(current, value, {
            isSingleExpand: props.isSingleExpand,
            isExpandRequired: props.isExpandRequired,
        });

        if (next !== current) setExpanded(next);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        const target = AccordionUtils.computeFocusTarget(
            e.key,
            headerRefs,
            AccordionUtils.computeNavigableIndexes(props.items),
            document.activeElement,
        );

        if (target === undefined) return;

        e.preventDefault();

        headerRefs[target]?.focus();
    };
</script>

<div
    {@attach (element) => on(element, "keydown", handleKeyDown)}
    class={[styles.accordionRoot, styles.accordionSizingVariants[sizing]]}
    style:gap={`${props.gap ?? ACCORDION_DEFAULTS.gap}px`}
>
    {#each props.items as item, index (index)}
        <AccordionSection
            bind:ref={() => headerRefs[index], (element) => (headerRefs[index] = element)}
            {item}
            {headingLevel}
            isExpanded={getExpanded()?.includes(item.value) ?? false}
            isScrolledIntoViewOnExpand={props.isScrolledIntoViewOnExpand}
            isPanelBuiltOnExpand={props.isPanelBuiltOnExpand}
            transitionDurationMs={props.transitionDurationMs}
            renderHeader={props.renderHeader}
            renderPanel={props.renderPanel}
            onToggle={() => handleToggle(item.value)}
        />
    {/each}
</div>
