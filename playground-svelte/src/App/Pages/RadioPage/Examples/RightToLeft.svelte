<script lang="ts">
    import type { RadioOptionalExampleProps } from "../RadioPage.types";
    import DefaultExample from "./Default.svelte";

    type Props = RadioOptionalExampleProps;

    let { value = $bindable() }: Props = $props();
</script>

<div dir={"rtl"}>
    <DefaultExample bind:value />
</div>
