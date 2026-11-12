<script lang="ts">
    import { untrack } from "svelte";

    import { Checkbox } from "@thewaver/ss-components-svelte";

    import PageCheckboxContent from "../../StyledComponents/CheckboxContent/CheckboxContent.svelte";
    import type { SkinStateProps } from "./AppearancePage.types";

    let props: SkinStateProps = $props();

    let checked = $state(untrack(() => props.isChecked ?? false));
</script>

<Checkbox
    bind:checked
    isMixed={props.isMixed}
    isDisabled={props.isDisabled}
    hasError={props.hasError}
    ariaLabel={props.state}
>
    {#snippet renderContent(flags)}
        <PageCheckboxContent {flags}>{props.state}</PageCheckboxContent>
    {/snippet}
</Checkbox>
