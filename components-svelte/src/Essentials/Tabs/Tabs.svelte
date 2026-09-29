<script lang="ts" generics="T">
    import { untrack } from "svelte";
    import { on } from "svelte/events";

    import {
        type InteractionFlags,
        TABS_DEFAULTS,
        type TabsFloaterBounds,
        TabsUtils,
        TabsStyles as styles,
    } from "@thewaver/ss-components";

    import { ElementFaderSvelteUtils } from "../../Abstracts/ElementFader/ElementFaderSvelte.utils.svelte.js";
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
    let floater = $state<HTMLDivElement>();
    let itemElements = $state.raw<(HTMLElement | undefined)[]>([]);
    let focusedValue = $state.raw<T>();
    let measuredBounds = $state.raw<TabsFloaterBounds>();

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
    const selectedPlacement = $derived(layout?.placements[selectedIndex]);

    const floaterBounds = $derived(
        layout === undefined
            ? measuredBounds
            : selectedPlacement === undefined
              ? undefined
              : TabsUtils.computePlacedBounds(selectedPlacement),
    );

    const isFloaterShown = $derived(selectedIndex >= 0 && floaterBounds !== undefined);

    const floaterFader = ElementFaderSvelteUtils.createFader(() => isFloaterShown, {
        getTransitionDurationMs: () => transitionDurationMs,
        getRef: () => floater ?? undefined,
    });

    $effect(() => {
        if (floaterFader.getIsVisible()) return;

        measuredBounds = undefined;
    });

    const hasFloater = $derived(props.renderFloater !== undefined);
    const selectedItem = $derived(itemElements[selectedIndex]);

    $effect(() => {
        const element = root;
        const item = selectedItem;

        if (!hasFloater || layout !== undefined || !element || !item) return;

        return untrack(() =>
            TabsUtils.observeSelectedBounds(element, item, (bounds) => {
                measuredBounds = bounds;
            }),
        );
    });

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

    const isFloaterRendered = $derived(hasFloater && floaterFader.getIsVisible() && floaterBounds !== undefined);
</script>

{#snippet content()}
    {#if isFloaterRendered}
        <div
            bind:this={floater}
            class={styles.tabsFloater}
            style={toStyle(floaterBounds, { transitionDuration: `${transitionDurationMs}ms` })}
        >
            {@render props.renderFloater?.(floaterFader.getTransitionTarget(), transitionDurationMs)}
        </div>
    {/if}

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
    class={styles.tabsRoot}
    style:flex-direction={orientation === "horizontal" ? "row" : "column"}
    style:gap={`${tabGap}px`}
    role="tablist"
    aria-label={props.ariaLabel}
    aria-orientation={orientation}
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
