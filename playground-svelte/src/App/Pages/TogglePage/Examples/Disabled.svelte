<script lang="ts">
    import { Toggle } from "@thewaver/ss-components-svelte";

    import PageToggleContent from "../../../StyledComponents/ToggleContent/ToggleContent.svelte";
    import type { ToggleExampleProps } from "../TogglePage.types";

    type Props = ToggleExampleProps;

    let { checked = $bindable() }: Props = $props();
</script>

<Toggle bind:checked ariaLabel={"Disabled toggle"} isDisabled={true}>
    {#snippet renderContent(flags)}
        <PageToggleContent {flags} />
    {/snippet}
</Toggle>
