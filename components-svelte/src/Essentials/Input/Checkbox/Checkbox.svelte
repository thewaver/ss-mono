<script lang="ts" generics="T = unknown">
    import { untrack } from "svelte";

    import type { CheckboxGroupEntry } from "@thewaver/ss-components";

    import BinarySwitch from "../../../Primitives/BinarySwitch/BinarySwitch.svelte";
    import { getCheckboxGroupContext } from "../CheckboxGroup/CheckboxGroup.context.js";
    import type { CheckboxProps } from "./Checkbox.types.js";

    let { checked = $bindable(false), ref = $bindable(), ...props }: CheckboxProps<T> = $props();

    const groupContext = getCheckboxGroupContext();
    const group = $derived(props.value === undefined ? undefined : groupContext);

    const entry: CheckboxGroupEntry = {
        getValue: () => props.value,
        getIsDisabled: () => props.isDisabled ?? false,
    };

    $effect(() => {
        const register = group?.register;

        if (!register) return;

        return untrack(() => register(entry));
    });
</script>

<BinarySwitch
    {...props}
    bind:ref
    type="checkbox"
    isChecked={group ? group.computeIsChecked(props.value) : checked}
    onChange={(isChecked) => {
        if (group) group.setIsChecked(props.value, isChecked);
        else checked = isChecked;

        props.onChange?.(isChecked);
    }}
/>
