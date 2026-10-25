<script lang="ts" generics="T">
    import { untrack } from "svelte";

    import type { ValueReportProps } from "./typeUtils.js";

    let props: ValueReportProps<T> = $props();

    $effect(() => {
        const value = props.value;

        untrack(() => props.onChange(value));
    });
</script>
