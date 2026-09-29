<script lang="ts" generics="T">
    import { untrack } from "svelte";

    import {
        type InteractionFlags,
        ListboxUtils,
        type ListboxWindowedRun,
        type SelectOptionFlags,
        SelectUtils,
        type VirtualizerRow,
        ListboxStyles as styles,
    } from "@thewaver/ss-components";

    import { ElementObserverSvelteUtils } from "../../../Abstracts/ElementObserver/ElementObserverSvelte.utils.svelte.js";
    import { VirtualizerSvelteUtils } from "../../../Abstracts/Virtualizer/VirtualizerSvelte.utils.svelte.js";
    import InteractionWrapper from "../../../Primitives/InteractionWrapper/InteractionWrapper.svelte";
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
                {attachElement}
                id={cursor.getOptionId(flatIndex)}
                isSelfScrolling={!isVirtualized}
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

{#if isVirtualized}
    <div bind:this={sizer} class={styles.listboxSizer} style:height={`${rowWindow.getTotalSize()}px`}>
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
{:else}
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
{/if}

{#if hasMoreOptions}
    {#key cursor.getOptions()}
        <div bind:this={endMarker} class={styles.listboxEndMarker} aria-hidden="true"></div>
    {/key}
{/if}
