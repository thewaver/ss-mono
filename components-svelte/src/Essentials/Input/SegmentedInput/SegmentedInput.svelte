<script lang="ts">
    import { untrack } from "svelte";

    import {
        SEGMENTED_INPUT_DEFAULTS,
        type SegmentedInputSelection,
        SegmentedInputUtils,
        TextSyncUtils,
        SegmentedInputStyles as styles,
    } from "@thewaver/ss-components";

    import TextField from "../../../Primitives/TextField/TextField.svelte";
    import type { SegmentedInputProps } from "./SegmentedInput.types.js";

    const NO_SELECTION: SegmentedInputSelection = { start: 0, end: 0 };

    let { value = $bindable(), ref = $bindable(), ...props }: SegmentedInputProps = $props();

    let cells = $state<(HTMLDivElement | null | undefined)[]>([]);

    let selection = $state.raw(NO_SELECTION);

    const element = $derived(ref as HTMLInputElement | undefined);
    const cellCount = $derived(Math.max(0, props.cellCount));
    const indices = $derived(Array.from({ length: cellCount }, (_unused, index) => index));

    const reportSelection = (next: SegmentedInputSelection) => {
        if (selection.start === next.start && selection.end === next.end) return;

        selection = next;
    };

    $effect(() => {
        const input = element;

        if (!input) return;

        return untrack(() =>
            SegmentedInputUtils.observeSelection(input, {
                getIsDisabled: () => props.isDisabled ?? false,
                getCells: () => cells.slice(0, cellCount).filter((cell): cell is HTMLDivElement => !!cell),
                onSelectionChange: reportSelection,
            }),
        );
    });

    $effect(() => {
        const input = element;

        value;

        if (!input) return;

        untrack(() => reportSelection(SegmentedInputUtils.readSelection(input)));
    });
</script>

<TextField
    {...props}
    bind:value
    bind:ref
    element="input"
    type="text"
    isConcealed={true}
    inputMode={props.inputMode ?? SEGMENTED_INPUT_DEFAULTS.inputMode}
    computeMaskedText={(_previous, next, caret) =>
        TextSyncUtils.applyFilter(
            props.computeIsAllowed ?? SEGMENTED_INPUT_DEFAULTS.computeIsAllowed,
            cellCount,
            next,
            caret,
        )}
>
    {#snippet renderContent(flags)}
        <div
            class={styles.segmentedInputCells}
            style:gap={`${props.gap ?? SEGMENTED_INPUT_DEFAULTS.gap}px`}
            aria-hidden="true"
        >
            {#each indices as index (index)}
                <div bind:this={cells[index]} class={styles.segmentedInputCell}>
                    {@render props.renderCell({
                        ...flags,
                        ...SegmentedInputUtils.computeCellFlags(index, {
                            isFocused: flags.isFocused ?? false,
                            selection,
                            cellCount,
                        }),
                        index,
                        char: value[index],
                    })}
                </div>
            {/each}
        </div>
    {/snippet}
</TextField>
