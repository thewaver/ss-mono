<script lang="ts" generics="T">
    import { type InteractionFlags, type SelectFlags, SelectUtils } from "@thewaver/ss-components";

    import { createHeldValue } from "../../../Utils/bindableUtils.svelte.js";
    import type { SelectOption, SelectProps } from "./Select.types.js";
    import SelectComposite from "./SelectComposite.svelte";

    const EMPTY_SELECTION: never[] = [];

    let {
        value = $bindable(),
        visibility = $bindable(false),
        query = $bindable(),
        ref = $bindable(),
        ...props
    }: SelectProps<T> = $props();

    const [getValue, setValue] = createHeldValue([
        () => value,
        (next) => {
            value = next;
        },
    ]);

    const selectedOptions = $derived.by(() => {
        const selectedOption = SelectUtils.getFlatOptions(props.options).find((option) => option.value === getValue());

        return selectedOption ? [selectedOption] : EMPTY_SELECTION;
    });
</script>

{#snippet content(selected: SelectOption<T>[], flags: InteractionFlags<SelectFlags>)}
    {@render props.renderContent(selected[0], flags)}
{/snippet}

<SelectComposite
    {...props}
    bind:visibility
    bind:query
    bind:ref
    {selectedOptions}
    computeIsSelected={(candidate) => candidate === getValue()}
    renderContent={content}
    onPick={(picked) => {
        if (picked === getValue()) return;

        setValue(picked);

        props.onSelectionChange?.(picked);
    }}
    onClear={() => {
        if (getValue() === undefined) return;

        setValue(undefined);

        props.onSelectionChange?.(undefined);
    }}
/>
