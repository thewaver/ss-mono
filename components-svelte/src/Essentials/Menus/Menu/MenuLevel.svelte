<script lang="ts" generics="T">
    import { untrack } from "svelte";
    import { SvelteMap } from "svelte/reactivity";

    import {
        FloaterStyles as floaterStyles,
        MENU_DEFAULTS,
        MenuUtils,
        TypeaheadUtils,
        MenuStyles as styles,
    } from "@thewaver/ss-components";
    import type { Point2d } from "@thewaver/ss-utils";

    import { FloaterSvelteUtils } from "../../../Abstracts/Floater/FloaterSvelte.utils.svelte.js";
    import { TypeaheadSvelteUtils } from "../../../Abstracts/Typeahead/TypeaheadSvelte.utils.svelte.js";
    import PlacementBox from "../../../Primitives/PlacementBox/PlacementBox.svelte";
    import PlacementItem from "../../../Primitives/PlacementItem/PlacementItem.svelte";
    import Popover from "../../../Primitives/Popover/Popover.svelte";
    import { watchChange } from "../../../Utils/effectUtils.svelte.js";
    import { toStyle } from "../../../Utils/styleUtils.js";
    import type { MenuItem, MenuLevelProps } from "./Menu.types.js";
    import MenuEntry from "./MenuEntry.svelte";

    const NO_PARENT_EXTENT = 0;

    let props: MenuLevelProps<T> = $props();

    let highlightedValue = $state.raw<T>();
    let openValue = $state.raw<T>();
    let isCoveredWhileClosing = $state(false);
    let layoutRoot = $state<HTMLElement>();
    let itemsWrapper = $state<HTMLDivElement>();

    const itemRefs = new SvelteMap<number, HTMLElement>();

    const typeahead = TypeaheadSvelteUtils.createBuffer();

    const hasBackEntry = $derived(MenuUtils.getHasBackEntry(props.submenuMode, props.openerItem !== undefined));
    const isCovered = $derived(
        props.submenuMode === "replace" && (openValue !== undefined || isCoveredWhileClosing),
    );

    watchChange(
        () => props.isOpen,
        (isOpen) => {
            if (isOpen) {
                isCoveredWhileClosing = false;

                return;
            }

            isCoveredWhileClosing = isCovered;
            highlightedValue = undefined;
            openValue = undefined;
        },
        { isBeforeRender: true },
    );

    const entries = $derived(MenuUtils.computeEntries(props.items, props.openerItem, props.submenuMode));

    const navigable = $derived(MenuUtils.computeNavigableIndexes(entries));

    const highlightedIndex = $derived(
        MenuUtils.computeHighlightedIndex({
            isOpen: props.isOpen,
            entries,
            navigable,
            highlightedValue,
            initialHighlightPosition: props.initialHighlightPosition,
            hasBackEntry,
        }),
    );

    const itemCount = $derived(entries.length);

    const layout = $derived(
        props.computeLayout?.({
            itemCount,
            path: props.path,
            parentExtent: props.parentExtent,
            parentPlacement: props.parentPlacement,
        }),
    );

    const isLaidOut = $derived(layout !== undefined);
    const rootExtent = $derived(MenuUtils.computeRootExtent(props.rootExtent, layout));

    const getItemId = (index: number) => `${props.id}-item-${index}`;

    const activeItemId = $derived(highlightedIndex === undefined ? undefined : getItemId(highlightedIndex));

    const computeItemText = (index: number) =>
        props.computeCustomText?.(entries[index]) ??
        TypeaheadUtils.getElementText(document.getElementById(getItemId(index)));

    const highlightIndex = (index: number | undefined) => {
        if (index === undefined) return;

        highlightedValue = entries[index].value;
    };

    const openIndex = (index: number) => {
        const value = entries[index].value;

        highlightedValue = value;
        openValue = value;
    };

    const flickTo = (point: Point2d) => {
        const index = MenuUtils.computeFlickIndex({
            layout,
            origin: props.flickOrigin,
            point,
            box: layoutRoot?.getBoundingClientRect(),
            navigable,
        });

        highlightedValue = index === undefined ? undefined : entries[index].value;

        return index;
    };

    const hoverIndex = (index: number, point: Point2d) => {
        if (!navigable.includes(index)) return;
        if (!MenuUtils.getIsPointerLed(MenuUtils.getPointerPoint(), point)) return;

        const value = entries[index].value;

        highlightedValue = value;

        if (props.submenuOpensOn !== "hover") return;

        openValue = MenuUtils.getOpensSubmenu(entries, index, hasBackEntry) ? value : undefined;
    };

    const activateIndex = (index: number) => {
        const activation = MenuUtils.computeActivation<T, MenuItem<T>>(entries, index, hasBackEntry);

        if (activation.type === "back") {
            props.onClose();

            return;
        }

        if (activation.type === "open") {
            openIndex(index);

            return;
        }

        props.onPick(activation.item, activation.radioGroupValues);
    };

    $effect(() => {
        if (props.flickOrigin === undefined) return;

        return untrack(() =>
            MenuUtils.observeFlick({
                onMove: (point) => {
                    flickTo(point);
                },
                onRelease: (point, releasedOn) => {
                    const index = flickTo(point);

                    props.onFlickEnd?.(releasedOn);

                    if (index !== undefined) activateIndex(index);
                },
                onCancel: () => {
                    highlightedValue = undefined;
                    props.onFlickEnd?.(undefined);
                },
            }),
        );
    });

    const handleKeyDown = (e: KeyboardEvent) => {
        if (!(e.target instanceof HTMLElement) || e.target.id !== props.id) return;

        const query = typeahead.push(e);

        if (query !== undefined) {
            e.preventDefault();
            highlightIndex(MenuUtils.computeTypeaheadIndex(query, navigable, highlightedIndex, computeItemText));

            return;
        }

        const step = MenuUtils.computeLevelKeyStep(e.key, {
            entries,
            navigable,
            highlightedIndex,
            hasBackEntry,
            isLaidOut,
            depth: props.path.length,
            direction: props.direction,
        });

        if (step === undefined) return;

        e.preventDefault();

        if (step.type === "dismiss") props.onDismiss();
        else if (step.type === "activate") activateIndex(step.index);
        else if (step.type === "open") openIndex(step.index);
        else if (step.type === "highlight") highlightIndex(step.index);
        else if (step.type === "close") {
            if (step.isContained) e.stopImmediatePropagation();

            props.onClose();
        }
    };

    const runs = $derived(MenuUtils.getRuns<T, MenuItem<T>>(entries));

    const recordItemRef = (index: number, element: HTMLElement) => {
        untrack(() => itemRefs.set(index, element));

        return () => {
            if (untrack(() => itemRefs.get(index)) === element) itemRefs.delete(index);
        };
    };

    const floaterTransitionDurationMs = $derived(
        props.floaterTransitionDurationMs ?? MENU_DEFAULTS.floaterTransitionDurationMs,
    );

    const highlightFloater = FloaterSvelteUtils.create({
        getIsEnabled: () => props.renderHighlightFloater !== undefined,
        getContainer: () => itemsWrapper ?? undefined,
        getTarget: () => (highlightedIndex === undefined ? undefined : itemRefs.get(highlightedIndex)),
        getLayout: () => layout,
        getPlacement: () => (highlightedIndex === undefined ? undefined : layout?.placements[highlightedIndex]),
        getTransitionDurationMs: () => floaterTransitionDurationMs,
    });
