<script lang="ts" generics="T">
    import type { MultiTreeProps } from "./Tree.types.js";
    import TreeComposite from "./TreeComposite.svelte";

    let { checked = $bindable([]), expanded = $bindable([]), ...props }: MultiTreeProps<T> = $props();
</script>

<TreeComposite {...props} bind:checked bind:expanded isMultiple={true} />
