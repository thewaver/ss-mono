<script lang="ts">
    import type { TimeValue } from "@thewaver/ss-utils";

    import DefaultExample from "./Default.svelte";

    type Props = {
        value: TimeValue | undefined;
    };

    let { value = $bindable() }: Props = $props();
</script>

<div dir={"rtl"}>
    <DefaultExample bind:value ariaLabel={"Time in a right-to-left box"} />
</div>