</script>

{#snippet entry(item: MenuItem<T>, index: number)}
    {@const placement = layout?.placements[index]}
    {@const hasSubmenu = MenuUtils.getHasSubmenu(entries, index, hasBackEntry)}
    {#snippet element()}
        <MenuEntry
            level={props}
            {item}
            {index}
            {placement}
            isHighlighted={index === highlightedIndex}
            isBack={MenuUtils.getIsBackAt(hasBackEntry, index)}
            {hasSubmenu}
            isSubmenuOpen={hasSubmenu && openValue === item.value}
            {isLaidOut}
            levelExtent={layout?.extent ?? NO_PARENT_EXTENT}
            {rootExtent}
            onActivate={activateIndex}
            onHover={hoverIndex}
            onSubmenuClose={() => {
                openValue = undefined;
            }}
            {recordItemRef}
        />
    {/snippet}

    {#if placement}
        <PlacementItem {placement} stackAt={index + 1}>
            {@render element()}
        </PlacementItem>
    {:else}
        {@render element()}
    {/if}
{/snippet}

{#snippet renderRuns()}
    {#each runs as run (run.from)}
        {#if run.isRadioGroup}
            <div role="group" class={isLaidOut ? styles.menuLayoutGroup : undefined}>
                {#each run.items as item, offset (offset)}
                    {@render entry(item, run.from + offset)}
                {/each}
            </div>
        {:else}
            {#each run.items as item, offset (offset)}
                {@render entry(item, run.from + offset)}
            {/each}
        {/if}
    {/each}
{/snippet}

{#snippet highlightFloaterView()}
    {#if highlightFloater.getIsRendered()}
        <div
            {@attach highlightFloater.attachRef}
            class={floaterStyles.floater}
            style={toStyle(highlightFloater.getBounds(), { transitionDuration: `${floaterTransitionDurationMs}ms` })}
        >
            {@render props.renderHighlightFloater?.(
                highlightFloater.getVisibilityTarget(),
                floaterTransitionDurationMs,
            )}
        </div>
    {/if}
{/snippet}

{#snippet renderItems()}
    {#if layout}
        <div
            style:width={MenuUtils.computeLayoutWidth(props.layoutSize, layout.extent, rootExtent)}
            style:transform={MenuUtils.computeLayoutShift(layout)}
        >
            <PlacementBox {layout} bind:ref={layoutRoot} computeEffect={props.computeEffect}>
                {@render highlightFloaterView()}
                {@render renderRuns()}
            </PlacementBox>
        </div>
    {:else}
        <div bind:this={itemsWrapper} class={styles.menuItems} role="presentation">
            {@render highlightFloaterView()}
            {@render renderRuns()}
        </div>
    {/if}
{/snippet}

<Popover
    id={props.id}
    role="menu"
    ariaAttributes={{
        "aria-labelledby": props.labelledBy,
        "aria-label": props.ariaLabel,
        "aria-activedescendant": activeItemId,
    }}
    placement={props.placement}
    offset={props.offset}
    reservedScreenSize={props.reservedScreenSize}
    transitionDurationMs={props.transitionDurationMs}
    hasAutoFocus={true}
    isTransparentToPointer={isLaidOut}
    isPinned={isLaidOut}
    {isCovered}
    isOpen={props.isOpen}
    anchorRef={props.anchorRef}
    anchorRect={props.anchorRect}
    onKeyDown={handleKeyDown}
    onDismiss={() => props.onClose()}
>
    {#snippet renderContent(visibilityTarget, transitionDurationMs, placement)}
        {@render props.renderPopup(renderItems, visibilityTarget, transitionDurationMs, placement, props.openerFlags)}
    {/snippet}
</Popover>
