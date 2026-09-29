<script lang="ts">
    import type { TreeExampleProps } from "../TreePage.types";
    import FilesExample from "./Files.svelte";

    type Props = TreeExampleProps;

    let { value = $bindable(), expanded = $bindable() }: Props = $props();
</script>

<div dir={"rtl"}>
    <FilesExample bind:value bind:expanded />
</div>
