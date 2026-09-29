<script lang="ts" generics="T">
    import type { ToolbarProps } from "./Toolbar.types.js";
    import ToolbarComposite from "./ToolbarComposite.svelte";

    let { pressedValues = $bindable(), ...props }: ToolbarProps<T> = $props();
</script>

<ToolbarComposite {...props} bind:pressedValues role="toolbar" />
