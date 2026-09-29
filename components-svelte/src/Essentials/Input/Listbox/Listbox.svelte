<script lang="ts" generics="T">
    import { SelectUtils } from "@thewaver/ss-components";

    import { createHeldValue } from "../../../Utils/bindableUtils.svelte.js";
    import type { ListboxProps } from "./Listbox.types.js";
    import ListboxComposite from "./ListboxComposite.svelte";

    const EMPTY_SELECTION: never[] = [];

    let { value = $bindable(), ...props }: ListboxProps<T> = $props();

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

<ListboxComposite
    {...props}
    {selectedOptions}
    computeIsSelected={(candidate) => candidate === getValue()}
    onPick={(picked) => {
        if (picked === getValue()) return;

        setValue(picked);

        props.onSelectionChange?.(picked);
    }}
/>
