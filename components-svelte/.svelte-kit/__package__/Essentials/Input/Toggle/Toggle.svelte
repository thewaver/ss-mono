<script lang="ts">
    import BinarySwitch from "../../../Primitives/BinarySwitch/BinarySwitch.svelte";
    import type { ToggleProps } from "./Toggle.types.js";

    let { checked = $bindable(), ref = $bindable(), ...props }: ToggleProps = $props();
</script>

<BinarySwitch
    {...props}
    bind:ref
    type="checkbox"
    isSwitch={true}
    isChecked={checked}
    onChange={(isChecked) => {
        checked = isChecked;

        props.onChange?.(isChecked);
    }}
/>
