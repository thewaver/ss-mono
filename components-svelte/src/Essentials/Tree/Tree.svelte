<script lang="ts" generics="T">
    import type { TreeProps } from "./Tree.types.js";
    import TreeComposite from "./TreeComposite.svelte";

    let { value = $bindable(), expanded = $bindable([]), ...props }: TreeProps<T> = $props();
</script>

<TreeComposite {...props} bind:value bind:expanded isMultiple={false} />
