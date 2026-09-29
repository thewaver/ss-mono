<script lang="ts" generics="T">
    import { SelectUtils, SelectionUtils } from "@thewaver/ss-components";

    import { createHeldValue } from "../../../Utils/bindableUtils.svelte.js";
    import SelectComposite from "../Select/SelectComposite.svelte";
    import type { MultiSelectProps } from "./MultiSelect.types.js";

    let {
        values = $bindable(),
        visibility = $bindable(false),
        query = $bindable(),
        ref = $bindable(),
        ...props
    }: MultiSelectProps<T> = $props();

    const [getValues, setValues] = createHeldValue([
        () => values,
        (next) => {
            values = next;
        },
    ]);

    const selectedOptions = $derived(
        SelectUtils.getFlatOptions(props.options).filter((option) => getValues().includes(option.value)),
    );
</script>

<SelectComposite
    {...props}
    bind:visibility
    bind:query
    bind:ref
    isMultiple={true}
    {selectedOptions}
    computeIsSelected={(value) => getValues().includes(value)}
    renderContent={props.renderContent}
    onPick={(value) => {
        const nextValues = SelectionUtils.getToggled(getValues(), value);

        setValues(nextValues);

        props.onSelectionChange?.(nextValues);
    }}
    onClear={() => {
        if (getValues().length < 1) return;

        setValues([]);

        props.onSelectionChange?.([]);
    }}
/>
