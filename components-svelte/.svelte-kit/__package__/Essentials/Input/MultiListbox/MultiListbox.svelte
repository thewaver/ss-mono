<script lang="ts" generics="T">
    import { SelectUtils, SelectionUtils } from "@thewaver/ss-components";

    import { createHeldValue } from "../../../Utils/bindableUtils.svelte.js";
    import ListboxComposite from "../Listbox/ListboxComposite.svelte";
    import type { MultiListboxProps } from "./MultiListbox.types.js";

    let { values = $bindable(), ...props }: MultiListboxProps<T> = $props();

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

<ListboxComposite
    {...props}
    isMultiple={true}
    {selectedOptions}
    computeIsSelected={(value) => getValues().includes(value)}
    onPick={(value) => {
        const nextValues = SelectionUtils.getToggled(getValues(), value);

        setValues(nextValues);

        props.onSelectionChange?.(nextValues);
    }}
/>
