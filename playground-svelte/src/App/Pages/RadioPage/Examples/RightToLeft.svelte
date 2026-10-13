<script lang="ts">
    import type { RadioOptionalExampleProps } from "../RadioPageSvelte.types";
    import DefaultExample from "./Default.svelte";

    type Props = RadioOptionalExampleProps;

    let { value = $bindable() }: Props = $props();
</script>

<div dir={"rtl"}>
    <DefaultExample bind:value />
</div>
