<script lang="ts" generics="T">
    import { untrack } from "svelte";
    import { on } from "svelte/events";

    import {
        ACCORDION_DEFAULTS,
        type AccordionMoveDirection,
        AccordionUtils,
        AccordionStyles as styles,
    } from "@thewaver/ss-components";

    import { ElementObserverSvelteUtils } from "../../../Abstracts/ElementObserver/ElementObserverSvelte.utils.svelte.js";
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

    let headerElements = $state.raw<(HTMLElement | undefined)[]>([]);

    let root = $state<HTMLDivElement>();
    let moveDirection = $state<AccordionMoveDirection>();

    const direction = NavigatorSvelteUtils.createDirection(() => root ?? undefined);

    const headingLevel = $derived(props.headingLevel ?? ACCORDION_DEFAULTS.headingLevel);
    const sizing = $derived(props.sizing ?? ACCORDION_DEFAULTS.sizing);
    const orientation = $derived(props.orientation ?? ACCORDION_DEFAULTS.orientation);
    const side = $derived(AccordionUtils.getPanelSide(orientation));
    const gap = $derived(props.gap ?? ACCORDION_DEFAULTS.gap);
    const hasRowWidths = $derived(AccordionUtils.getHasRowWidths(orientation, sizing));
    const expandedIndexes = $derived.by(() => {
        const current = getExpanded() ?? [];

        return props.items.reduce<number[]>((acc, item, index) => {
            if (current.includes(item.value)) acc.push(index);

            return acc;
        }, []);
    });

    const getRowSize = ElementObserverSvelteUtils.createBorderBoxSizeObserver(
        () => root ?? undefined,
        () => !hasRowWidths,
    );
    const getStripSizes = ElementObserverSvelteUtils.createBorderBoxSizeListObserver(
        () => headerElements.slice(0, props.items.length),
        () => !hasRowWidths,
    );

    let previousWidths: (number | undefined)[] = [];

    const openWidths = $derived.by(() => {
        if (!hasRowWidths) return [];

        const next = AccordionUtils.computeOpenWidths(
            props.items,
            expandedIndexes,
            { rowWidth: getRowSize().width, stripWidths: getStripSizes().map((size) => size.width), gap },
            previousWidths,
        );

        previousWidths = next;

        return next;
    });

    const setHeaderRef = (index: number, element: HTMLElement | undefined) => {
        headerRefs[index] = element;

        untrack(() => {
            if (headerElements[index] === element) return;

            const next = [...headerElements];

            next[index] = element;
            headerElements = next;
        });
    };

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
    style:gap={`${gap}px`}
>
    {#each props.items as item, index (index)}
        <AccordionSection
            bind:ref={() => headerRefs[index], (element) => setHeaderRef(index, element)}
            {item}
            {headingLevel}
            {side}
            isExpanded={getExpanded()?.includes(item.value) ?? false}
            isSideways={orientation === "horizontal"}
            openWidth={openWidths[index]}
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
