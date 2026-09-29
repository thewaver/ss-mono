<script lang="ts">
    import { Toggle } from "@thewaver/ss-components-svelte";

    import PageToggleContent from "../../StyledComponents/ToggleContent/ToggleContent.svelte";
    import { useFieldReset } from "./Field.context";
    import type { PageCheckFieldProps } from "./Field.types";

    let props: PageCheckFieldProps = $props();

    useFieldReset(
        () => props.value,
        (value) => props.onChange(value),
    );
</script>

<Toggle bind:checked={() => props.value, props.onChange} isDisabled={props.isDisabled} ariaLabel={props.ariaLabel}>
    {#snippet renderContent(flags)}
        <PageToggleContent {flags} />
    {/snippet}
</Toggle>
