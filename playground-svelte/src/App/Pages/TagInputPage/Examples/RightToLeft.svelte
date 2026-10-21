<script lang="ts">
    import type { TagInputExampleProps } from "../TagInputPage.types";
    import DefaultExample from "./Default.svelte";

    type Props = TagInputExampleProps;

    let { value = $bindable(), ...props }: Props = $props();
</script>

<div dir={"rtl"}>
    <DefaultExample
        bind:value
        isDisabled={props.isDisabled}
        hasError={props.hasError}
        ariaLabel={"Topics in a right-to-left box"}
    />
</div>
