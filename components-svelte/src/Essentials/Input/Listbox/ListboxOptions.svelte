<script lang="ts" generics="T">
    import { type Snippet, untrack } from "svelte";
    import { on } from "svelte/events";
    import { SvelteMap } from "svelte/reactivity";

    import {
        FloaterStyles as floaterStyles,
        type InteractionFlags,
        LISTBOX_DEFAULTS,
        ListboxUtils,
        type ListboxWindowedRun,
        type SelectOptionFlags,
        SelectUtils,
        type VirtualizerRow,
        ListboxStyles as styles,
    } from "@thewaver/ss-components";

    import { ElementObserverSvelteUtils } from "../../../Abstracts/ElementObserver/ElementObserverSvelte.utils.svelte.js";
    import { FloaterSvelteUtils } from "../../../Abstracts/Floater/FloaterSvelte.utils.svelte.js";
    import { VirtualizerSvelteUtils } from "../../../Abstracts/Virtualizer/VirtualizerSvelte.utils.svelte.js";
    import InteractionWrapper from "../../../Primitives/InteractionWrapper/InteractionWrapper.svelte";
    import { toStyle } from "../../../Utils/styleUtils.js";
    import type {
        SelectItem,
        SelectOption,
        SelectOptionGroup,
        SelectOptionTooltipDefs,
    } from "../Select/Select.types.js";
    import type { ListboxOptionsProps } from "./Listbox.types.js";
    import ListboxOptionItem from "./ListboxOptionItem.svelte";

    let props: ListboxOptionsProps<T> = $props();

    let endMarker = $state<HTMLDivElement>();
    let sizer = $state<HTMLDivElement>();
    let optionsWrapper = $state<HTMLDivElement>();
    let hoveredIndex = $state<number>();

    const optionRefs = new SvelteMap<HTMLElement, () => number>();

    const cursor = $derived(props.cursor);
    const isRoving = $derived(cursor.focusModel === "roving");
    const isListDisabled = $derived(props.isDisabled ?? false);
    const hasMoreOptions = $derived(props.hasMoreOptions ?? false);
    const isHorizontal = $derived(cursor.getOrientation() === "horizontal");
    const isVirtualized = $derived(props.computeEstimatedOptionHeight !== undefined && !isHorizontal);

    const getIsAtEnd = ElementObserverSvelteUtils.createViewportIntersectionObserver(
        () => endMarker,
        () => !props.isLive,
    );

    const reachEndGuard = ListboxUtils.createReachEndGuard<SelectItem<T>[]>();

    $effect(() => {
        if (!getIsAtEnd() || !hasMoreOptions) return;

        untrack(() => {
            if (!reachEndGuard.claim(cursor.getOptions())) return;

            props.onReachEnd?.();
        });
    });

    $effect(() => {
        if (props.isLive) return;

        reachEndGuard.reset();
    });

    const rowWindow = VirtualizerSvelteUtils.createRowWindow(
        () => sizer,
        () => cursor.getRows().length,
        {
            getIsDisabled: () => !isVirtualized || !props.isLive,
            computeEstimatedSize: (index) =>
                ListboxUtils.computeEstimatedRowSize(
                    cursor.getRows()[index],
                    props.computeEstimatedOptionHeight,
                    props.computeEstimatedGroupHeight,
                ),
            getPinnedRows: () => ListboxUtils.getPinnedRows(cursor.getRows(), cursor.getHighlightedIndex()),
        },
    );

    $effect(() => {
        if (!rowWindow.getIsLive()) return;

        const rowIndex = ListboxUtils.getHighlightedRowIndex(cursor.getRows(), cursor.getHighlightedIndex());

        if (rowIndex === undefined) return;

        untrack(() => rowWindow.scrollToRow(rowIndex));
    });

    const floaterTransitionDurationMs = $derived(
        props.floaterTransitionDurationMs ?? LISTBOX_DEFAULTS.floaterTransitionDurationMs,
    );

    const recordOptionRef = (element: HTMLElement, getFlatIndex: () => number) => {
        untrack(() => optionRefs.set(element, getFlatIndex));

        return () => {
            optionRefs.delete(element);
        };
    };

    const findOptionRef = (index: number) =>
        [...optionRefs].find(([, getFlatIndex]) => getFlatIndex() === index)?.[0];

    const findOptionIndex = (target: EventTarget | null) =>
        target instanceof Node ? [...optionRefs].find(([element]) => element.contains(target))?.[1]() : undefined;

    const selectedIndex = $derived.by(() => {
        const index = SelectUtils.getFlatOptions(cursor.getOptions()).findIndex((option) =>
            props.computeIsSelected(option.value),
        );

        return index < 0 ? undefined : index;
    });

    const createFloater = (getIsEnabled: () => boolean, getIndex: () => number | undefined) =>
        FloaterSvelteUtils.create({
            getIsEnabled,
            getContainer: () => (isVirtualized ? (sizer ?? undefined) : (optionsWrapper ?? undefined)),
            getTarget: () => {
                const index = getIndex();

                return index === undefined ? undefined : findOptionRef(index);
            },
            getTransitionDurationMs: () => floaterTransitionDurationMs,
        });

    const selectionFloater = createFloater(
        () => props.renderSelectionFloater !== undefined,
        () => selectedIndex,
    );

    const highlightFloater = createFloater(
        () => props.renderHighlightFloater !== undefined,
        () => hoveredIndex ?? (cursor.getIsHighlightShown() ? cursor.getHighlightedIndex() : undefined),
    );

    const attachHoverWatch = (element: HTMLElement) => {
        const stopOver = on(element, "pointerover", (e) => {
            hoveredIndex = findOptionIndex(e.target);
        });
        const stopLeave = on(element, "pointerleave", () => {
            hoveredIndex = undefined;
        });

        return () => {
            stopOver();
            stopLeave();
        };
    };

    const windowedEntries = $derived(
        ListboxUtils.getWindowedRuns(rowWindow.getRows(), cursor.getRows()).flatMap<
            VirtualizerRow | ListboxWindowedRun<T, SelectOptionTooltipDefs>
        >((run) => (run.group ? [run] : run.rows)),
    );
