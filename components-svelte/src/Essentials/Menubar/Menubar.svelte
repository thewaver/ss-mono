<script lang="ts" generics="T">
    import ToolbarComposite from "../Toolbar/ToolbarComposite.svelte";
    import type { MenubarProps } from "./Menubar.types.js";

    let { checked = $bindable(), ...props }: MenubarProps<T> = $props();
</script>

<ToolbarComposite {...props} bind:checked role="menubar" />
