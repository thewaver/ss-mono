<script lang="ts">
    import { untrack } from "svelte";

    import { Toggle } from "@thewaver/ss-components-svelte";

    import PageToggleContent from "../../StyledComponents/ToggleContent/ToggleContent.svelte";
    import type { SkinStateProps } from "./AppearancePage.types";

    let props: SkinStateProps = $props();

    let checked = $state(untrack(() => props.isChecked ?? false));
</script>

<Toggle bind:checked isDisabled={props.isDisabled} hasError={props.hasError} ariaLabel={props.state}>
    {#snippet renderContent(flags)}
        <PageToggleContent {flags}>{props.state}</PageToggleContent>
    {/snippet}
</Toggle>