</script>

{#snippet groupHeading(group: SelectOptionGroup<T>)}
    {@render props.renderGroup?.(group, ListboxUtils.computeGroupFlags(group, props.computeIsSelected))}
{/snippet}

{#snippet optionSlot(option: SelectOption<T>, flatIndex: number)}
    <InteractionWrapper
        sizing={isHorizontal ? "fit-content" : "fill"}
        isDisabled={(option.isDisabled ?? false) || isListDisabled}
        isReachableWhenDisabled={option.isReachableWhenDisabled ?? false}
        isFocusableWhenDisabled={isRoving && !isListDisabled && (option.isReachableWhenDisabled ?? false)}
        isTabbable={isRoving && flatIndex === cursor.getHighlightedIndex()}
        tooltipDefs={option.tooltipDefs}
        extraFlags={{
            isHighlighted: cursor.getIsHighlightShown() && flatIndex === cursor.getHighlightedIndex(),
            isSelected: props.computeIsSelected(option.value),
        }}
    >
        {#snippet renderControl(attachElement, flags)}
            {#snippet optionContent(optionFlags: InteractionFlags<SelectOptionFlags>)}
                {@render props.renderOption(option, optionFlags)}
            {/snippet}
            <ListboxOptionItem
                attachElement={(element) => {
                    const detach = attachElement(element);
                    const forget = recordOptionRef(element, () => flatIndex);

                    return () => {
                        detach?.();
                        forget();
                    };
                }}
                id={cursor.getOptionId(flatIndex)}
                isSelfScrolling={!isVirtualized}
                focusModel={cursor.focusModel}
                {flags}
                renderContent={optionContent}
                onFocus={isRoving ? () => cursor.highlight(option.value) : undefined}
                onSelect={() => cursor.pick(option.value)}
            />
        {/snippet}
    </InteractionWrapper>
{/snippet}

{#snippet windowedRow(row: VirtualizerRow)}
    {@const source = cursor.getRows()[row.index]}
    <div
        {@attach rowWindow.measureRow(row.index)}
        class={styles.listboxSizerRow}
        style:transform={`translateY(${rowWindow.getRowStart(row)}px)`}
    >
        {#if source.isEntry}
            {@render optionSlot(source.node as SelectOption<T>, source.entryOffset)}
        {:else}
            {@render groupHeading(source.node as SelectOptionGroup<T>)}
        {/if}
    </div>
{/snippet}

{#snippet floaterView(
    floater: ReturnType<typeof createFloater>,
    renderContent: Snippet<[visibilityTarget: 0 | 1, transitionDurationMs: number]> | undefined,
)}
    {#if floater.getIsRendered()}
        <div
            {@attach floater.attachRef}
            class={floaterStyles.floater}
            style={toStyle(floater.getBounds(), { transitionDuration: `${floaterTransitionDurationMs}ms` })}
        >
            {@render renderContent?.(floater.getVisibilityTarget(), floaterTransitionDurationMs)}
        </div>
    {/if}
{/snippet}

{#snippet floaters()}
    {@render floaterView(highlightFloater, props.renderHighlightFloater)}
    {@render floaterView(selectionFloater, props.renderSelectionFloater)}
{/snippet}

{#snippet endMarkerView()}
    {#if hasMoreOptions}
        {#key cursor.getOptions()}
            <div bind:this={endMarker} class={styles.listboxEndMarker} aria-hidden="true"></div>
        {/key}
    {/if}
{/snippet}

{#if isVirtualized}
    <div
        bind:this={sizer}
        {@attach attachHoverWatch}
        class={styles.listboxSizer}
        style:height={`${rowWindow.getTotalSize()}px`}
    >
        {@render floaters()}

        {#each windowedEntries as entry ("rows" in entry ? `group-${entry.groupIndex}` : entry.index)}
            {#if "rows" in entry}
                <div role="group" aria-label={entry.group?.label}>
                    {#each entry.rows as row (row.index)}
                        {@render windowedRow(row)}
                    {/each}
                </div>
            {:else}
                {@render windowedRow(entry)}
            {/if}
        {/each}
    </div>

    {@render endMarkerView()}
{:else}
    <div
        bind:this={optionsWrapper}
        {@attach attachHoverWatch}
        class={[styles.listboxOptions, isHorizontal && styles.listboxHorizontal]}
        role="presentation"
    >
        {@render floaters()}

        {#each cursor.getOptions() as item, index (index)}
            {#if SelectUtils.getIsGroup(item)}
                <div role="group" aria-label={item.label}>
                    {@render groupHeading(item)}

                    {#each item.options as option, groupIndex (groupIndex)}
                        {@render optionSlot(option, cursor.getItemRows()[index].entryOffset + groupIndex)}
                    {/each}
                </div>
            {:else}
                {@render optionSlot(item, cursor.getItemRows()[index].entryOffset)}
            {/if}
        {/each}

        {@render endMarkerView()}
    </div>
{/if}
