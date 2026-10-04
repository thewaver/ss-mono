<script lang="ts" generics="T">
    import { untrack } from "svelte";
    import { on } from "svelte/events";

    import type { Snippet } from "svelte";

    import {
        FloaterStyles as floaterStyles,
        type InteractionFlags,
        TABS_DEFAULTS,
        TabsUtils,
        TabsStyles as styles,
    } from "@thewaver/ss-components";

    import { FloaterSvelteUtils } from "../../Abstracts/Floater/FloaterSvelte.utils.svelte.js";
    import { NavigatorSvelteUtils } from "../../Abstracts/Navigator/NavigatorSvelte.utils.svelte.js";
    import InteractionWrapper from "../../Primitives/InteractionWrapper/InteractionWrapper.svelte";
    import PlacementBox from "../../Primitives/PlacementBox/PlacementBox.svelte";
    import PlacementItem from "../../Primitives/PlacementItem/PlacementItem.svelte";
    import { watchChange } from "../../Utils/effectUtils.svelte.js";
    import { toStyle } from "../../Utils/styleUtils.js";
    import type { TabsProps } from "./Tabs.types.js";
    import TabsItem from "./TabsItem.svelte";

    let props: TabsProps<T> = $props();

    let root = $state<HTMLDivElement>();
    let itemElements = $state.raw<(HTMLElement | undefined)[]>([]);
    let focusedValue = $state.raw<T>();
    let hoveredIndex = $state<number>();
    let focusedIndex = $state<number>();

    watchChange(
        () => props.selectedValue,
        () => {
            focusedValue = undefined;
        },
        { isBeforeRender: true },
    );

    const transitionDurationMs = $derived(props.transitionDurationMs ?? TABS_DEFAULTS.transitionDurationMs);
    const orientation = $derived(props.orientation ?? TABS_DEFAULTS.orientation);
    const tabGap = $derived(props.tabGap ?? TABS_DEFAULTS.tabGap);
    const itemCount = $derived(props.tabs.length);

    const direction = NavigatorSvelteUtils.createDirection(() => root ?? undefined);

    const layout = $derived(props.computeLayout?.({ itemCount }));

    const selectedIndex = $derived(TabsUtils.computeSelectedIndex(props.tabs, props.selectedValue));
    const rovingIndex = $derived(TabsUtils.computeRovingIndex(props.tabs, props.selectedValue, focusedValue));
    const highlightIndex = $derived(hoveredIndex ?? focusedIndex);

    const findItemIndex = (target: EventTarget | null) =>
        target instanceof Node ? itemElements.findIndex((item) => item?.contains(target) ?? false) : -1;

    const createFloater = (getIsEnabled: () => boolean, getIndex: () => number | undefined) =>
        FloaterSvelteUtils.create({
            getIsEnabled,
            getContainer: () => (layout === undefined ? (root ?? undefined) : undefined),
            getTarget: () => {
                const index = getIndex();

                return index === undefined || index < 0 ? undefined : itemElements[index];
            },
            getLayout: () => layout,
            getPlacement: () => {
                const index = getIndex();

                return index === undefined || index < 0 ? undefined : layout?.placements[index];
            },
            getTransitionDurationMs: () => transitionDurationMs,
        });

    const selectionFloater = createFloater(
        () => props.renderSelectionFloater !== undefined,
        () => selectedIndex,
    );

    const highlightFloater = createFloater(
        () => props.renderHighlightFloater !== undefined,
        () => highlightIndex,
    );

    const setItemRef = (index: number, element: HTMLElement | undefined) =>
        untrack(() => {
            if (itemElements[index] === element) return;

            const next = [...itemElements];

            next[index] = element;
            itemElements = next;
        });

    const handleKeyDown = (e: KeyboardEvent) => {
        const step = TabsUtils.computeKeyStep(e.key, props.tabs, {
            selectedValue: props.selectedValue,
            focusedValue,
            orientation,
            direction: layout === undefined ? direction() : undefined,
            hasAutoActivation: props.hasAutoActivation ?? false,
        });

        if (step === undefined) return;

        e.preventDefault();

        focusedValue = step.value;
        itemElements[step.index]?.focus();

        if (step.isSelecting) props.onSelectionChange?.(step.value);
    };

    const handlePointerOver = (e: PointerEvent) => {
        const index = findItemIndex(e.target);

        hoveredIndex = index < 0 ? undefined : index;
    };
</script>

{#snippet floaterView(
    floater: ReturnType<typeof createFloater>,
    renderContent: Snippet<[visibilityTarget: 0 | 1, transitionDurationMs: number]> | undefined,
)}
    {#if floater.getIsRendered()}
        <div
            {@attach floater.attachRef}
            class={floaterStyles.floater}
            style={toStyle(floater.getBounds(), { transitionDuration: `${transitionDurationMs}ms` })}
        >
            {@render renderContent?.(floater.getVisibilityTarget(), transitionDurationMs)}
        </div>
    {/if}
{/snippet}

{#snippet content()}
    {@render floaterView(highlightFloater, props.renderHighlightFloater)}
    {@render floaterView(selectionFloater, props.renderSelectionFloater)}

    {#each props.tabs as tab, index (index)}
        {@const placement = layout?.placements[index]}
        {#snippet element()}
            <InteractionWrapper
                sizing={orientation === "vertical" || layout !== undefined ? "fill" : "fit-content"}
                isDisabled={tab.isDisabled ?? false}
                isFocusableWhenDisabled={tab.isReachableWhenDisabled ?? false}
                isTabbable={index === rovingIndex}
                bind:ref={() => itemElements[index], (itemElement) => setItemRef(index, itemElement)}
            >
                {#snippet renderControl(attachElement, flags)}
                    {#snippet tabContent(itemFlags: InteractionFlags)}
                        {@render props.renderTab(tab, itemFlags, placement)}
                    {/snippet}

                    <TabsItem
                        {attachElement}
                        {tab}
                        {flags}
                        isSelected={index === selectedIndex}
                        linkComponent={props.linkComponent}
                        renderContent={tabContent}
                        onSelect={(value) => {
                            if (value === props.selectedValue) return;

                            props.onSelectionChange?.(value);
                        }}
                    />
                {/snippet}
            </InteractionWrapper>
        {/snippet}

        {#if placement}
            <PlacementItem {placement}>
                {@render element()}
            </PlacementItem>
        {:else}
            {@render element()}
        {/if}
    {/each}
{/snippet}

<div
    bind:this={root}
    {@attach (element) => on(element, "keydown", handleKeyDown)}
    {@attach (element) => on(element, "pointerover", handlePointerOver)}
    {@attach (element) =>
        on(element, "pointerleave", () => {
            hoveredIndex = undefined;
        })}
    class={styles.tabsRoot}
    style:flex-direction={orientation === "horizontal" ? "row" : "column"}
    style:gap={`${tabGap}px`}
    role="tablist"
    aria-label={props.ariaLabel}
    aria-orientation={orientation}
    onfocusin={(e) => {
        const index = findItemIndex(e.target);

        focusedIndex = index < 0 ? undefined : index;
    }}
    onfocusout={() => {
        focusedIndex = undefined;
    }}
>
    {#if props.renderGutter}
        <div class={styles.tabsGutter}>{@render props.renderGutter()}</div>
    {/if}

    {#if layout}
        <PlacementBox {layout} computeEffect={props.computeEffect}>
            {@render content()}
        </PlacementBox>
    {:else}
        {@render content()}
    {/if}
</div>
