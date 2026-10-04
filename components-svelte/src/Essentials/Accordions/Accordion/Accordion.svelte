<script lang="ts" generics="T">
    import { on } from "svelte/events";

    import {
        ACCORDION_DEFAULTS,
        type AccordionMoveDirection,
        AccordionUtils,
        AccordionStyles as styles,
    } from "@thewaver/ss-components";

    import { NavigatorSvelteUtils } from "../../../Abstracts/Navigator/NavigatorSvelte.utils.svelte.js";
    import { createHeldValue } from "../../../Utils/bindableUtils.svelte.js";
    import { watchChange } from "../../../Utils/effectUtils.svelte.js";
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

    let root = $state<HTMLDivElement>();
    let moveDirection = $state<AccordionMoveDirection>();

    const direction = NavigatorSvelteUtils.createDirection(() => root ?? undefined);

    const headingLevel = $derived(props.headingLevel ?? ACCORDION_DEFAULTS.headingLevel);
    const sizing = $derived(props.sizing ?? ACCORDION_DEFAULTS.sizing);
    const orientation = $derived(props.orientation ?? ACCORDION_DEFAULTS.orientation);
    const side = $derived(AccordionUtils.getPanelSide(orientation));
    const expandedIndexes = $derived.by(() => {
        const current = getExpanded() ?? [];

        return props.items.reduce<number[]>((acc, item, index) => {
            if (current.includes(item.value)) acc.push(index);

            return acc;
        }, []);
    });

    watchChange(
        () => expandedIndexes,
        (next, previous) => {
            const moved = AccordionUtils.computeMoveDirection(previous, next);

            if (moved) moveDirection = moved;
        },
    );

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
            { orientation, direction: direction() },
        );

        if (target === undefined) return;

        e.preventDefault();

        headerRefs[target]?.focus();
    };
</script>

<div
    bind:this={root}
    {@attach (element) => on(element, "keydown", handleKeyDown)}
    class={[
        styles.accordionRoot,
        styles.accordionSizingVariants[sizing],
        styles.accordionOrientationVariants[orientation],
    ]}
    style:gap={`${props.gap ?? ACCORDION_DEFAULTS.gap}px`}
>
    {#each props.items as item, index (index)}
        <AccordionSection
            bind:ref={() => headerRefs[index], (element) => (headerRefs[index] = element)}
            {item}
            {headingLevel}
            {side}
            isExpanded={getExpanded()?.includes(item.value) ?? false}
            isScrolledIntoViewOnExpand={props.isScrolledIntoViewOnExpand}
            isPanelBuiltOnExpand={props.isPanelBuiltOnExpand}
            transitionDurationMs={props.transitionDurationMs}
            renderHeader={props.renderHeader}
            renderPanel={props.renderPanel}
            {moveDirection}
            onToggle={() => handleToggle(item.value)}
        />
    {/each}
</div>
